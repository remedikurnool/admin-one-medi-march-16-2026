"use client"

import { DataTable, DataTableSortHeader } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { ShoppingCart, Clock, CheckCircle, XCircle, Package } from "lucide-react"

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  pending: { color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200', icon: Clock },
  confirmed: { color: 'bg-blue-500/10 text-blue-600 border-blue-200', icon: Package },
  delivered: { color: 'bg-green-500/10 text-green-600 border-green-200', icon: CheckCircle },
  cancelled: { color: 'bg-red-500/10 text-red-600 border-red-200', icon: XCircle },
}

const paymentConfig: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  paid: 'bg-green-500/10 text-green-600 border-green-200',
  failed: 'bg-red-500/10 text-red-600 border-red-200',
  refunded: 'bg-gray-500/10 text-gray-600 border-gray-200',
}

export const orderColumns: ColumnDef<Record<string, unknown>>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{String(row.getValue("id")).slice(0, 8)}…</span>,
  },
  {
    accessorKey: "order_status",
    header: ({ column }) => <DataTableSortHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const statusKey = String(row.getValue("order_status") ?? 'pending')
      return (
        <Badge variant="outline" className={`text-xs ${statusConfig[statusKey]?.color ?? ''}`}>
          {statusKey}
        </Badge>
      )
    },
  },
  {
    accessorKey: "payment_status",
    header: ({ column }) => <DataTableSortHeader column={column} title="Payment" />,
    cell: ({ row }) => {
      const paymentKey = String(row.getValue("payment_status") ?? 'pending')
      return (
        <Badge variant="outline" className={`text-xs ${paymentConfig[paymentKey] ?? ''}`}>
          {paymentKey}
        </Badge>
      )
    },
  },
  {
    accessorKey: "total_amount",
    header: ({ column }) => <DataTableSortHeader column={column} title="Amount" />,
    accessorFn: (row) => Number(row.total_amount ?? 0),
    cell: ({ row }) => {
      const amount = Number(row.getValue("total_amount"))
      return <span className="font-semibold">₹{amount.toFixed(2)}</span>
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <DataTableSortHeader column={column} title="Date" />,
    accessorFn: (row) => row.created_at ? new Date(String(row.created_at)).getTime() : 0,
    cell: ({ row }) => {
      const val = Number(row.getValue("created_at"))
      return <span className="text-muted-foreground text-xs">{val ? new Date(val).toLocaleDateString('en-IN') : '—'}</span>
    },
  },
]

export function OrdersClient({ data }: { data: Record<string, unknown>[] }) {
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

  return <DataTable columns={orderColumns} data={data} searchKey="id" searchPlaceholder="Search order ID..." />
}
