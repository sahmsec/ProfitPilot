import { useState } from 'react';
import CurrencySelector, { Currency } from '../CurrencySelector';

export default function CurrencySelectorExample() {
  const [currency, setCurrency] = useState<Currency>("USD");

  return (
    <div className="p-6">
      <CurrencySelector
        selectedCurrency={currency}
        onCurrencyChange={(c) => {
          console.log('Currency changed:', c);
          setCurrency(c);
        }}
      />
      <p className="mt-4 text-sm text-muted-foreground">
        Selected: {currency}
      </p>
    </div>
  );
}
