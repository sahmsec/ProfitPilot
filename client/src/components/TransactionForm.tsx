import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Maximize2 } from "lucide-react";

interface TransactionFormProps {
  onSubmit: (transaction: {
    type: "income" | "expense";
    description: string;
    amount: string;
    category: string;
    date: string;
  }) => void;
}

const incomeCategories = [
  "Student Enrollments",
  "Corporate Partnerships",
  "Consulting Services",
  "Training Materials",
  "Certifications",
  "Other Income",
];

const expenseCategories = [
  "Marketing & Advertising",
  "Salaries & Wages",
  "Software & Tools",
  "Training Materials",
  "Office Rent",
  "Utilities",
  "Other Expenses",
];

export default function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"income" | "expense">("income");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) return;

    onSubmit({
      type,
      description,
      amount,
      category,
      date,
    });

    setDescription("");
    setAmount("");
    setCategory("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  const handleDialogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) return;

    onSubmit({
      type,
      description,
      amount,
      category,
      date,
    });

    setDescription("");
    setAmount("");
    setCategory("");
    setDate(new Date().toISOString().split("T")[0]);
    setOpen(false);
  };

  const categories = type === "income" ? incomeCategories : expenseCategories;

  return (
    <>
      <Card className="p-6 relative" style={{ minHeight: '580px' }} data-testid="card-transaction-form">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold" data-testid="text-form-title">
            Add Transaction
          </h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setOpen(true)}
            data-testid="button-expand-form"
            type="button"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
        
        <Tabs value={type} onValueChange={(v) => setType(v as "income" | "expense")} className="mb-4">
          <TabsList className="grid w-full grid-cols-2" data-testid="tabs-transaction-type">
            <TabsTrigger value="income" data-testid="tab-income">Income</TabsTrigger>
            <TabsTrigger value="expense" data-testid="tab-expense">Expense</TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder={type === "income" ? "e.g., Q4 Student Enrollments" : "e.g., Google Ads Campaign"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              data-testid="input-description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                data-testid="input-amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                data-testid="input-date"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category" data-testid="select-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" data-testid="button-submit">
            Add {type === "income" ? "Income" : "Expense"}
          </Button>
        </form>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add New Transaction - Expanded View</DialogTitle>
            <DialogDescription>
              Record a new income or expense transaction with more space
            </DialogDescription>
          </DialogHeader>

          <Tabs value={type} onValueChange={(v) => setType(v as "income" | "expense")} className="mb-4">
            <TabsList className="grid w-full grid-cols-2" data-testid="tabs-transaction-type-dialog">
              <TabsTrigger value="income" data-testid="tab-income-dialog">Income</TabsTrigger>
              <TabsTrigger value="expense" data-testid="tab-expense-dialog">Expense</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleDialogSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description-dialog">Description</Label>
              <Textarea
                id="description-dialog"
                placeholder={type === "income" ? "e.g., Q4 Student Enrollments" : "e.g., Google Ads Campaign"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                data-testid="input-description-dialog"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount-dialog">Amount</Label>
                <Input
                  id="amount-dialog"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  data-testid="input-amount-dialog"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-dialog">Date</Label>
                <Input
                  id="date-dialog"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  data-testid="input-date-dialog"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-dialog">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category-dialog" data-testid="select-category-dialog">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
                data-testid="button-cancel-dialog"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" data-testid="button-submit-dialog">
                Add {type === "income" ? "Income" : "Expense"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
