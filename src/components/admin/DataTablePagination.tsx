"use client"

import * as React from "react"
import { type Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  totalRows?: number
  pageSizeOptions?: number[]
}

export function DataTablePagination<TData>({
  table,
  totalRows,
  pageSizeOptions = [10, 20, 30, 50, 100],
}: DataTablePaginationProps<TData>) {
  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length
  const filteredRowCount = totalRows ?? table.getFilteredRowModel().rows.length

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3">
      {/* Row Selection Info */}
      <div className="flex-1 text-sm text-muted-foreground">
        {selectedRowCount > 0 ? (
          <span className="font-medium text-foreground">
            {selectedRowCount} of {filteredRowCount} row(s) selected
          </span>
        ) : (
          <span>{filteredRowCount} total row(s)</span>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-6 lg:gap-8">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            Rows per page
          </p>
          <select
            value={`${table.getState().pagination.pageSize}`}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value))
            }}
            className="h-8 w-[70px] rounded-md border border-border/50 bg-background/50 px-2
              text-sm text-foreground outline-none
              focus:border-primary/30 focus:ring-2 focus:ring-primary/10
              transition-colors cursor-pointer"
          >
            {pageSizeOptions.map((pageSize) => (
              <option key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        {/* Page indicator */}
        <div className="flex items-center justify-center text-sm font-medium text-muted-foreground">
          Page{" "}
          <span className="mx-1 text-foreground">
            {table.getState().pagination.pageIndex + 1}
          </span>{" "}
          of{" "}
          <span className="ml-1 text-foreground">
            {table.getPageCount()}
          </span>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="disabled:opacity-30"
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">Go to first page</span>
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Go to previous page</span>
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Go to next page</span>
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="disabled:opacity-30"
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Go to last page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
