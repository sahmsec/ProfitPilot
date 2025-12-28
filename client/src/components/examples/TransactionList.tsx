import TransactionList, { Transaction } from '../TransactionList';

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    description: "Q4 Student Enrollments",
    amount: 45000,
    category: "Student Enrollments",
    date: "2025-10-15",
  },
  {
    id: "2",
    type: "expense",
    description: "Google Ads Campaign",
    amount: 3500,
    category: "Marketing & Advertising",
    date: "2025-10-14",
  },
  {
    id: "3",
    type: "income",
    description: "Corporate Training - TechCorp",
    amount: 28000,
    category: "Corporate Partnerships",
    date: "2025-10-12",
  },
  {
    id: "4",
    type: "expense",
    description: "Instructor Salaries",
    amount: 15000,
    category: "Salaries & Wages",
    date: "2025-10-10",
  },
  {
    id: "5",
    type: "income",
    description: "Certification Exam Fees",
    amount: 8500,
    category: "Certifications",
    date: "2025-10-08",
  },
];

export default function TransactionListExample() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <TransactionList
        transactions={mockTransactions}
        onEdit={(id) => console.log('Edit transaction:', id)}
        onDelete={(id) => console.log('Delete transaction:', id)}
      />
    </div>
  );
}
