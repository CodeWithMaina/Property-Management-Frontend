import { Plus, Briefcase } from "lucide-react";
import Button from "../../components/ui/Button";
import { PaymentStatusStatsCard } from "../../components/units/PaymentStatusStatsCard";
import { UnitStatusStatsCard } from "../../components/units/UnitStatusStatsCard";

export const Units = () => {
  const sample = [
    { name: "Occupied", value: 40, color: "rgb(var(--color-primary))" },
    { name: "Vacant", value: 25, color: "rgb(var(--color-success))" },
    { name: "Reserved", value: 10, color: "rgb(var(--color-error))" },
    { name: "Unavailable", value: 10, color: "rgb(var(--color-text-secondary))" },
  ];

  const stats = [
    { value: 40, label: "Occupied" },
    { value: 25, label: "Vacant" },
    { value: 10, label: "Reserved" },
    { value: 10, label: "Unavailable" },
  ];

  const handleCreateUnit = () => {
    alert("Create Unit action");
  };

  const handleTooltip = () => {
    alert("Tooltip action");
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Status Overview */}
      <div className="w-full p-4 bg-surface rounded-xl border border-border">
        <UnitStatusStatsCard
          data={sample}
          stats={stats}
          height={240}
          totalValue={85}
        />
      </div>

      {/* Payment Stats */}
      <div className="flex flex-wrap gap-6">
        <PaymentStatusStatsCard
          title="Paid"
          value={41}
          color="rgb(var(--color-success))"
          width="8rem"
          height="10rem"
        />
        <PaymentStatusStatsCard
          title="Not Paid"
          value={10}
          color="rgb(var(--color-error))"
          width="8rem"
          height="10rem"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-row gap-4 mt-4 md:flex-col">
        <Button
          title="Save"
          onAction={handleCreateUnit}
          leftIcon={Plus}
          variant="success"
          className="h-10"
        />
        <Button
          title="Delete"
          onAction={handleTooltip}
          leftIcon={Briefcase}
          variant="outline"
          className="h-10"
        />
      </div>
    </div>
  );
};
