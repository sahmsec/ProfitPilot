import CategoryChart from '../CategoryChart';

const mockExpenseData = [
  { category: "Marketing", amount: 18000 },
  { category: "Salaries", amount: 35000 },
  { category: "Software", amount: 8500 },
  { category: "Training", amount: 6000 },
  { category: "Rent", amount: 7500 },
  { category: "Other", amount: 3000 },
];

export default function CategoryChartExample() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <CategoryChart
        data={mockExpenseData}
        title="Expense Breakdown"
        type="expense"
      />
    </div>
  );
}
