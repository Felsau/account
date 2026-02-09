import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  color: string;
}

export default function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1.5 tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-gray-800 tracking-tight">{value}</p>
          {change && (
            <p
              className={cn(
                "text-xs mt-1.5 font-medium",
                changeType === "positive" && "text-emerald-600",
                changeType === "negative" && "text-rose-600",
                changeType === "neutral" && "text-gray-400"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className={cn("p-3.5 rounded-2xl transition-transform duration-300 group-hover:scale-110", color)}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </div>
  );
}
