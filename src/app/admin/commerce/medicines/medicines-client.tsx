"use client"

import { DataTable, DataTableSortHeader } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { Package } from "lucide-react"

export const medicineColumns: ColumnDef<Record<string, unknown>>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableSortHeader column={column} title="Name" />,
    cell: ({ row }) => <span className="font-medium">{String(row.getValue("name") ?? "—")}</span>,
  },
  {
    accessorKey: "brand",
    header: ({ column }) => <DataTableSortHeader column={column} title="Brand" />,
    cell: ({ row }) => <span className="text-muted-foreground">{String(row.getValue("brand") ?? "—")}</span>,
  },
  {
    accessorKey: "generic_name",
    header: "Generic Name",
    cell: ({ row }) => <span className="text-muted-foreground">{String(row.getValue("generic_name") ?? "—")}</span>,
  },
  {
    accessorKey: "dosage_form",
    header: "Form",
    cell: ({ row }) => <Badge variant="secondary" className="text-xs">{String(row.getValue("dosage_form") ?? "—")}</Badge>,
  },
  {
    accessorKey: "requires_prescription",
    header: "Rx",
    cell: ({ row }) => {
      const rx = row.getValue("requires_prescription")
      return rx ? (
        <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 bg-orange-500/10">Rx</Badge>
      ) : (
        <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-500/10">OTC</Badge>
      )
    },
  },
  {
    id: "stock",
    header: ({ column }) => <DataTableSortHeader column={column} title="Stock" />,
    accessorFn: (row) => {
      const inv = Array.isArray(row.medicine_inventory) ? row.medicine_inventory[0] : null
      return inv ? Number((inv as Record<string, unknown>).stock_quantity ?? 0) : 0
    },
    cell: ({ row }) => {
      const stock = Number(row.getValue("stock"))
      return (
        <span className={`font-semibold ${stock < 10 ? 'text-destructive' : 'text-green-600'}`}>
          {stock}
        </span>
      )
    },
  },
  {
    id: "price",
    header: ({ column }) => <DataTableSortHeader column={column} title="Price" />,
    accessorFn: (row) => {
      const inv = Array.isArray(row.medicine_inventory) ? row.medicine_inventory[0] : null
      return inv ? Number((inv as Record<string, unknown>).price ?? 0) : 0
    },
    cell: ({ row }) => {
      const price = Number(row.getValue("price"))
      return price ? `₹${price.toFixed(2)}` : '—'
    },
  },
]

export function MedicinesClient({ data }: { data: Record<string, unknown>[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <Package className="w-8 h-8" />
        </div>
        <p className="text-sm font-medium">No medicines registered</p>
      </div>
    )
  }

  return <DataTable columns={medicineColumns} data={data} searchKey="name" searchPlaceholder="Search medicines by name..." />
}
