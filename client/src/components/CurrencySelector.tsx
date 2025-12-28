import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Banknote } from "lucide-react";

export type Currency = "USD" | "BDT" | "CNY";

interface CurrencySelectorProps {
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  BDT: "৳",
  CNY: "¥",
};

export const CURRENCY_NAMES: Record<Currency, string> = {
  USD: "USD ($)",
  BDT: "BDT (৳)",
  CNY: "CNY (¥)",
};

export default function CurrencySelector({
  selectedCurrency,
  onCurrencyChange,
}: CurrencySelectorProps) {
  return (
    <Select value={selectedCurrency} onValueChange={(v) => onCurrencyChange(v as Currency)}>
      <SelectTrigger className="w-[130px]" data-testid="select-currency">
        <Banknote className="w-4 h-4 mr-1" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="USD">USD ($)</SelectItem>
        <SelectItem value="BDT">BDT (৳)</SelectItem>
        <SelectItem value="CNY">CNY (¥)</SelectItem>
      </SelectContent>
    </Select>
  );
}
