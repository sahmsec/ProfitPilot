import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: string;
  category: string;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  currencySymbol?: string;
}

export default function TransactionList({ transactions, onEdit, onDelete, currencySymbol = "$" }: TransactionListProps) {
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "category">("date");
  const [showAll, setShowAll] = useState(false);

  const filteredTransactions = transactions
    .filter((t) => filter === "all" || t.type === filter)
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === "amount") {
        return parseFloat(b.amount) - parseFloat(a.amount);
      }
      // Sort by category
      return a.category.localeCompare(b.category);
    });

  const INITIAL_DISPLAY_COUNT = 3;
  const displayedTransactions = showAll 
    ? filteredTransactions 
    : filteredTransactions.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = filteredTransactions.length > INITIAL_DISPLAY_COUNT;

  return (
    <Card className="p-6 flex flex-col" style={{ minHeight: '580px' }} data-testid="card-transaction-list">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h2 className="text-2xl font-semibold" data-testid="text-list-title">
          Transaction History
        </h2>
        
        <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
          <SelectTrigger className="w-[140px]" data-testid="select-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income Only</SelectItem>
            <SelectItem value="expense">Expense Only</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
          <SelectTrigger className="w-[160px]" data-testid="select-sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="amount">Sort by Amount</SelectItem>
            <SelectItem value="category">Sort by Category</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-state">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border hover-elevate transition-all"
                data-testid={`transaction-${transaction.id}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={transaction.type === "income" ? "default" : "destructive"}
                      className="text-xs"
                      data-testid={`badge-type-${transaction.id}`}
                    >
                      {transaction.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground" data-testid={`text-date-${transaction.id}`}>
                      {new Date(transaction.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <p className="font-medium truncate" data-testid={`text-description-${transaction.id}`}>
                    {transaction.description}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid={`text-category-${transaction.id}`}>
                    {transaction.category}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <p
                    className={`text-xl font-bold tabular-nums ${
                      transaction.type === "income" ? "text-chart-2" : "text-destructive"
                    }`}
                    data-testid={`text-amount-${transaction.id}`}
                  >
                    {transaction.type === "income" ? "+" : "-"}{currencySymbol}
                    {parseFloat(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>

                  <div className="flex gap-1">
                    {onEdit && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit(transaction.id)}
                        data-testid={`button-edit-${transaction.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(transaction.id)}
                        data-testid={`button-delete-${transaction.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {hasMore && filteredTransactions.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowAll(!showAll)}
            data-testid="button-see-more"
          >
            {showAll ? "See Less" : `See More (${filteredTransactions.length - INITIAL_DISPLAY_COUNT} more)`}
          </Button>
        </div>
      )}
    </Card>
  );
}
