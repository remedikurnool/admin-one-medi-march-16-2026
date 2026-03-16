"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
} from "@tanstack/react-table"
import { Inbox } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTableToolbar } from "./DataTableToolbar"
import { DataTablePagination } from "./DataTablePagination"
import { DataTableAdvancedFilters } from "./DataTableAdvancedFilters"
import { DataTableRowActions } from "./DataTableRowActions"
import {
  type DataTableProps,
  type AdvancedFilterRule,
} from "@/types/data-table"

// ─────────────────────────────────────────────────────────────────────────────
// DataTable Component
// ─────────────────────────────────────────────────────────────────────────────

export function DataTable<TData, TValue>({
  columns: userColumns,
  data,
  searchableColumns,
  filterableColumns,
  dateFilterColumns,
  enableAdvancedFilters = false,
  advancedFilterFields = [],
  enableRowSelection = false,
  enableColumnVisibility = true,
  bulkActions = [],
  rowActions,
  manualPagination = false,
  pageCount: controlledPageCount,
  totalRows,
  onPaginationChange,
  onSortingChange,
  onColumnFiltersChange,
  isLoading = false,
  emptyMessage = "No results found.",
  emptyIcon: EmptyIcon = Inbox,
  className,
  compact = false,
}: DataTableProps<TData, TValue>) {
  // ── State ────────────────────────────────────────────────────────────────
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: compact ? 10 : 20,
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false)
  const [advancedFilters, setAdvancedFilters] = React.useState<AdvancedFilterRule[]>([])

  // ── Callbacks for server-side integration ────────────────────────────────
  React.useEffect(() => {
    onPaginationChange?.(pagination)
  }, [pagination, onPaginationChange])

  React.useEffect(() => {
    onSortingChange?.(
      sorting.map((s) => ({ id: s.id, desc: s.desc }))
    )
  }, [sorting, onSortingChange])

  React.useEffect(() => {
    onColumnFiltersChange?.(
      columnFilters.map((f) => ({ id: f.id, value: f.value }))
    )
  }, [columnFilters, onColumnFiltersChange])

  // ── Build columns array ──────────────────────────────────────────────────
  const columns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    const cols: ColumnDef<TData, TValue>[] = []

    // Selection column
    if (enableRowSelection) {
      cols.push({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      } as ColumnDef<TData, TValue>)
    }

    // User columns
    cols.push(...userColumns)

    // Row actions column
    if (rowActions && rowActions.length > 0) {
      cols.push({
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <DataTableRowActions row={row} actions={rowActions} />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 48,
      } as ColumnDef<TData, TValue>)
    }

    return cols
  }, [userColumns, enableRowSelection, rowActions])

  // ── Table instance ───────────────────────────────────────────────────────
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    enableRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: manualPagination ? undefined : getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: manualPagination ? undefined : getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    ...(manualPagination && {
      manualPagination: true,
      pageCount: controlledPageCount ?? -1,
    }),
  })

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={cn("space-y-3", className)}>
      {/* Toolbar */}
      <DataTableToolbar
        table={table}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        dateFilterColumns={dateFilterColumns}
        enableColumnVisibility={enableColumnVisibility}
        enableAdvancedFilters={enableAdvancedFilters}
        showAdvancedFilters={showAdvancedFilters}
        onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
        bulkActions={bulkActions}
      />

      {/* Advanced Filters Panel */}
      {enableAdvancedFilters && (
        <DataTableAdvancedFilters
          fields={advancedFilterFields}
          filters={advancedFilters}
          onFiltersChange={setAdvancedFilters}
          open={showAdvancedFilters}
        />
      )}

      {/* Table */}
      <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-muted/30 hover:bg-muted/30 border-b border-border/50"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                      compact ? "h-9 px-3" : "h-11 px-4"
                    )}
                    style={{
                      width: header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: pagination.pageSize > 5 ? 5 : pagination.pageSize }).map((_, i) => (
                <TableRow key={`skeleton-${i}`} className="hover:bg-transparent">
                  {columns.map((_, colIndex) => (
                    <TableCell
                      key={`skeleton-cell-${i}-${colIndex}`}
                      className={compact ? "px-3 py-2" : "px-4 py-3"}
                    >
                      <Skeleton className="h-4 w-full max-w-[200px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "group/table-row transition-colors duration-150",
                    "hover:bg-accent/30",
                    "data-[state=selected]:bg-primary/5 data-[state=selected]:border-primary/20",
                    rowIndex % 2 === 1 && "bg-muted/10"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        compact ? "px-3 py-2 text-sm" : "px-4 py-3"
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Empty state
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-40"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <div className="rounded-full bg-muted/50 p-3">
                      <EmptyIcon className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {emptyMessage}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination
        table={table}
        totalRows={totalRows}
      />
    </div>
  )
}
