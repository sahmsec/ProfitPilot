import MonthlyChart from '../MonthlyChart';

const mockData = [
  { month: "Jun", income: 85000, expenses: 62000 },
  { month: "Jul", income: 92000, expenses: 68000 },
  { month: "Aug", income: 88000, expenses: 71000 },
  { month: "Sep", income: 105000, expenses: 74000 },
  { month: "Oct", income: 125000, expenses: 78000 },
];

export default function MonthlyChartExample() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <MonthlyChart data={mockData} />
    </div>
  );
}
