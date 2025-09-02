// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Container,
  CircularProgress,
  Divider,
  Link,
} from '@mui/material'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ email: '', password: '' })

  // ✅ validation helper
  const validateForm = () => {
    if (!formData.email || !formData.password) {
      return 'Please enter both email and password.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Invalid email format.'
    }
    return ''
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    const { error: supaError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (supaError) {
      setError(supaError.message)
    } else {
      router.push('/') // ✅ redirect after login
    }
    setLoading(false)
  }

  return (
    <Container maxWidth="xs" sx={{ p:8}}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Login
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Enter your credentials to continue
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={formData.email}
            onChange={handleChange}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={formData.password}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 600 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2">
          Don’t have an account?{' '}
          <Link href="/auth/register" underline="hover">
            Register
          </Link>
        </Typography>
      </Paper>
    </Container>
  )
}
