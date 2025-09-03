import { Plus, ToolCaseIcon } from "lucide-react";
import Button from "../../components/ui/Button";
import { PaymentStatusStatsCard } from "../../components/units/PaymentStatusStatsCard";
import { UnitStatusStatsCard } from "../../components/units/UnitStatusStatsCard";

export const Units = () => {
  const sample = [
    { name: "Occupied", value: 40, color: "#2563EB" },
    { name: "Vacant", value: 25, color: "#16A34A" },
    { name: "Reserved", value: 10, color: "#F59E0B" },
    { name: "Unavailable", value: 10, color: "#F59E1B" },
  ];

  const stats = [
    { value: 40, label: "Occupied" },
    { value: 25, label: "Vacant" },
    { value: 10, label: "Reserved" },
    { value: 10, label: "Unavailable" },
  ];

  const handleCreateUnit = async () => {
    alert("Create Unit action");
  };
  const handleTooltip = async () => {
    alert("Tooltip action");
  };
  return (
    <div className="flex flex-wrap gap-6">
      <div className="p-4">
        <UnitStatusStatsCard
          data={sample}
          stats={stats}
          height={240}
          totalValue={75}
        />
      </div>
      <div className="flex flex-wrap gap-6">
        <PaymentStatusStatsCard
          title="Paid"
          value={41}
          color="rgb(34 197 94)"
          width="8rem"
          height="10rem"
          // className="md:min-w-[18rem]" // Optional Tailwind overrides
        />
        <PaymentStatusStatsCard
          title="Not Paid"
          value={10}
          color="rgb(34 197 94)"
          width="8rem"
          height="10rem"
          // className="md:min-w-[18rem]" // Optional Tailwind overrides
        />
      </div>
      <div className="flex flex-row gap-4 mt-8 md:flex-col">
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
          leftIcon={ToolCaseIcon}
          variant="outline"
          className="h-10"
        />
      </div>
    </div>
  );
};
