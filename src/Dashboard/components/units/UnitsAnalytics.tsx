import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Filter, 
  Download, 
  Calendar,
  Building,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid
} from "recharts";
import {
  useGetUnitAnalyticsOverviewQuery,
  useGetPropertyAnalyticsQuery,
  useGetOccupancyTrendAnalyticsQuery,
  useGetUnitDashboardQuery,
} from "../../../redux/endpoints/unitApi";

import type { TAnalyticsFilters, Status, TPropertyStats as TUnitPropertyStats, TTimeSeriesPoint, TUnitStats, ChartTooltipProps } from "../../../types/unit.types";
import Button from "../ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DatePicker } from "../ui/DatePicker";
import { Badge } from "../ui/Badge";
import { Skeleton } from "../ui/Skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { useGetOrganizationsQuery } from "../../../redux/endpoints/organizationApi";
import { useGetPropertiesQuery } from "../../../redux/endpoints/propertyApi";
import toast from "react-hot-toast";
import type { TOrganization } from "../../../types/organization.types";
import type { Property, TPaginatedPropertiesResponse, TPropertyStats } from "../../../types/property.types";

// Types for component state
interface FilterState extends TAnalyticsFilters {
  viewMode: 'overview' | 'properties' | 'trend' | 'dashboard';
  chartType: 'bar' | 'line' | 'area';
}

// Define proper types for analytics responses
interface AnalyticsOverviewResponse {
  data?: TUnitStats;
}

interface PropertyAnalyticsResponse {
  data?: TUnitPropertyStats[];
}

interface TrendAnalyticsResponse {
  data?: TTimeSeriesPoint[];
}

interface DashboardAnalyticsResponse {
  data?: {
    overview: TUnitStats;
    properties: TUnitPropertyStats[];
    trend: TTimeSeriesPoint[];
  };
}

// Status configuration with proper colors and labels
const STATUS_CONFIG = {
  occupied: { label: 'Occupied', color: '#22c55e' },
  vacant: { label: 'Vacant', color: '#facc15' },
  reserved: { label: 'Reserved', color: '#8b5cf6' },
  unavailable: { label: 'Unavailable', color: '#ef4444' },
  maintenance: { label: 'Maintenance', color: '#f97316' }
} as const;

const COLORS = {
  total: '#3b82f6',
  revenue: '#10b981',
  ...STATUS_CONFIG
};

// Helper functions
const getStatusCount = (statusBreakdown: { name: Status; value: number }[] | undefined, statusName: Status): number => {
  if (!statusBreakdown) return 0;
  const status = statusBreakdown.find(item => item.name === statusName);
  return status ? status.value : 0;
};

const extractData = <T,>(response: { data?: T } | undefined): T | null => {
  return response?.data || null;
};

