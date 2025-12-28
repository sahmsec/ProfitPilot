import MetricCard from '../MetricCard';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <MetricCard
        title="Total Income"
        amount={125000}
        icon={TrendingUp}
        type="income"
        trend={{ value: 12.5, isPositive: true }}
      />
      <MetricCard
        title="Total Expenses"
        amount={78000}
        icon={TrendingDown}
        type="expense"
        trend={{ value: 8.3, isPositive: false }}
      />
      <MetricCard
        title="Net Profit"
        amount={47000}
        icon={Wallet}
        type="profit"
        trend={{ value: 18.2, isPositive: true }}
      />
    </div>
  );
}
