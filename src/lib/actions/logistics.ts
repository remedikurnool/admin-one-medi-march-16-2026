'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const partnerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  contact_person: z.string().min(2, 'Contact person must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  is_active: z.boolean().default(true),
})

export async function createDeliveryPartner(data: z.infer<typeof partnerSchema>) {
  try {
    // Validate
    const parsed = partnerSchema.parse(data)

    const supabase = createAdminClient()
    const { error } = await supabase
      .schema('logistics')
      .from('delivery_partners')
      .insert(parsed)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/logistics/partners')
    return { success: true }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const zodErr = err as any;
      return { success: false, error: 'Validation failed: ' + zodErr.errors[0].message }
    }
    return { success: false, error: 'An unexpected error occurred' }
  }
}
