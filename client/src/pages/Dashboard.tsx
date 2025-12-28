// Reference: blueprint:javascript_log_in_with_replit for auth setup
import { useState, useMemo, useEffect } from "react";
import { TrendingUp, TrendingDown, Wallet, LogOut, Shield } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import MetricCard from "@/components/MetricCard";
import TransactionForm from "@/components/TransactionForm";
import TransactionList, { Transaction } from "@/components/TransactionList";
import MonthlyChart from "@/components/MonthlyChart";
import CategoryChart from "@/components/CategoryChart";
import ThemeToggle from "@/components/ThemeToggle";
import DateRangeFilter, { DateRange } from "@/components/DateRangeFilter";
import CurrencySelector, { Currency, CURRENCY_SYMBOLS } from "@/components/CurrencySelector";
import { ExportDialog } from "@/components/ExportDialog";

function getDateRangeStart(range: DateRange, customStart?: Date): Date {
  if (range === "custom" && customStart) {
    return customStart;
  }
  
  const now = new Date();
  const daysMap: Record<string, number> = {
    "3d": 3,
    "7d": 7,
    "30d": 30,
    "90d": 90,
  };
  const days = daysMap[range] || 30;
  
  const start = new Date(now);
  start.setDate(start.getDate() - days);
  return start;
}

function getDateRangeEnd(range: DateRange, customEnd?: Date): Date {
  if (range === "custom" && customEnd) {
    return customEnd;
  }
  return new Date();
}

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();
  const [currency, setCurrency] = useState<Currency>("BDT");
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Fetch transactions from backend
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: isAuthenticated,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, isLoading]);

  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    const startDate = getDateRangeStart(dateRange, customStartDate);
    const endDate = getDateRangeEnd(dateRange, customEndDate);
    
    return transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }, [transactions, dateRange, customStartDate, customEndDate]);

  // Calculate totals from filtered transactions
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const netProfit = totalIncome - totalExpenses;

  // Calculate expense breakdown by category from filtered transactions
  const expenseByCategory = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const existing = acc.find((item) => item.category === t.category);
      if (existing) {
        existing.amount += parseFloat(t.amount);
      } else {
        acc.push({ category: t.category, amount: parseFloat(t.amount) });
      }
      return acc;
    }, [] as { category: string; amount: number }[]);

  // Add transaction mutation
  const addTransactionMutation = useMutation({
    mutationFn: async (transaction: Omit<Transaction, "id" | "createdAt">) => {
      return await apiRequest("POST", "/api/transactions", transaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    },
  });

  // Delete transaction mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    },
  });

  const handleAddTransaction = (transaction: Omit<Transaction, "id" | "createdAt">) => {
    addTransactionMutation.mutate(transaction);
  };

  const handleEditTransaction = (id: string) => {
    console.log("Edit transaction:", id);
    // TODO: Implement edit functionality
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransactionMutation.mutate(id);
  };

  const handleLogout = () => {
    logout();
  };

  // Mock monthly data - can be enhanced with real aggregations later
  const monthlyData = [
    { month: "Recent", income: totalIncome, expenses: totalExpenses },
  ];

  if (isLoadingTransactions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-testid="text-app-title">
                Business Profit & Expense Tracker
              </h1>
              <p className="text-lg md:text-xl font-semibold mt-1">
                Arena Web Security
              </p>
            </div>
            <div className="flex items-center gap-2">
              {user?.isAdmin === "true" && (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid="button-admin"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Date Range and Currency Filter */}
        <div className="mb-6 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <DateRangeFilter
              selectedRange={dateRange}
              onRangeChange={setDateRange}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
              onCustomDateChange={(start, end) => {
                setCustomStartDate(start);
                setCustomEndDate(end);
                setDateRange("custom");
              }}
            />
            <CurrencySelector
              selectedCurrency={currency}
              onCurrencyChange={setCurrency}
            />
          </div>
          <ExportDialog />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Total Income"
            amount={totalIncome}
            icon={TrendingUp}
            type="income"
            trend={{ value: 12.5, isPositive: true }}
            currencySymbol={CURRENCY_SYMBOLS[currency]}
          />
          <MetricCard
            title="Total Expenses"
            amount={totalExpenses}
            icon={TrendingDown}
            type="expense"
            trend={{ value: 8.3, isPositive: false }}
            currencySymbol={CURRENCY_SYMBOLS[currency]}
          />
          <MetricCard
            title="Net Profit"
            amount={netProfit}
            icon={Wallet}
            type="profit"
            trend={{ value: 18.2, isPositive: true }}
            currencySymbol={CURRENCY_SYMBOLS[currency]}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MonthlyChart data={monthlyData} />
          <CategoryChart
            data={expenseByCategory}
            title="Expense Breakdown"
            type="expense"
            currencySymbol={CURRENCY_SYMBOLS[currency]}
          />
        </div>

        {/* Form and List */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <TransactionForm onSubmit={handleAddTransaction} />
          </div>
          <div className="lg:col-span-3">
            <TransactionList
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              currencySymbol={CURRENCY_SYMBOLS[currency]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
