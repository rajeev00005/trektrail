// src/components/ProtectedRoute.tsx
'use client'

import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { CircularProgress, Box, Alert } from '@mui/material'

type ProtectedRouteProps = {
  children: React.ReactNode
  requiredRole?: 'admin' | 'user'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { session, profile, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!session) {
    router.push('/auth/login')
    return null
  }

  if (requiredRole === 'admin' && profile?.role !== 'admin') {
    router.push('/profile')
    return null
  }

  return <>{children}</>
}