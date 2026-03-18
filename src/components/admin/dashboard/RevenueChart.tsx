'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  Legend
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { format, parseISO } from 'date-fns'

interface RevenueChartProps {
  data: {
    day?: string
    month?: string
    revenue?: number
    total_revenue?: number
    transactions?: number
    total_transactions?: number
  }[]
  title: string
  description?: string
  dateKey: 'day' | 'month'
  revenueKey: 'revenue' | 'total_revenue'
  type?: 'area' | 'bar'
}

export function RevenueChart({ data, title, description, dateKey, revenueKey, type = 'area' }: RevenueChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    formattedDate: item[dateKey] 
      ? format(parseISO(item[dateKey] as string), dateKey === 'day' ? 'MMM dd' : 'MMM yyyy')
      : '',
  }))

  return (
    <Card className="glass-card col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="formattedDate" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(value) => `$${value}`}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                  labelStyle={{ fontWeight: 'bold', color: '#666', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey={revenueKey} 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="formattedDate" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(value) => `${value}`}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#666', marginBottom: '4px' }}
                />
                <Bar dataKey="transactions" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Orders" />
                <Bar dataKey="total_transactions" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Transactions" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
