import { getMedicines } from '@/lib/db/commerce'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Pill } from 'lucide-react'
import { MedicinesClient } from './medicines-client'

export default async function MedicinesPage() {
  let medicines: Record<string, unknown>[] = []
  let fetchError = ''
  try {
    medicines = (await getMedicines()) ?? []
  } catch (e) {
    fetchError = String(e)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Pill className="w-6 h-6 text-primary" />
          Medicines Catalogue
        </h1>
        <p className="text-muted-foreground text-sm mt-1">All medicines from commerce.medicines</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Medicines</CardTitle>
          <CardDescription>{medicines.length} medicines registered</CardDescription>
        </CardHeader>
        <CardContent>
          {fetchError && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {fetchError}</div>
          )}
          {!fetchError && <MedicinesClient data={medicines} />}
        </CardContent>
      </Card>
    </div>
  )
}


