import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  type: "income" | "expense" | "profit";
  currencySymbol?: string;
}

function formatAmount(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(2)}M`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(2)}K`;
  }
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function MetricCard({ title, amount, icon: Icon, trend, type, currencySymbol = "$" }: MetricCardProps) {
  const getIconBgColor = () => {
    if (type === "income") return "bg-chart-2/10";
    if (type === "expense") return "bg-destructive/10";
    return "bg-primary/10";
  };

  const getIconColor = () => {
    if (type === "income") return "text-chart-2";
    if (type === "expense") return "text-destructive";
    return "text-primary";
  };

  const getAmountColor = () => {
    if (type === "income") return "text-chart-2";
    if (type === "expense") return "text-destructive";
    return amount >= 0 ? "text-chart-2" : "text-destructive";
  };

  return (
    <Card className="p-6 hover-elevate transition-shadow" data-testid={`card-metric-${type}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide" data-testid={`text-metric-title-${type}`}>
            {title}
          </p>
          <p className={`text-3xl md:text-4xl font-bold tabular-nums ${getAmountColor()} break-all`} data-testid={`text-metric-amount-${type}`}>
            {currencySymbol}{formatAmount(Math.abs(amount))}
          </p>
          {trend && (
            <div className="flex items-center gap-1">
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-chart-2' : 'text-destructive'}`} data-testid={`text-metric-trend-${type}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={`${getIconBgColor()} ${getIconColor()} p-4 rounded-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}
