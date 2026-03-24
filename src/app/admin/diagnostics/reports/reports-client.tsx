'use client'

import { DataTable } from '@/components/admin'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, ExternalLink, FileText, Beaker, Calendar, User } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'

interface LabReport {
  id: string
  booking_id: string
  file_url: string | null
  uploaded_at: string
  lab_bookings: {
    id: string
    user_id: string
    labs: { name: string } | null
  } | null
}

const columns: ColumnDef<LabReport>[] = [
  {
    accessorKey: 'id',
    header: 'Report ID',
    cell: ({ row }) => (
      <div className="font-mono text-[10px] text-muted-foreground uppercase">
        {String(row.getValue('id')).slice(0, 8)}...
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: 'booking_id',
    header: 'Booking',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-mono text-[10px] text-primary uppercase">
          {String(row.getValue('booking_id')).slice(0, 8)}...
        </span>
        <span className="text-xs text-muted-foreground">
          {row.original.lab_bookings?.labs?.name || '—'}
        </span>
      </div>
    ),
    size: 180,
  },
  {
    id: 'patient',
    header: 'Patient UID',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <User className="w-3 h-3" />
        {row.original.lab_bookings?.user_id?.slice(0, 8) || '—'}
      </div>
    ),
    size: 150,
  },
  {
    accessorKey: 'file_url',
    header: 'Document',
    cell: ({ row }) => {
      const url = row.getValue('file_url') as string
      return url ? (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1.5 py-1 font-medium">
          <FileText className="w-3.5 h-3.5" /> Result Available
        </Badge>
      ) : (
        <Badge variant="secondary" className="opacity-50">No File</Badge>
      )
    },
  },
  {
    accessorKey: 'uploaded_at',
    header: 'Upload Date',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Calendar className="w-3.5 h-3.5" />
        {format(new Date(row.getValue('uploaded_at')), 'MMM dd, yyyy HH:mm')}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const report = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuLabel>Report Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => report.file_url && window.open(report.file_url, '_blank')}>
              <ExternalLink className="mr-2 h-4 w-4" /> View Report
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" /> Verify Result
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Beaker className="mr-2 h-4 w-4" /> Link Booking
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function ReportsClient({ data }: { data: LabReport[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchableColumns={[
        {
          id: 'booking_id',
          placeholder: 'Search booking ID...',
        },
      ]}
    />
  )
}
