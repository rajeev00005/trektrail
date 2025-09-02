// src/app/auth/register/page.tsx
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
  Divider,
} from '@mui/material'
import { RollerShades } from '@mui/icons-material'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: email.split('@')[0],
          role: 'user',
          phone: '',
        },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess('🎉 Registration successful! Check your email to confirm.')
      setTimeout(() => {
        router.push('/auth/login')
      }, 2500) // ✅ redirect to login after success
    }

    setLoading(false)
  }

  return (
    <Container maxWidth="xs" sx={{ p: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Join TrekTrail to start your adventure
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleRegister}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <TextField
            label="Confirm Password"
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
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 600 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2">
          Already have an account?{' '}
          <Link href="/auth/login" underline="hover">
            Login
          </Link>
        </Typography>
      </Paper>
    </Container>
  )
}
