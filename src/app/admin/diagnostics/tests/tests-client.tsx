'use client'

import { DataTable } from '@/components/admin'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Edit, AlertCircle, Clock } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface LabTest {
  id: string
  test_name: string
  description: string | null
  sample_type: string | null
  fasting_required: boolean
  test_categories: { name: string } | null
}

const columns: ColumnDef<LabTest>[] = [
  {
    accessorKey: 'test_name',
    header: 'Test Name',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-sm">{String(row.getValue('test_name') ?? '—')}</span>
        <span className="text-xs text-muted-foreground max-w-[300px] truncate">
          {row.original.description || 'No description provided'}
        </span>
      </div>
    ),
    size: 350,
  },
  {
    accessorKey: 'test_categories.name',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.original.test_categories?.name
      return (
        <Badge variant="outline" className="font-normal border-primary/20 bg-primary/5">
          {category || 'Uncategorized'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      const categoryName = row.original.test_categories?.name
      return value.includes(categoryName)
    },
  },
  {
    accessorKey: 'sample_type',
    header: 'Sample',
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-normal capitalize rounded-md">
        {String(row.getValue('sample_type') || '—')}
      </Badge>
    ),
  },
  {
    accessorKey: 'fasting_required',
    header: 'Fasting',
    cell: ({ row }) => {
      const fasting = row.getValue('fasting_required') as boolean
      return fasting ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-1.5 text-amber-600 font-medium text-xs">
                <Clock className="w-3.5 h-3.5" />
                Required
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Fasting of 8-10 hours needed</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <span className="text-muted-foreground text-xs italic">Not Required</span>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const test = row.original

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
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Edit Test
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Archive Test
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function TestsClient({ data }: { data: any[] }) {
  const categories = Array.from(new Set(data.map(t => t.test_categories?.name).filter(Boolean)))

  return (
    <DataTable
      columns={columns}
      data={data}
      searchableColumns={[
        {
          id: 'test_name',
          placeholder: 'Search test name...',
        },
      ]}
      filterableColumns={[
        {
          id: 'fasting_required',
          title: 'Fasting',
          options: [
            { label: 'Required', value: 'true' },
            { label: 'Not Required', value: 'false' },
          ],
        },
        {
          id: 'test_categories.name',
          title: 'Category',
          options: categories.map(c => ({ label: String(c), value: String(c) })),
        },
      ]}
    />
  )
}
