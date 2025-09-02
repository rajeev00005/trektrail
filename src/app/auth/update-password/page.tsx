// src/app/auth/update-password/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  // ✅ Extract all required tokens from the URL
  const accessToken = searchParams.get('access_token')
  const refreshToken = searchParams.get('refresh_token')

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      setError('Invalid or expired link. Please request a new one.')
    }
  }, [accessToken, refreshToken])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // ✅ Set session first using tokens from URL
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    if (sessionError) {
      setError('Session expired. Please request a new link.')
      setLoading(false)
      return
    }

    // ✅ Now update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    })

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess('Password updated successfully! Redirecting to login...')
      setTimeout(() => router.push('/auth/login'), 2000)
    }

    setLoading(false)
  }

  if (!accessToken || !refreshToken) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">
          Invalid or expired link. <a href="/auth/forgot-password">Request a new one</a>
        </Alert>
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
          Set New Password
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Enter your new password below.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success ? (
          <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>
        ) : (
          <Box component="form" onSubmit={handleUpdate}>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              required
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              sx={{ mt: 3, py: 1.2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
            </Button>
          </Box>
        )}

        <Box textAlign="center" mt={3}>
          <a href="/auth/login" style={{ color: '#1976D2' }}>
            Back to Login
          </a>
        </Box>
      </Paper>
    </Container>
  )
}