"use client"

import { DataTable, DataTableColumnHeader } from "@/components/admin"
import type { DataTableSearchableColumn, DataTableFilterableColumn, RowAction } from "@/types/data-table"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { Box, PackageMinus, ToggleRight } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type InventoryItem = Record<string, unknown>

// ─── Column Definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<InventoryItem, unknown>[] = [
  {
    id: "medicine_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Medicine" />,
    accessorFn: (row) => {
      const med = row.medicines as Record<string, unknown> | null
      return med ? String(med.name ?? "—") : "—"
    },
    cell: ({ row }) => {
      const med = row.original.medicines as Record<string, unknown> | null
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{med ? String(med.name ?? "—") : "—"}</span>
          {med?.brand ? <span className="text-xs text-muted-foreground">{String(med.brand)}</span> : null}
        </div>
      )
    },
    size: 240,
  },
  {
    accessorKey: "sku",
    header: ({ column }) => <DataTableColumnHeader column={column} title="SKU" />,
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">{String(row.getValue("sku") ?? "—")}</span>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ row }) => {
      const price = Number(row.getValue("price") ?? 0)
      return price ? (
        <span className="font-semibold text-sm">₹{price.toFixed(2)}</span>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      )
    },
  },
  {
    accessorKey: "stock_quantity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock Qty" />,
    cell: ({ row }) => {
      const qty = Number(row.getValue("stock_quantity") ?? 0)
      let colorClass = "text-green-600"
      if (qty < 10) colorClass = "text-destructive"
      else if (qty < 50) colorClass = "text-yellow-600"
      return (
        <div className="flex items-center gap-2">
          <span className={`font-bold text-sm ${colorClass}`}>{qty}</span>
          {qty < 10 && (
            <Badge variant="outline" className="text-[10px] text-destructive border-destructive/30 bg-destructive/10 px-1.5 py-0">
              LOW
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    id: "value",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Value" />,
    accessorFn: (row) => Number(row.price ?? 0) * Number(row.stock_quantity ?? 0),
    cell: ({ row }) => {
      const val = Number(row.getValue("value"))
      return <span className="text-sm font-medium">₹{val.toLocaleString('en-IN')}</span>
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const active = row.getValue("is_active") as boolean
      return active ? (
        <Badge className="text-xs bg-emerald-500/15 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20" variant="outline">
          Active
        </Badge>
      ) : (
        <Badge variant="outline" className="text-xs text-muted-foreground">
          Inactive
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) return true
      const active = row.getValue(id) as boolean
      return value.includes(active ? "active" : "inactive")
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated" />,
    cell: ({ row }) => {
      const val = row.getValue("updated_at")
      return (
        <span className="text-xs text-muted-foreground">
          {val ? new Date(String(val)).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
        </span>
      )
    },
  },
]

// ─── Configs ──────────────────────────────────────────────────────────────────

const searchableColumns: DataTableSearchableColumn<InventoryItem>[] = [
  { id: "medicine_name" as keyof InventoryItem & string, placeholder: "Search by medicine name..." },
]

const filterableColumns: DataTableFilterableColumn<InventoryItem>[] = [
  {
    id: "is_active" as keyof InventoryItem & string,
    title: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
]

const rowActions: RowAction<InventoryItem>[] = [
  {
    label: "Adjust Stock",
    icon: PackageMinus,
    onClick: (row) => {
      console.log("Adjust stock:", row.original)
    },
  },
  {
    label: "Toggle Active",
    icon: ToggleRight,
    onClick: (row) => {
      console.log("Toggle active:", row.original)
    },
  },
]

// ─── Client Component ─────────────────────────────────────────────────────────

export function InventoryClient({ data }: { data: InventoryItem[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <Box className="w-8 h-8" />
        </div>
        <p className="text-sm font-medium">No inventory items found</p>
      </div>
    )
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      searchableColumns={searchableColumns}
      filterableColumns={filterableColumns}
      rowActions={rowActions}
      enableRowSelection
      enableColumnVisibility
    />
  )
}
