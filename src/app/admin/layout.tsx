// src/app/admin/layout.tsx
import { createServerSupabase } from '@/lib/supabase-server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase()

  // Example: fetch user session
  const { data: { session } } = await supabase.auth.getSession()

  return (
     <>
      {children}
     </>
    
  )
}
