import { type Column, type Table, type ColumnDef, type Row } from "@tanstack/react-table"
import { type DateRange } from "react-day-picker"
import { type LucideIcon } from "lucide-react"

// ─── Filter Option ───────────────────────────────────────────────────────────

export interface DataTableFilterOption {
  label: string
  value: string
  icon?: LucideIcon
  count?: number
}

// ─── Column Definitions ──────────────────────────────────────────────────────

export interface DataTableSearchableColumn<TData> {
  id: keyof TData & string
  placeholder?: string
}

export interface DataTableFilterableColumn<TData> {
  id: keyof TData & string
  title: string
  options: DataTableFilterOption[]
}

export interface DataTableDateFilterColumn<TData> {
  id: keyof TData & string
  title: string
}

// ─── Advanced Filters ────────────────────────────────────────────────────────

export type FilterOperator =
  | "contains"
  | "equals"
  | "starts_with"
  | "ends_with"
  | "is_empty"
  | "is_not_empty"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "before"
  | "after"
  | "between"

export type FilterFieldType = "text" | "number" | "date" | "select" | "boolean"

export interface AdvancedFilterField<TData> {
  id: keyof TData & string
  label: string
  type: FilterFieldType
  options?: DataTableFilterOption[]
}

export interface AdvancedFilterRule {
  id: string
  field: string
  operator: FilterOperator
  value: string
  type: FilterFieldType
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export interface BulkAction<TData> {
  label: string
  icon?: LucideIcon
  onClick: (rows: Row<TData>[]) => void | Promise<void>
  variant?: "default" | "destructive"
}

export interface RowAction<TData> {
  label: string
  icon?: LucideIcon
  onClick: (row: Row<TData>) => void | Promise<void>
  variant?: "default" | "destructive"
  separator?: boolean
}

// ─── DataTable Props ─────────────────────────────────────────────────────────

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]

  // Search
  searchableColumns?: DataTableSearchableColumn<TData>[]

  // Filters
  filterableColumns?: DataTableFilterableColumn<TData>[]
  dateFilterColumns?: DataTableDateFilterColumn<TData>[]
  enableAdvancedFilters?: boolean
  advancedFilterFields?: AdvancedFilterField<TData>[]

  // Selection
  enableRowSelection?: boolean

  // Column visibility
  enableColumnVisibility?: boolean

  // Actions
  bulkActions?: BulkAction<TData>[]
  rowActions?: RowAction<TData>[]

  // Pagination
  manualPagination?: boolean
  pageCount?: number
  totalRows?: number

  // Callbacks for server-side integration (Supabase)
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void
  onSortingChange?: (sorting: { id: string; desc: boolean }[]) => void
  onColumnFiltersChange?: (filters: { id: string; value: unknown }[]) => void

  // State
  isLoading?: boolean
  emptyMessage?: string
  emptyIcon?: LucideIcon

  // Styling
  className?: string
  compact?: boolean
}
