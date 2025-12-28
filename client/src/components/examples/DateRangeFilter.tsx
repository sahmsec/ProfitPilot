import { useState } from 'react';
import DateRangeFilter, { DateRange } from '../DateRangeFilter';

export default function DateRangeFilterExample() {
  const [selectedRange, setSelectedRange] = useState<DateRange>("30d");
  const [customStart, setCustomStart] = useState<Date>();
  const [customEnd, setCustomEnd] = useState<Date>();

  return (
    <div className="p-6">
      <DateRangeFilter
        selectedRange={selectedRange}
        onRangeChange={(range) => {
          console.log('Range changed:', range);
          setSelectedRange(range);
        }}
        customStartDate={customStart}
        customEndDate={customEnd}
        onCustomDateChange={(start, end) => {
          console.log('Custom dates:', start, end);
          setCustomStart(start);
          setCustomEnd(end);
          setSelectedRange("custom");
        }}
      />
      <p className="mt-4 text-sm text-muted-foreground">
        Selected: {selectedRange}
      </p>
    </div>
  );
}
