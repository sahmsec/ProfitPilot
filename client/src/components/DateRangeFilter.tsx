import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";

export type DateRange = "3d" | "7d" | "30d" | "90d" | "custom";

interface DateRangeFilterProps {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
  customStartDate?: Date;
  customEndDate?: Date;
  onCustomDateChange?: (start: Date, end: Date) => void;
}

export default function DateRangeFilter({
  selectedRange,
  onRangeChange,
  customStartDate,
  customEndDate,
  onCustomDateChange,
}: DateRangeFilterProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(customStartDate);
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(customEndDate);

  const ranges = [
    { value: "3d" as const, label: "3 Days" },
    { value: "7d" as const, label: "7 Days" },
    { value: "30d" as const, label: "30 Days" },
    { value: "90d" as const, label: "90 Days" },
    { value: "custom" as const, label: "Custom" },
  ];

  const handleApplyCustom = () => {
    if (tempStartDate && tempEndDate && onCustomDateChange) {
      onCustomDateChange(tempStartDate, tempEndDate);
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2" data-testid="date-range-filter">
      {ranges.map((range) => (
        range.value === "custom" ? (
          <Popover key={range.value} open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={selectedRange === range.value ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (selectedRange !== "custom") {
                    onRangeChange(range.value);
                  }
                }}
                data-testid={`button-range-${range.value}`}
              >
                <Calendar className="w-4 h-4 mr-1" />
                {range.label}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="end">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Start Date</p>
                  <CalendarComponent
                    mode="single"
                    selected={tempStartDate}
                    onSelect={setTempStartDate}
                    disabled={(date) => date > new Date()}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">End Date</p>
                  <CalendarComponent
                    mode="single"
                    selected={tempEndDate}
                    onSelect={setTempEndDate}
                    disabled={(date) => {
                      if (date > new Date()) return true;
                      if (tempStartDate && date < tempStartDate) return true;
                      return false;
                    }}
                  />
                </div>
                <Button
                  onClick={handleApplyCustom}
                  disabled={!tempStartDate || !tempEndDate}
                  className="w-full"
                  data-testid="button-apply-custom"
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Button
            key={range.value}
            variant={selectedRange === range.value ? "default" : "outline"}
            size="sm"
            onClick={() => onRangeChange(range.value)}
            data-testid={`button-range-${range.value}`}
          >
            {range.label}
          </Button>
        )
      ))}
    </div>
  );
}
