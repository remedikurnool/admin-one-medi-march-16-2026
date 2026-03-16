"use client";

import * as React from "react";
import { format, subDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
}: DateRangePickerProps) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(
    date || {
      from: subDays(new Date(), 30),
      to: new Date(),
    }
  );

  React.useEffect(() => {
    if (date !== undefined) {
      setInternalDate(date);
    }
  }, [date]);

  const handleSelect = (selectedDate: DateRange | undefined) => {
    setInternalDate(selectedDate);
    if (onDateChange) {
      onDateChange(selectedDate);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger
          id="date"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-[260px] justify-start text-left font-normal border-border/50 bg-background/50 hover:bg-accent/50",
            !internalDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {internalDate?.from ? (
            internalDate.to ? (
              <>
                {format(internalDate.from, "LLL dd, y")} -{" "}
                {format(internalDate.to, "LLL dd, y")}
              </>
            ) : (
              format(internalDate.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-border shadow-2xl rounded-xl" align="end">
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="p-3 w-48 space-y-2 flex flex-col justify-start">
              <Button
                variant="ghost"
                className="justify-start w-full text-sm h-8"
                onClick={() =>
                  handleSelect({ from: new Date(), to: new Date() })
                }
              >
                Today
              </Button>
              <Button
                variant="ghost"
                className="justify-start w-full text-sm h-8"
                onClick={() =>
                  handleSelect({
                    from: subDays(new Date(), 1),
                    to: subDays(new Date(), 1),
                  })
                }
              >
                Yesterday
              </Button>
              <Button
                variant="ghost"
                className="justify-start w-full text-sm h-8"
                onClick={() =>
                  handleSelect({
                    from: subDays(new Date(), 7),
                    to: new Date(),
                  })
                }
              >
                Last 7 days
              </Button>
              <Button
                variant="ghost"
                className="justify-start w-full text-sm h-8"
                onClick={() =>
                  handleSelect({
                    from: subDays(new Date(), 30),
                    to: new Date(),
                  })
                }
              >
                Last 30 days
              </Button>
              <Separator className="my-2" />
              <Button
                variant="ghost"
                className="justify-start w-full text-sm h-8 text-muted-foreground"
                onClick={() => handleSelect(undefined)}
              >
                Clear range
              </Button>
            </div>
            <div className="p-3">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={internalDate?.from}
                selected={internalDate}
                onSelect={handleSelect}
                numberOfMonths={2}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
