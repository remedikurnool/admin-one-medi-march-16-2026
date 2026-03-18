"use client"

import { DataTable, DataTableColumnHeader } from "@/components/admin"
import type { DataTableSearchableColumn, RowAction } from "@/types/data-table"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { FileText, Eye, Link2 } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type Prescription = Record<string, unknown>

// ─── Column Definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<Prescription, unknown>[] = [
  {
    accessorKey: "id",
    header: "Rx ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold">
        {String(row.getValue("id")).slice(0, 8).toUpperCase()}
      </span>
    ),
    size: 110,
  },
  {
    accessorKey: "user_id",
    header: "User",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {String(row.getValue("user_id") ?? "—").slice(0, 12)}…
      </span>
    ),
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const notes = String(row.getValue("notes") ?? "")
      if (!notes.trim()) return <span className="text-muted-foreground text-xs">—</span>
      return (
        <span className="text-sm max-w-[300px] truncate block" title={notes}>
          {notes}
        </span>
      )
    },
    size: 300,
  },
  {
    id: "has_file",
    header: "File",
    accessorFn: (row) => !!row.file_url,
    cell: ({ row }) => {
      const hasFile = row.getValue("has_file") as boolean
      return hasFile ? (
        <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 bg-emerald-500/10 gap-1">
          <FileText className="w-3 h-3" />
          Uploaded
        </Badge>
      ) : (
        <Badge variant="outline" className="text-xs text-muted-foreground">
          No file
        </Badge>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Upload Date" />,
    cell: ({ row }) => {
      const val = row.getValue("created_at")
      return (
        <span className="text-xs text-muted-foreground">
          {val ? new Date(String(val)).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
          }) : '—'}
        </span>
      )
    },
  },
]

// ─── Configs ──────────────────────────────────────────────────────────────────

const searchableColumns: DataTableSearchableColumn<Prescription>[] = [
  { id: "id" as keyof Prescription & string, placeholder: "Search by prescription ID..." },
]

const rowActions: RowAction<Prescription>[] = [
  {
    label: "View Prescription",
    icon: Eye,
    onClick: (row) => {
      const fileUrl = String(row.original.file_url ?? '')
      if (fileUrl) {
        window.open(fileUrl, '_blank')
      } else {
        console.log("No file URL for prescription:", row.original)
      }
    },
  },
  {
    label: "Link to Order",
    icon: Link2,
    onClick: (row) => {
      console.log("Link to order:", row.original)
    },
  },
]

// ─── Client Component ─────────────────────────────────────────────────────────

export function PrescriptionsClient({ data }: { data: Prescription[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <FileText className="w-8 h-8" />
        </div>
        <p className="text-sm font-medium">No prescriptions uploaded</p>
      </div>
    )
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      searchableColumns={searchableColumns}
      rowActions={rowActions}
      enableRowSelection
      enableColumnVisibility
    />
  )
}
