'use client'

import { DataTable } from '@/components/admin'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Edit, Phone, Mail, MapPin } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'

interface Lab {
  id: string
  name: string
  contact_phone: string | null
  contact_email: string | null
  address: string | null
  is_active: boolean
  created_at: string
}

const columns: ColumnDef<Lab>[] = [
  {
    accessorKey: 'name',
    header: 'Lab Name',
    cell: ({ row }) => (
      <div className="font-medium text-sm">{row.getValue('name')}</div>
    ),
    size: 250,
  },
  {
    accessorKey: 'contact_phone',
    header: 'Contact',
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {row.original.contact_phone && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="w-3 h-3" />
            {row.original.contact_phone}
          </div>
        )}
        {row.original.contact_email && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="w-3 h-3" />
            {row.original.contact_email}
          </div>
        )}
      </div>
    ),
    size: 200,
  },
  {
    accessorKey: 'address',
    header: 'Location',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-xs text-muted-foreground max-w-[200px] truncate">
        <MapPin className="w-3 h-3 flex-shrink-0" />
        {row.getValue('address') || '—'}
      </div>
    ),
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const active = row.getValue('is_active') as boolean
      return (
        <Badge variant="outline" className={active ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-secondary text-secondary-foreground"}>
          {active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Joined On',
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground">
        {format(new Date(row.getValue('created_at')), 'MMM dd, yyyy')}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const lab = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log('View', lab.id)}>
              <Eye className="mr-2 h-4 w-4" /> View Lab
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Edit', lab.id)}>
              <Edit className="mr-2 h-4 w-4" /> Edit Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Deactivate Lab
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function LabsClient({ data }: { data: any[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchableColumns={[
        {
          id: 'name',
          placeholder: 'Search lab name...',
        },
      ]}
      filterableColumns={[
        {
          id: 'is_active',
          title: 'Status',
          options: [
            { label: 'Active', value: 'true' },
            { label: 'Inactive', value: 'false' },
          ],
        },
      ]}
    />
  )
}
