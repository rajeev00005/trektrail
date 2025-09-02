// src/components/treks/ContactForm.tsx
'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Container,
  CircularProgress,
} from '@mui/material'

export default function ContactForm({ trekId }: { trekId: string }) {
  const session = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: session?.user?.email || '',
    phone: '',
    message: '',
  })

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  // ✅ Validation rules
  const validateField = (name: string, value: string) => {
    let errorMsg = ''

    if (name === 'name' && !value.trim()) {
      errorMsg = 'Full name is required'
    }

    if (name === 'email') {
      if (!value.trim()) {
        errorMsg = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorMsg = 'Invalid email format'
      }
    }

    if (name === 'phone' && value.trim()) {
      if (!/^[0-9+\-\s]{7,15}$/.test(value)) {
        errorMsg = 'Invalid phone number'
      }
    }

    if (name === 'message' && !value.trim()) {
      errorMsg = 'Message is required'
    }

    setFormErrors((prev) => ({ ...prev, [name]: errorMsg }))
    return errorMsg
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // validate live while typing
    validateField(name, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    // ✅ Run validation on all fields
    const errors = Object.keys(formData).map((key) =>
      validateField(key, (formData as any)[key])
    )

    if (errors.some((err) => err !== '')) {
      setLoading(false)
      return
    }

    const { error: supaError } = await supabase.from('inquiries').insert([
      {
        trek_id: trekId,
        user_id: session?.user?.id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
      },
    ])

    if (supaError) {
      setError('Failed to send message. Please try again.')
      console.error('Supabase error:', supaError)
    } else {
      setSuccess(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
      setFormErrors({ name: '', email: '', phone: '', message: '' })
    }

    setLoading(false)
  }

  return (
    <Container maxWidth="md" sx={{ py: 1 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Contact Admin to Book
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Fill out the form below and we'll get back to you within 24 hours.
        </Typography>

        {success ? (
          <Alert severity="success" sx={{ mb: 3 }}>
            Your inquiry has been sent! We'll contact you soon.
          </Alert>
        ) : (
          <>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Full Name"
                name="name"
                fullWidth
                required
                margin="normal"
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                required
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />

              <TextField
                label="Phone (Optional)"
                name="phone"
                type="tel"
                fullWidth
                margin="normal"
                value={formData.phone}
                onChange={handleChange}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
              />

              <TextField
                label="Your Message"
                name="message"
                multiline
                rows={4}
                fullWidth
                required
                margin="normal"
                value={formData.message}
                onChange={handleChange}
                error={!!formErrors.message}
                helperText={formErrors.message}
              />

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                size="large"
                sx={{ mt: 3, px: 4 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Message'}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  )
}
