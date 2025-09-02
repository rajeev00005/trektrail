// // src/app/auth/callback/route.ts
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'
// import { NextResponse } from 'next/server'
// import { redirect } from 'next/navigation'

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url)
//   const code = searchParams.get('code')

//   if (code) {
//     const cookieStore = cookies()
//     const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
//     await supabase.auth.exchangeCodeForSession(code)
//   }

//   // URL to redirect to after sign in process completes
//   return redirect('/dashboard')
// }