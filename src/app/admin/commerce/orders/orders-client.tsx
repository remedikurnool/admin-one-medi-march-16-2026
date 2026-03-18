"use client"

import { DataTable, DataTableColumnHeader } from "@/components/admin"
import type { DataTableSearchableColumn, DataTableFilterableColumn, RowAction } from "@/types/data-table"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { ShoppingCart, Eye, RefreshCw, Clock, Package, CheckCircle, XCircle } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type Order = Record<string, unknown>

// ─── Status Configs ───────────────────────────────────────────────────────────

const orderStatusStyles: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  confirmed: 'bg-blue-500/10 text-blue-600 border-blue-200',
  delivered: 'bg-green-500/10 text-green-600 border-green-200',
  cancelled: 'bg-red-500/10 text-red-600 border-red-200',
}

const paymentStatusStyles: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  paid: 'bg-green-500/10 text-green-600 border-green-200',
  failed: 'bg-red-500/10 text-red-600 border-red-200',
  refunded: 'bg-gray-500/10 text-gray-600 border-gray-200',
}

// ─── Column Definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<Order, unknown>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold text-muted-foreground">
        #{String(row.getValue("id")).slice(0, 8).toUpperCase()}
      </span>
    ),
    size: 120,
  },
  {
    accessorKey: "order_status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = String(row.getValue("order_status") ?? 'pending')
      return (
        <Badge variant="outline" className={`text-xs capitalize ${orderStatusStyles[status] ?? ''}`}>
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return Array.isArray(value) ? value.includes(row.getValue(id)) : true
    },
  },
  {
    accessorKey: "payment_status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Payment" />,
    cell: ({ row }) => {
      const status = String(row.getValue("payment_status") ?? 'pending')
      return (
        <Badge variant="outline" className={`text-xs capitalize ${paymentStatusStyles[status] ?? ''}`}>
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return Array.isArray(value) ? value.includes(row.getValue(id)) : true
    },
  },
  {
    accessorKey: "total_amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => {
      const amount = Number(row.getValue("total_amount") ?? 0)
      return <span className="font-semibold text-sm">₹{amount.toFixed(2)}</span>
    },
  },
  {
    id: "items_count",
    header: "Items",
    accessorFn: (row) => {
      const items = row.medicine_order_items
      return Array.isArray(items) ? items.length : 0
    },
    cell: ({ row }) => {
      const count = Number(row.getValue("items_count"))
      return (
        <Badge variant="secondary" className="text-xs">
          {count} item{count !== 1 ? 's' : ''}
        </Badge>
      )
    },
  },
  {
    id: "has_prescription",
    header: "Rx",
    accessorFn: (row) => !!row.prescription_id,
    cell: ({ row }) => {
      const hasRx = row.getValue("has_prescription") as boolean
      return hasRx ? (
        <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 bg-blue-500/10">
          Rx
        </Badge>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const val = row.getValue("created_at")
      return (
        <span className="text-xs text-muted-foreground">
          {val ? new Date(String(val)).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
        </span>
      )
    },
  },
]

// ─── Configs ──────────────────────────────────────────────────────────────────

const searchableColumns: DataTableSearchableColumn<Order>[] = [
  { id: "id" as keyof Order & string, placeholder: "Search by order ID..." },
]

const filterableColumns: DataTableFilterableColumn<Order>[] = [
  {
    id: "order_status" as keyof Order & string,
    title: "Order Status",
    options: [
      { label: "Pending", value: "pending", icon: Clock },
      { label: "Confirmed", value: "confirmed", icon: Package },
      { label: "Delivered", value: "delivered", icon: CheckCircle },
      { label: "Cancelled", value: "cancelled", icon: XCircle },
    ],
  },
  {
    id: "payment_status" as keyof Order & string,
    title: "Payment Status",
    options: [
      { label: "Pending", value: "pending" },
      { label: "Paid", value: "paid" },
      { label: "Failed", value: "failed" },
      { label: "Refunded", value: "refunded" },
    ],
  },
]

const rowActions: RowAction<Order>[] = [
  {
    label: "View Details",
    icon: Eye,
    onClick: (row) => {
      console.log("View order:", row.original)
    },
  },
  {
    label: "Update Status",
    icon: RefreshCw,
    onClick: (row) => {
      console.log("Update order status:", row.original)
    },
  },
]

// ─── Client Component ─────────────────────────────────────────────────────────

export function OrdersClient({ data }: { data: Order[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <p className="text-sm font-medium">No medicine orders yet</p>
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
