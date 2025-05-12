import { cn } from "@/lib/utils";

interface ConfidenceMeterProps {
  value: number;
  status?: "success" | "warning" | "danger" | "neutral";
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ConfidenceMeter({
  value,
  status = "neutral",
  label,
  showPercentage = true,
  className,
}: ConfidenceMeterProps) {
  // Ensure value is between 0 and 100
  const safeValue = Math.max(0, Math.min(100, value));
  
  // Determine color based on status
  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "bg-status-success";
      case "warning":
        return "bg-status-warning";
      case "danger":
        return "bg-status-danger";
      default:
        return "bg-blue-500";
    }
  };
  
  // Determine text color based on status
  const getTextColor = () => {
    switch (status) {
      case "success":
        return "text-status-success";
      case "warning":
        return "text-status-warning";
      case "danger":
        return "text-status-danger";
      default:
        return "text-blue-500";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between mb-2">
          {label && <span className="font-medium">{label}</span>}
          {showPercentage && (
            <span className={cn("font-bold", getTextColor())}>
              {safeValue}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500 ease-out", getStatusColor())}
          style={{ width: `${safeValue}%` }}
        ></div>
      </div>
    </div>
  );
}
