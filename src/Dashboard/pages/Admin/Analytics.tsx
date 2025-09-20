// Dashboard.tsx
import React from "react";
import {
  Building2,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  MoreHorizontal,
  MapPin,
  Home,
  DollarSign,
  BarChart3,
  Plus,
  Wrench,
} from "lucide-react";
import Card from "../../DashboardDesign/Card";

export const Analytics: React.FC = () => {
  // Mock data for dashboard metrics
  const metrics = [
    {
      title: "Total Properties",
      value: "247",
      change: "+12%",
      trend: "up",
      icon: Building2,
      description: "Across all portfolios",
    },
    {
      title: "Occupancy Rate",
      value: "89%",
      change: "+3%",
      trend: "up",
      icon: Home,
      description: "Overall occupancy",
    },
    {
      title: "Monthly Revenue",
      value: "KES 4.2M",
      change: "+8%",
      trend: "up",
      icon: DollarSign,
      description: "Current month",
    },
    {
      title: "Maintenance Issues",
      value: "14",
      change: "-5%",
      trend: "down",
      icon: Wrench,
      description: "Active requests",
    },
  ];

  // Recent activity data
  const recentActivity = [
    {
      id: 1,
      type: "Lease Signed",
      property: "Westlands Apartment B12",
      tenant: "James Mwangi",
      date: "2 hours ago",
      amount: "KES 85,000",
    },
    {
      id: 2,
      type: "Payment Received",
      property: "Kilimani Villa",
      tenant: "Sarah Otieno",
      date: "5 hours ago",
      amount: "KES 120,000",
    },
    {
      id: 3,
      type: "Maintenance Request",
      property: "Kileleshwa Heights",
      tenant: "Michael Kamau",
      date: "1 day ago",
      amount: "-",
    },
    {
      id: 4,
      type: "Vacancy Notice",
      property: "Lavington Suite",
      tenant: "Grace Wanjiku",
      date: "2 days ago",
      amount: "-",
    },
  ];

  // Properties overview
  const properties = [
    {
      name: "Westlands Apartments",
      location: "Nairobi, Westlands",
      units: 24,
      occupancy: "92%",
      revenue: "KES 1.8M",
    },
    {
      name: "Kilimani Villas",
      location: "Nairobi, Kilimani",
      units: 12,
      occupancy: "100%",
      revenue: "KES 2.1M",
    },
    {
      name: "Kileleshwa Heights",
      location: "Nairobi, Kileleshwa",
      units: 18,
      occupancy: "83%",
      revenue: "KES 1.2M",
    },
    {
      name: "Lavington Suites",
      location: "Nairobi, Lavington",
      units: 8,
      occupancy: "75%",
      revenue: "KES 980K",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-1">
            Welcome back, Admin. Here's what's happening with your properties today.
          </p>
        </div>
        <button className="btn bg-accent hover:bg-accent-hover text-white">
          <Plus className="w-5 h-5" />
          Add Property
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} padding="md" hover>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-text-muted">{metric.title}</p>
                <h3 className="text-2xl font-bold text-text-primary mt-1">
                  {metric.value}
                </h3>
                <div
                  className={`flex items-center mt-2 text-sm ${
                    metric.trend === "up"
                      ? "text-success"
                      : "text-error"
                  }`}
                >
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  <span>{metric.change}</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-primary-muted text-primary">
                <metric.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-text-muted mt-3">{metric.description}</p>
          </Card>
        ))}
      </div>

      {/* Charts and Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <Card padding="md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-text-primary">
                Revenue Overview
              </h2>
              <button className="text-sm text-primary flex items-center">
                View Report
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            {/* Chart placeholder - would be replaced with a real chart library */}
            <div className="bg-surface-muted rounded-lg h-64 flex items-center justify-center">
              <BarChart3 className="w-12 h-12 text-text-muted" />
              <span className="ml-2 text-text-muted">Revenue chart visualization</span>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card padding="md" className="h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-text-primary">
                Recent Activity
              </h2>
              <button className="text-sm text-primary">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {activity.type}
                    </p>
                    <p className="text-sm text-text-secondary truncate">
                      {activity.property} · {activity.tenant}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {activity.date}
                    </p>
                  </div>
                  {activity.amount !== "-" && (
                    <div className="text-sm font-medium text-success">
                      {activity.amount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Properties Overview */}
      <Card padding="md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text-primary">
            Properties Overview
          </h2>
          <button className="text-sm text-primary flex items-center">
            View All Properties
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-sm font-medium text-text-muted">
                  Property
                </th>
                <th className="text-left py-3 text-sm font-medium text-text-muted">
                  Units
                </th>
                <th className="text-left py-3 text-sm font-medium text-text-muted">
                  Occupancy
                </th>
                <th className="text-left py-3 text-sm font-medium text-text-muted">
                  Revenue
                </th>
                <th className="text-right py-3 text-sm font-medium text-text-muted">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property, index) => (
                <tr key={index} className="border-b border-border last:border-0 hover:bg-surface-hover">
                  <td className="py-4">
                    <div>
                      <p className="font-medium text-text-primary">
                        {property.name}
                      </p>
                      <p className="text-sm text-text-muted flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {property.location}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 text-text-primary">
                    {property.units} units
                  </td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-surface-muted rounded-full h-2 mr-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: property.occupancy }}
                        ></div>
                      </div>
                      <span className="text-text-primary">{property.occupancy}</span>
                    </div>
                  </td>
                  <td className="py-4 font-medium text-text-primary">
                    {property.revenue}
                  </td>
                  <td className="py-4 text-right">
                    <button className="p-2 rounded-md hover:bg-surface-muted">
                      <MoreHorizontal className="w-4 h-4 text-text-muted" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
