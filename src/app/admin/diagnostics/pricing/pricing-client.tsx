'use client'

import { DataTable } from '@/components/admin'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Home, ToggleLeft } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

interface LabPricing {
  id: string
  lab_id: string
  test_id: string
  price: number
  home_collection_available: boolean
  is_active: boolean
  labs: { name: string } | null
  lab_tests: { test_name: string } | null
}

const columns: ColumnDef<LabPricing>[] = [
  {
    accessorKey: 'labs.name',
    header: 'Laboratory',
    cell: ({ row }) => (
      <div className="font-semibold text-sm text-primary">
        {row.original.labs?.name || '—'}
      </div>
    ),
    filterFn: (row, id, value) => {
      const labName = row.original.labs?.name
      return value.includes(labName)
    },
  },
  {
    accessorKey: 'lab_tests.test_name',
    header: 'Test Name',
    cell: ({ row }) => (
      <div className="font-medium text-sm">
        {row.original.lab_tests?.test_name || '—'}
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'))
      return (
        <div className="font-bold text-emerald-600">
          ₹{price.toLocaleString('en-IN')}
        </div>
      )
    },
  },
  {
    accessorKey: 'home_collection_available',
    header: 'Home Collection',
    cell: ({ row }) => {
      const available = row.getValue('home_collection_available') as boolean
      return available ? (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 gap-1">
          <Home className="w-3 h-3" /> Available
        </Badge>
      ) : (
        <span className="text-xs text-muted-foreground italic pl-2">Lab visit only</span>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const active = row.getValue('is_active') as boolean
      return (
        <Badge variant="outline" className={active ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-secondary text-secondary-foreground"}>
          {active ? 'Active' : 'Archived'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
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
            <DropdownMenuLabel>Pricing Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Update Price
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Home className="mr-2 h-4 w-4" /> Collection Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ToggleLeft className="mr-2 h-4 w-4" /> Toggle Status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function PricingClient({ data }: { data: LabPricing[] }) {
  const labs = Array.from(new Set(data.map(p => p.labs?.name).filter(Boolean)))

  return (
    <DataTable
      columns={columns}
      data={data}
      searchableColumns={[
        {
          id: 'lab_tests.test_name',
          placeholder: 'Search test name...',
        },
      ]}
      filterableColumns={[
        {
          id: 'labs.name',
          title: 'Laboratory',
          options: labs.map(l => ({ label: String(l), value: String(l) })),
        },
        {
          id: 'home_collection_available',
          title: 'Collection',
          options: [
            { label: 'Home', value: 'true' },
            { label: 'Lab Only', value: 'false' },
          ],
        },
        {
          id: 'is_active',
          title: 'Status',
          options: [
            { label: 'Active', value: 'true' },
            { label: 'Archived', value: 'false' },
          ],
        },
      ]}
    />
  )
}
