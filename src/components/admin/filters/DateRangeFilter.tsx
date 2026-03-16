"use client"

import * as React from "react"
import { format, subDays } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { type Column } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface DateRangeFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  className?: string
}

export function DateRangeFilter<TData, TValue>({
  column,
  title = "Date range",
  className,
}: DateRangeFilterProps<TData, TValue>) {
  const filterValue = column?.getFilterValue() as DateRange | undefined

  const [date, setDate] = React.useState<DateRange | undefined>(filterValue)

  const handleSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate)
    column?.setFilterValue(selectedDate)
  }

  const handleClear = () => {
    setDate(undefined)
    column?.setFilterValue(undefined)
  }

  const presets = [
    {
      label: "Today",
      range: { from: new Date(), to: new Date() },
    },
    {
      label: "Yesterday",
      range: {
        from: subDays(new Date(), 1),
        to: subDays(new Date(), 1),
      },
    },
    {
      label: "Last 7 days",
      range: { from: subDays(new Date(), 7), to: new Date() },
    },
    {
      label: "Last 30 days",
      range: { from: subDays(new Date(), 30), to: new Date() },
    },
    {
      label: "Last 90 days",
      range: { from: subDays(new Date(), 90), to: new Date() },
    },
  ]

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-9 justify-start text-left font-normal border-dashed border-border/60",
            "bg-background/50 hover:bg-accent/50 hover:border-border",
            "transition-all duration-200",
            !date && "text-muted-foreground",
            date && "border-primary/30 bg-primary/5 text-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd")} – {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>{title}</span>
          )}
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 border-border shadow-2xl rounded-xl"
          align="start"
        >
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="p-3 w-40 space-y-1 flex flex-col justify-start">
              <p className="text-xs font-medium text-muted-foreground px-2 pb-1">
                Presets
              </p>
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  className="justify-start w-full text-sm h-8"
                  onClick={() => handleSelect(preset.range)}
                >
                  {preset.label}
                </Button>
              ))}
              <Separator className="my-1" />
              <Button
                variant="ghost"
                className="justify-start w-full text-sm h-8 text-muted-foreground"
                onClick={handleClear}
              >
                Clear range
              </Button>
            </div>
            <div className="p-3">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleSelect}
                numberOfMonths={2}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
