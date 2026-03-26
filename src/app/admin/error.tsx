'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Admin Error]', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="w-10 h-10 text-destructive" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
        <p className="text-muted-foreground text-sm">
          An unexpected error occurred while loading this page. This has been logged for review.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono mt-2">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button onClick={reset} variant="default" className="gap-2">
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </Button>
        <Link
          href="/admin"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
      </div>
    </div>
  )
}
