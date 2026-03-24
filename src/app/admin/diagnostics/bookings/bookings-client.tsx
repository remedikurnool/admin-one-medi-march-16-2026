'use client'

import { DataTable } from '@/components/admin'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Edit, Beaker, Calendar, MapPin } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'

interface LabBooking {
  id: string
  user_id: string
  lab_id: string
  booking_status: string
  collection_type: string
  appointment_time: string
  total_amount: number
  created_at: string
  labs: { name: string } | null
  user_profiles: { full_name: string | null; email: string | null } | null
}

const statusStyles: Record<string, string> = {
  pending: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  confirmed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
}

const columns: ColumnDef<LabBooking>[] = [
  {
    accessorKey: 'id',
    header: 'Booking ID',
    cell: ({ row }) => (
      <div className="font-mono text-[10px] text-muted-foreground uppercase">
        {String(row.getValue('id')).slice(0, 8)}...
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: 'user_profiles.full_name',
    header: 'Patient',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-sm">
          {row.original.user_profiles?.full_name || 'Anonymous User'}
        </span>
        <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
          {row.original.user_profiles?.email || 'No email'}
        </span>
      </div>
    ),
    size: 200,
  },
  {
    accessorKey: 'labs.name',
    header: 'Laboratory',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm">
        <Beaker className="w-3.5 h-3.5 text-primary" />
        {row.original.labs?.name || '—'}
      </div>
    ),
    size: 200,
  },
  {
    accessorKey: 'booking_status',
    header: 'Status',
    cell: ({ row }) => {
      const status = String(row.getValue('booking_status'))
      return (
        <Badge variant="outline" className={`capitalize border-none ${statusStyles[status] || 'bg-secondary text-secondary-foreground'}`}>
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'total_amount',
    header: 'Amount',
    cell: ({ row }) => (
      <div className="font-bold text-sm">
        ₹{parseFloat(row.getValue('total_amount')).toLocaleString('en-IN')}
      </div>
    ),
  },
  {
    accessorKey: 'collection_type',
    header: 'Type',
    cell: ({ row }) => {
      const isHome = row.getValue('collection_type') === 'home'
      return (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {isHome ? <MapPin className="w-3 h-3 text-emerald-600" /> : <Beaker className="w-3 h-3 text-blue-600" />}
          {isHome ? 'Home' : 'Lab'}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'appointment_time',
    header: 'Slot',
    cell: ({ row }) => (
      <div className="flex flex-col text-[10px] text-muted-foreground">
        <span className="font-medium text-foreground">
          {format(new Date(row.getValue('appointment_time')), 'MMM dd')}
        </span>
        {format(new Date(row.getValue('appointment_time')), 'hh:mm a')}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuLabel>Booking Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Update Status
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Calendar className="mr-2 h-4 w-4" /> Reschedule
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function BookingsClient({ data }: { data: LabBooking[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchableColumns={[
        {
          id: 'user_profiles.full_name',
          placeholder: 'Search patient name...',
        },
      ]}
      filterableColumns={[
        {
          id: 'booking_status',
          title: 'Status',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Completed', value: 'completed' },
            { label: 'Cancelled', value: 'cancelled' },
          ],
        },
        {
          id: 'collection_type',
          title: 'Type',
          options: [
            { label: 'Home', value: 'home' },
            { label: 'Lab', value: 'lab' },
          ],
        },
      ]}
    />
  )
}
