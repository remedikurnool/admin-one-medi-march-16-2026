"use client"

import * as React from "react"
import { type Table } from "@tanstack/react-table"
import { SlidersHorizontal, X, Columns3 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchFilter, SelectFilter, DateRangeFilter } from "@/components/admin/filters"
import {
  type DataTableSearchableColumn,
  type DataTableFilterableColumn,
  type DataTableDateFilterColumn,
  type BulkAction,
} from "@/types/data-table"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchableColumns?: DataTableSearchableColumn<TData>[]
  filterableColumns?: DataTableFilterableColumn<TData>[]
  dateFilterColumns?: DataTableDateFilterColumn<TData>[]
  enableColumnVisibility?: boolean
  enableAdvancedFilters?: boolean
  showAdvancedFilters?: boolean
  onToggleAdvancedFilters?: () => void
  bulkActions?: BulkAction<TData>[]
  className?: string
}

export function DataTableToolbar<TData>({
  table,
  searchableColumns = [],
  filterableColumns = [],
  dateFilterColumns = [],
  enableColumnVisibility = true,
  enableAdvancedFilters = false,
  showAdvancedFilters = false,
  onToggleAdvancedFilters,
  bulkActions = [],
  className,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const selectedRows = table.getFilteredSelectedRowModel().rows

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {/* Search Inputs */}
        {searchableColumns.map((col) => (
          <SearchFilter
            key={col.id}
            value={
              (table.getColumn(col.id)?.getFilterValue() as string) ?? ""
            }
            onChange={(value) =>
              table.getColumn(col.id)?.setFilterValue(value)
            }
            placeholder={col.placeholder ?? `Search ${col.id}...`}
            className="w-[200px] lg:w-[250px]"
          />
        ))}

        {/* Faceted Filters */}
        {filterableColumns.map((col) =>
          table.getColumn(col.id) ? (
            <SelectFilter
              key={col.id}
              column={table.getColumn(col.id)}
              title={col.title}
              options={col.options}
            />
          ) : null
        )}

        {/* Date Filters */}
        {dateFilterColumns.map((col) =>
          table.getColumn(col.id) ? (
            <DateRangeFilter
              key={col.id}
              column={table.getColumn(col.id)}
              title={col.title}
            />
          ) : null
        )}

        {/* Reset Filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
            className="h-9 px-2 text-muted-foreground hover:text-foreground"
          >
            Reset
            <X className="ml-1 h-4 w-4" />
          </Button>
        )}

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Bulk actions */}
          {selectedRows.length > 0 && bulkActions.length > 0 && (
            <div className="flex items-center gap-1 mr-2 animate-in fade-in slide-in-from-right-4 duration-300">
              <span className="text-xs text-muted-foreground mr-1">
                {selectedRows.length} selected:
              </span>
              {bulkActions.map((action) => (
                <Button
                  key={action.label}
                  variant={action.variant === "destructive" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => action.onClick(selectedRows)}
                  className="h-8"
                >
                  {action.icon && <action.icon className="mr-1 h-3.5 w-3.5" />}
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {/* Advanced Filters Toggle */}
          {enableAdvancedFilters && (
            <Button
              variant={showAdvancedFilters ? "secondary" : "outline"}
              size="sm"
              onClick={onToggleAdvancedFilters}
              className="h-9"
            >
              <SlidersHorizontal className="mr-1.5 h-4 w-4" />
              Filters
            </Button>
          )}

          {/* Column Visibility */}
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="sm" className="h-9" />
                }
              >
                <Columns3 className="mr-1.5 h-4 w-4" />
                Columns
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                        className="capitalize"
                      >
                        {column.id.replace(/_/g, " ")}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  )
}
