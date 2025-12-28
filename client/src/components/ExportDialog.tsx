import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ExportDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetch(`/api/transactions/export/xml?${params.toString()}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `arena-web-security-${startDate || "all"}-to-${endDate || "all"}.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: "Your financial data has been exported to XML",
      });

      setOpen(false);
      setStartDate("");
      setEndDate("");
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" data-testid="button-export-xml">
          <Download className="mr-2 h-4 w-4" />
          Export XML
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="dialog-export">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Financial Data
          </DialogTitle>
          <DialogDescription>
            Download your transactions in XML format. Specify a date range to filter the data, or leave empty to export all transactions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="start-date">Start Date (Optional)</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              data-testid="input-start-date"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="end-date">End Date (Optional)</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              data-testid="input-end-date"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {!startDate && !endDate && (
              <p>✓ All transactions will be exported</p>
            )}
            {startDate && !endDate && (
              <p>✓ Transactions from {startDate} onwards will be exported</p>
            )}
            {!startDate && endDate && (
              <p>✓ Transactions up to {endDate} will be exported</p>
            )}
            {startDate && endDate && (
              <p>✓ Transactions between {startDate} and {endDate} will be exported</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            data-testid="button-cancel-export"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            data-testid="button-confirm-export"
          >
            {isExporting ? "Exporting..." : "Export XML"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
