import { ModulePlaceholder } from '@/components/module-placeholder'
import { Construction } from 'lucide-react'

function humanizeSegment(segment: string) {
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase())
}

export default async function AdminFallbackPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const current = slug.at(-1) ?? 'module'
  const parent = slug.at(-2)

  const title = humanizeSegment(current)
  const parentTitle = parent ? humanizeSegment(parent) : 'Admin'

  return (
    <ModulePlaceholder
      title={title}
      description={`${parentTitle} section is not fully implemented yet.`}
      icon={<Construction className="h-5 w-5" />}
      features={[
        'Data table and filters',
        'Create / edit workflows',
        'Role-based access control',
        'Audit trail integration',
        'Validation and guardrails',
        'Export and reporting',
      ]}
      badgeText="Coming Soon"
    />
  )
}
