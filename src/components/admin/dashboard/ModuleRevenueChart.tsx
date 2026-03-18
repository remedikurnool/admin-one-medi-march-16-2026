'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface ModuleRevenueChartProps {
  data: {
    module: string
    total_revenue: number
    total_transactions: number
  }[]
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

export function ModuleRevenueChart({ data }: ModuleRevenueChartProps) {
  // Format the data for the pie chart
  const chartData = data.map((item) => ({
    name: item.module,
    value: Number(item.total_revenue) || 0,
    transactions: Number(item.total_transactions) || 0
  }))

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Revenue by Module</CardTitle>
        <CardDescription>Total revenue breakdown across platform modules</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
