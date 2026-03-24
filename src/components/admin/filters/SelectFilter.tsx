"use client"

import * as React from "react"
import { Check, PlusCircle } from "lucide-react"
import { type Column } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { type DataTableFilterOption } from "@/types/data-table"

interface SelectFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: DataTableFilterOption[]
}

export function SelectFilter<TData, TValue>({
  column,
  title,
  options,
}: SelectFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/60",
          "bg-background/50 px-3 h-9 text-sm font-medium text-muted-foreground",
          "hover:bg-accent/50 hover:text-foreground hover:border-border",
          "transition-all duration-200",
          selectedValues.size > 0 && "border-primary/30 bg-primary/5 text-foreground"
        )}
      >
        <PlusCircle className="h-4 w-4" />
        {title}
        {selectedValues?.size > 0 && (
          <>
            <Separator orientation="vertical" className="mx-1 h-4" />
            <Badge
              variant="secondary"
              className="rounded-md px-1.5 font-normal lg:hidden"
            >
              {selectedValues.size}
            </Badge>
            <div className="hidden space-x-1 lg:flex">
              {selectedValues.size > 2 ? (
                <Badge
                  variant="secondary"
                  className="rounded-md px-1.5 font-normal"
                >
                  {selectedValues.size} selected
                </Badge>
              ) : (
                options
                  .filter((option) => selectedValues.has(option.value))
                  .map((option) => (
                    <Badge
                      variant="secondary"
                      key={option.value}
                      className="rounded-md px-1.5 font-normal"
                    >
                      {option.label}
                    </Badge>
                  ))
              )}
            </div>
          </>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value)
                      } else {
                        selectedValues.add(option.value)
                      }
                      const filterValues = Array.from(selectedValues)
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      )
                    }}
                  >
                    <div
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 bg-transparent"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    {option.icon && (
                      <option.icon className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="flex-1 truncate">{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto font-mono text-xs text-muted-foreground">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center text-sm"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
