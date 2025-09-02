// src/app/auth/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Password reset link sent! Check your email.')
    }

    setLoading(false)
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
          Reset Your Password
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Enter your email and we'll send you a link to reset your password.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success ? (
          <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>
        ) : (
          <Box component="form" onSubmit={handleReset}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoFocus
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 3, py: 1.2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
            </Button>
          </Box>
        )}

        <Box textAlign="center" mt={3}>
          <Link href="/auth/login" underline="hover">
            Back to Login
          </Link>
        </Box>
      </Paper>
    </Container>
  )
}