const ensureArray = <T,>(data: T | T[] | null | undefined): T[] => {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

const transformPropertyStats = (properties: TUnitPropertyStats[]): TPropertyStats[] => {
  return properties.map(prop => ({
    id: prop.propertyId || prop.id || '',
    name: prop.propertyName || prop.name || 'Unknown Property',
    unitCount: prop.unitCount || 0,
    occupiedCount: prop.occupiedCount || 0,
    vacantCount: prop.vacantCount || 0,
    revenuePotential: prop.revenuePotential || 0,
    occupancyRate: prop.occupancyRate || 0
  }));
};

const transformOverviewStats = (overview: TUnitStats | null): TUnitStats => {
  if (!overview) {
    return {
      total: 0,
      active: 0,
      inactive: 0,
      byStatus: {},
      byBedrooms: {},
      byBathrooms: {},
      occupancyRate: 0,
      totalRevenuePotential: 0,
      averageRent: 0,
      statusBreakdown: [],
      totalUnits: 0,
      activeUnits: 0,
      inactiveUnits: 0
    };
  }
  
  // Ensure statusBreakdown has all status types with proper values
  const statusBreakdown = Object.entries(STATUS_CONFIG).map(([status]) => ({
    name: status as Status,
    value: overview.byStatus?.[status] || 
           overview.statusBreakdown?.find(item => item.name === status)?.value || 
           0
  }));

  return {
    ...overview,
    total: overview.total || overview.totalUnits || 0,
    active: overview.active || overview.activeUnits || 0,
    inactive: overview.inactive || overview.inactiveUnits || 0,
    byStatus: overview.byStatus || {},
    statusBreakdown,
    totalUnits: overview.totalUnits || overview.total || 0,
    activeUnits: overview.activeUnits || overview.active || 0,
    inactiveUnits: overview.inactiveUnits || overview.inactive || 0
  };
};

const transformTrendData = (trend: TTimeSeriesPoint[]): TTimeSeriesPoint[] => {
  return trend.map(item => ({
    date: item.date,
    occupied: item.occupied || 0,
    vacant: item.vacant || 0,
    reserved: item.reserved || 0,
    unavailable: item.unavailable || 0,
    maintenance: item.maintenance || 0
  }));
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Custom tooltip component for charts
const ChartTooltip: React.FC<ChartTooltipProps> = ({ 
  active, 
  payload, 
  label 
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        {label && <p className="font-medium mb-2">{label}</p>}
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const UnitsAnalytics: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    viewMode: 'dashboard',
    chartType: 'bar'
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // API calls with proper error handling
  const { 
    data: organizationsResponse, 
    isLoading: organizationsLoading,
    error: organizationsError 
  } = useGetOrganizationsQuery({ page: 1, limit: 100 });
  
  const { 
    data: propertiesListResponse, 
    isLoading: propertiesLoadingList,
    error: propertiesError 
  } = useGetPropertiesQuery({ 
    organizationId: filters.organizationId || undefined,
    page: 1, 
    limit: 100 
  });

  // Analytics queries with refetch dependencies
  const analyticsQueryParams = useMemo(() => ({
    organizationId: filters.organizationId || undefined,
    propertyId: filters.propertyId || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined
  }), [filters.organizationId, filters.propertyId, filters.startDate, filters.endDate]);

  const { 
    data: overviewResponse, 
    isLoading: overviewLoading, 
    refetch: refetchOverview,
    error: overviewError 
  } = useGetUnitAnalyticsOverviewQuery(analyticsQueryParams);

  const { 
    data: propertiesAnalyticsResponse, 
    isLoading: propertiesLoading, 
    refetch: refetchProperties,
    error: propertiesAnalyticsError 
  } = useGetPropertyAnalyticsQuery(analyticsQueryParams);

  const { 
    data: trendResponse, 
    isLoading: trendLoading, 
    refetch: refetchTrend,
    error: trendError 
  } = useGetOccupancyTrendAnalyticsQuery(analyticsQueryParams);

  const { 
    data: dashboardResponse, 
    isLoading: dashboardLoading, 
    refetch: refetchDashboard,
    error: dashboardError 
  } = useGetUnitDashboardQuery(analyticsQueryParams);

  // Handle API errors
  useEffect(() => {
    const errors = [
      organizationsError,
      propertiesError,
      overviewError,
      propertiesAnalyticsError,
      trendError,
      dashboardError
    ].filter(error => error);

    if (errors.length > 0) {
      toast.error('Failed to load analytics data');
    }
  }, [organizationsError, propertiesError, overviewError, propertiesAnalyticsError, trendError, dashboardError]);

  const loading = overviewLoading || propertiesLoading || trendLoading || dashboardLoading ||
                 organizationsLoading || propertiesLoadingList;

  // Memoized data transformations
  const organizations = useMemo(() => 
    organizationsResponse?.data || [], 
    [organizationsResponse]
  );

  const properties = useMemo(() => 
    (propertiesListResponse as TPaginatedPropertiesResponse)?.data || [], 
    [propertiesListResponse]
  );

  const filteredProperties = useMemo(() => 
    filters.organizationId 
      ? properties.filter(prop => prop.organizationId === filters.organizationId)
      : properties,
    [properties, filters.organizationId]
  );

  // Extract and transform analytics data
  const rawOverview = extractData<TUnitStats>(overviewResponse as AnalyticsOverviewResponse);
  const rawProperties = extractData<TUnitPropertyStats[]>(propertiesAnalyticsResponse as PropertyAnalyticsResponse);
  const rawTrend = extractData<TTimeSeriesPoint[]>(trendResponse as TrendAnalyticsResponse);
  // const rawDashboard = extractData(dashboardResponse as DashboardAnalyticsResponse);

  const overviewData = useMemo(() => transformOverviewStats(rawOverview), [rawOverview]);
  
  const propertiesDataList = useMemo(() => 
    rawProperties ? transformPropertyStats(ensureArray(rawProperties)) : [], 
    [rawProperties]
  );

  const trendData = useMemo(() => 
    rawTrend ? transformTrendData(ensureArray(rawTrend)) : [], 
    [rawTrend]
  );

  // const dashboardData = useMemo(() => 
  //   rawDashboard || {
  //     overview: overviewData,
  //     properties: propertiesDataList,
  //     trend: trendData
  //   }, 
  //   [rawDashboard, overviewData, propertiesDataList, trendData]
  // );

  // Check if we have data to display
  const hasData = useMemo(() => 
    overviewData.totalUnits > 0 || 
    propertiesDataList.length > 0 || 
    trendData.length > 0,
    [overviewData.totalUnits, propertiesDataList.length, trendData.length]
  );

  // Debounced refetch effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetchOverview();
      refetchProperties();
      refetchTrend();
      refetchDashboard();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [analyticsQueryParams, refetchOverview, refetchProperties, refetchTrend, refetchDashboard]);

  // Event handlers
  const handleOrganizationChange = useCallback((orgId: string) => {
    setFilters(prev => ({ 
      ...prev, 
      organizationId: orgId || null,
      propertyId: null
    }));
  }, []);

  const handlePropertyChange = useCallback((propertyId: string) => {
    setFilters(prev => ({ ...prev, propertyId: propertyId || null }));
  }, []);

  const handleDateRangeChange = useCallback((dates: { startDate?: string; endDate?: string }) => {
    setFilters(prev => ({ 
      ...prev, 
      startDate: dates.startDate || null, 
      endDate: dates.endDate || null 
    }));
  }, []);

  const handleExportData = useCallback(() => {
    toast.success("Exporting analytics data...");
    // Implementation would go here
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      viewMode: filters.viewMode,
      chartType: filters.chartType,
      organizationId: null,
      propertyId: null,
      startDate: null,
      endDate: null
    });
  }, [filters.viewMode, filters.chartType]);

  const handleRefreshData = useCallback(() => {
    refetchOverview();
    refetchProperties();
    refetchTrend();
    refetchDashboard();
    toast.success("Data refreshed");
  }, [refetchOverview, refetchProperties, refetchTrend, refetchDashboard]);

  // Filter section component
  const renderFilterSection = () => (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle className="text-lg">Filters</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onAction={handleRefreshData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onAction={() => setIsFilterOpen(!isFilterOpen)}
            >
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </div>
      </CardHeader>
      {isFilterOpen && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Organization</label>
              <Select
                value={filters.organizationId || ''}
                onValueChange={handleOrganizationChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Organizations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Organizations</SelectItem>
                  {organizations.map((org: TOrganization) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Property</label>
              <Select
                value={filters.propertyId || ''}
                onValueChange={handlePropertyChange}
                disabled={!filters.organizationId && organizations.length > 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    filters.organizationId 
                      ? "All Properties" 
                      : "Select organization first"
                  } />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Properties</SelectItem>
                  {filteredProperties.map((prop: Property) => (
                    <SelectItem key={prop.id} value={prop.id}>
                      {prop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <DatePicker
                mode="range"
                selected={{
                  from: filters.startDate ? new Date(filters.startDate) : undefined,
                  to: filters.endDate ? new Date(filters.endDate) : undefined
                }}
                onSelect={(range) => handleDateRangeChange({
                  startDate: range?.from?.toISOString().split('T')[0],
                  endDate: range?.to?.toISOString().split('T')[0]
                })}
              />
            </div>

            <div className="flex items-end gap-2">
              <Button onAction={handleResetFilters} variant="outline" className="w-full">
                Reset Filters
              </Button>
              <Button onAction={handleExportData} className="w-full" disabled={!hasData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );

  // Overview metrics component
  const renderOverviewMetrics = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Units</p>
              <h3 className="text-2xl font-bold">{overviewData.totalUnits.toLocaleString()}</h3>
            </div>
            <Building className="h-8 w-8 text-blue-500" />
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {overviewData.activeUnits.toLocaleString()} Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Occupancy Rate</p>
              <h3 className="text-2xl font-bold">{overviewData.occupancyRate.toFixed(1)}%</h3>
            </div>
            <PieChartIcon className="h-8 w-8 text-green-500" />
          </div>
          <div className="flex gap-1 mt-2 flex-wrap">
            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
              {getStatusCount(overviewData.statusBreakdown, 'occupied')} Occupied
            </Badge>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 text-xs">
              {getStatusCount(overviewData.statusBreakdown, 'vacant')} Vacant
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Revenue Potential</p>
              <h3 className="text-2xl font-bold">{formatCurrency(overviewData.totalRevenuePotential)}</h3>
            </div>
            <BarChart3 className="h-8 w-8 text-emerald-500" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Avg: {formatCurrency(overviewData.averageRent)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status Overview</p>
              <div className="space-y-1 mt-1 text-xs">
                <div className="flex justify-between">
                  <span>Reserved:</span>
                  <span className="font-medium">{getStatusCount(overviewData.statusBreakdown, 'reserved' as Status)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Maintenance:</span>
                  <span className="font-medium">{getStatusCount(overviewData.statusBreakdown, 'maintenance' as Status)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unavailable:</span>
                  <span className="font-medium">{getStatusCount(overviewData.statusBreakdown, 'unavailable' as Status)}</span>
                </div>
              </div>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Fixed status distribution chart
  const renderStatusDistribution = () => {
    const chartData = overviewData.statusBreakdown.filter(item => item.value > 0);
    
    if (chartData.length === 0) {
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Unit Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No status data available
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Unit Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${STATUS_CONFIG[name as Status]?.label || name}: ${value}`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={STATUS_CONFIG[entry.name as Status]?.color || '#8884d8'} 
                  />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend 
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }}>
                    {STATUS_CONFIG[value as Status]?.label || value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  // Property performance chart
  const renderPropertyPerformance = () => {
    if (propertiesDataList.length === 0) {
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Property Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No property data available
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Property Performance</CardTitle>
            <Select
              value={filters.chartType}
              onValueChange={(value: string) => 
                setFilters(prev => ({ ...prev, chartType: value as 'bar' | 'line' | 'area' }))
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Chart Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="area">Area Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            {filters.chartType === 'bar' ? (
              <BarChart data={propertiesDataList}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Bar dataKey="occupiedCount" fill={COLORS.occupied.color} name="Occupied" />
                <Bar dataKey="vacantCount" fill={COLORS.vacant.color} name="Vacant" />
                <Bar dataKey="unitCount" fill={COLORS.total} name="Total Units" />
              </BarChart>
            ) : filters.chartType === 'line' ? (
              <LineChart data={propertiesDataList}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="occupiedCount" stroke={COLORS.occupied.color} name="Occupied" />
                <Line type="monotone" dataKey="vacantCount" stroke={COLORS.vacant.color} name="Vacant" />
                <Line type="monotone" dataKey="unitCount" stroke={COLORS.total} name="Total Units" />
              </LineChart>
            ) : (
              <AreaChart data={propertiesDataList}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="occupiedCount" 
                  stroke={COLORS.occupied.color} 
                  fill={COLORS.occupied.color + '20'} 
                  name="Occupied" 
                />
                <Area 
                  type="monotone" 
                  dataKey="vacantCount" 
                  stroke={COLORS.vacant.color} 
                  fill={COLORS.vacant.color + '20'} 
                  name="Vacant" 
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  // Revenue analysis chart
  const renderRevenueAnalysis = () => {
    if (propertiesDataList.length === 0) {
      return null;
    }

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Revenue Potential by Property</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={propertiesDataList}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis tickFormatter={(value: number) => `$${value / 1000}k`} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(Number(value)), 'Revenue Potential']}
                content={<ChartTooltip />}
              />
              <Legend />
              <Bar dataKey="revenuePotential" fill={COLORS.revenue} name="Revenue Potential" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  // Occupancy trend chart
  const renderOccupancyTrend = () => {
    if (trendData.length === 0) {
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Occupancy Trend Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No trend data available for the selected period
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Occupancy Trend Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => formatDate(value)}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => formatDate(value)}
                content={<ChartTooltip />}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="occupied" 
                stackId="1" 
                stroke={COLORS.occupied.color} 
                fill={COLORS.occupied.color + '20'} 
                name="Occupied" 
              />
              <Area 
                type="monotone" 
                dataKey="vacant" 
                stackId="1" 
                stroke={COLORS.vacant.color} 
                fill={COLORS.vacant.color + '20'} 
                name="Vacant" 
              />
              <Area 
                type="monotone" 
                dataKey="reserved" 
                stackId="1" 
                stroke={COLORS.reserved.color} 
                fill={COLORS.reserved.color + '20'} 
                name="Reserved" 
              />
              <Area 
                type="monotone" 
                dataKey="unavailable" 
                stackId="1" 
                stroke={COLORS.unavailable.color} 
                fill={COLORS.unavailable.color + '20'} 
                name="Unavailable" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  // Loading state
  const renderLoadingState = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  );

  // Empty state
  const renderEmptyState = () => (
    <Card>
      <CardContent className="p-8 text-center">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
        <p className="text-gray-500 mb-4">
          {filters.organizationId || filters.propertyId || filters.startDate
            ? "Try adjusting your filters or check back later."
            : "No units found. Add some units to see analytics data."}
        </p>
        <Button onAction={handleResetFilters}>
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Units Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of unit performance and occupancy metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {filters.startDate && filters.endDate 
              ? `${formatDate(filters.startDate)} - ${formatDate(filters.endDate)}`
              : 'All Time'
            }
          </Badge>
          {(filters.organizationId || filters.propertyId) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              {filters.propertyId 
                ? `Property: ${filteredProperties.find(p => p.id === filters.propertyId)?.name || 'Selected'}`
                : filters.organizationId 
                  ? `Org: ${organizations.find(o => o.id === filters.organizationId)?.name || 'Selected'}`
                  : ''
              }
            </Badge>
          )}
        </div>
      </div>

      {/* Filter Section */}
      {renderFilterSection()}

      {/* Loading State */}
      {loading && renderLoadingState()}

      {/* Content Tabs */}
      {!loading && hasData && (
        <Tabs 
          value={filters.viewMode} 
          onValueChange={(value) => setFilters(prev => ({ ...prev, viewMode: value as any }))}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="trend">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {renderOverviewMetrics()}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderStatusDistribution()}
              {renderRevenueAnalysis()}
            </div>
            {renderPropertyPerformance()}
            {renderOccupancyTrend()}
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            {renderOverviewMetrics()}
            {renderStatusDistribution()}
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            {renderPropertyPerformance()}
            {renderRevenueAnalysis()}
          </TabsContent>

          <TabsContent value="trend" className="space-y-6">
            {renderOccupancyTrend()}
          </TabsContent>
        </Tabs>
      )}

      {/* Empty State */}
      {!loading && !hasData && renderEmptyState()}
    </div>
  );
};