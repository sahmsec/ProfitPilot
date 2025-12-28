import TransactionForm from '../TransactionForm';

export default function TransactionFormExample() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <TransactionForm
        onSubmit={(transaction) => {
          console.log('Transaction submitted:', transaction);
          alert(`${transaction.type.toUpperCase()}: $${transaction.amount} - ${transaction.description}`);
        }}
      />
    </div>
  );
}
