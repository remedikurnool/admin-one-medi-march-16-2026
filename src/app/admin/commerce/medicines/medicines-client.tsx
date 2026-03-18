"use client"

import { DataTable, DataTableColumnHeader } from "@/components/admin"
import type { DataTableSearchableColumn, DataTableFilterableColumn, RowAction } from "@/types/data-table"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { Package, Eye, Pencil } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type Medicine = Record<string, unknown>

// ─── Column Definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<Medicine, unknown>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-sm">{String(row.getValue("name") ?? "—")}</span>
        {row.original.generic_name ? (
          <span className="text-xs text-muted-foreground">{String(row.original.generic_name)}</span>
        ) : null}
      </div>
    ),
    size: 220,
  },
  {
    accessorKey: "brand",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Brand" />,
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{String(row.getValue("brand") ?? "—")}</span>,
  },
  {
    accessorKey: "strength",
    header: "Strength",
    cell: ({ row }) => (
      <span className="text-sm">{String(row.getValue("strength") ?? "—")}</span>
    ),
  },
  {
    accessorKey: "dosage_form",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Form" />,
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-xs font-medium">
        {String(row.getValue("dosage_form") ?? "—")}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return Array.isArray(value) ? value.includes(row.getValue(id)) : true
    },
  },
  {
    accessorKey: "manufacturer",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Manufacturer" />,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{String(row.getValue("manufacturer") ?? "—")}</span>
    ),
  },
  {
    accessorKey: "requires_prescription",
    header: "Type",
    cell: ({ row }) => {
      const rx = row.getValue("requires_prescription")
      return rx ? (
        <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 bg-orange-500/10 gap-1">
          Rx
        </Badge>
      ) : (
        <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-500/10 gap-1">
          OTC
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) return true
      const rx = row.getValue(id)
      return value.includes(rx ? "rx" : "otc")
    },
  },
  {
    id: "stock",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
    accessorFn: (row) => {
      const inv = Array.isArray(row.medicine_inventory) ? row.medicine_inventory[0] : null
      return inv ? Number((inv as Record<string, unknown>).stock_quantity ?? 0) : 0
    },
    cell: ({ row }) => {
      const stock = Number(row.getValue("stock"))
      return (
        <span className={`font-semibold text-sm ${stock < 10 ? 'text-destructive' : stock < 50 ? 'text-yellow-600' : 'text-green-600'}`}>
          {stock}
        </span>
      )
    },
  },
  {
    id: "price",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    accessorFn: (row) => {
      const inv = Array.isArray(row.medicine_inventory) ? row.medicine_inventory[0] : null
      return inv ? Number((inv as Record<string, unknown>).price ?? 0) : 0
    },
    cell: ({ row }) => {
      const price = Number(row.getValue("price"))
      return price ? (
        <span className="font-semibold text-sm">₹{price.toFixed(2)}</span>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      )
    },
  },
  {
    id: "category",
    header: "Category",
    accessorFn: (row) => {
      const cat = Array.isArray(row.medicine_categories)
        ? row.medicine_categories[0]
        : row.medicine_categories
      return cat ? String((cat as Record<string, unknown>).name ?? "—") : "—"
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {String(row.getValue("category") ?? "—")}
      </Badge>
    ),
  },
]

// ─── Searchable & Filterable Configs ──────────────────────────────────────────

const searchableColumns: DataTableSearchableColumn<Medicine>[] = [
  { id: "name" as keyof Medicine & string, placeholder: "Search by medicine name..." },
]

const filterableColumns: DataTableFilterableColumn<Medicine>[] = [
  {
    id: "dosage_form" as keyof Medicine & string,
    title: "Dosage Form",
    options: [
      { label: "Tablet", value: "tablet" },
      { label: "Capsule", value: "capsule" },
      { label: "Syrup", value: "syrup" },
      { label: "Injection", value: "injection" },
      { label: "Cream", value: "cream" },
      { label: "Drops", value: "drops" },
      { label: "Inhaler", value: "inhaler" },
      { label: "Powder", value: "powder" },
    ],
  },
  {
    id: "requires_prescription" as keyof Medicine & string,
    title: "Type",
    options: [
      { label: "Rx Required", value: "rx" },
      { label: "OTC", value: "otc" },
    ],
  },
]

// ─── Row Actions ──────────────────────────────────────────────────────────────

const rowActions: RowAction<Medicine>[] = [
  {
    label: "View Details",
    icon: Eye,
    onClick: (row) => {
      console.log("View medicine:", row.original)
    },
  },
  {
    label: "Edit Medicine",
    icon: Pencil,
    onClick: (row) => {
      console.log("Edit medicine:", row.original)
    },
  },
]

// ─── Client Component ─────────────────────────────────────────────────────────

export function MedicinesClient({ data }: { data: Medicine[] }) {
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
