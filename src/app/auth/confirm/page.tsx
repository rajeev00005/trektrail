// src/app/auth/confirm/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material'

export default function ConfirmPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const confirmEmail = async () => {
      const hashFragment = window.location.hash // e.g. #access_token=...&expires_in=3600&token_type=bearer
      if (!hashFragment) {
        setError('No confirmation data found. Please use the link from your email.')
        setLoading(false)
        return
      }

      // Supabase sends data in the hash (not query params)
      const params = new URLSearchParams(hashFragment.substring(1)) // Remove the `#`
      const access_token = params.get('access_token')
      const refresh_token = params.get('refresh_token')
      const type = params.get('type')

      if (!access_token || !refresh_token) {
        setError('Invalid or expired link. Please request a new one.')
        setLoading(false)
        return
      }

      // Set the session
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      })

      if (error) {
        setError(error.message)
      } else {
        if (type === 'signup') {
          setSuccess('Email confirmed! Your account is now active.')
        } else if (type === 'recovery') {
          // Redirect to update password
          router.push('/auth/update-password')
          return
        } else {
          setSuccess('Confirmed successfully!')
        }
      }

      // Redirect after success
      setTimeout(() => router.push('/'), 2000)
    }

    confirmEmail()
  }, [router])

  if (loading && !error && !success) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
        <Typography mt={2}>Confirming your email...</Typography>
      </Container>
    )
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 2,
      }}
    >
      <Paper sx={{ p: 4, width: '100%', borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Email Confirmation
        </Typography>

        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ my: 2 }}>{success}</Alert>}

        {success && (
          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push('/')}
            >
              Go to Home
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  )
}