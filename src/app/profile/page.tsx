'use client'

import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Typography, Box, Paper, Avatar, CircularProgress, Alert } from '@mui/material'
import { supabase } from '../../lib/supabaseClient'

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    const fetchProfile = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.log('Error fetching profile:', error)
      } else {
        setProfile(data)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [user, router])

  if (loading) {
    return (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography mt={3} variant="h6" color="text.secondary">
          Loading profile...
        </Typography>
      </Box>
    )
  }

  if (!profile) {
    return <Alert severity="error">Profile not found.</Alert>
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 1, p: 6 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80 }}>
            {user.email?.[0]?.toUpperCase()}
          </Avatar>

          <Typography variant="h5">Profile Page</Typography>
          <Typography variant="body1">Welcome, {user.email}</Typography>

          <Box mt={3} width="100%">
            <Typography variant="subtitle1" gutterBottom>User Details</Typography>
            <Typography variant="body2">Full Name: {profile.full_name}</Typography>
            <Typography variant="body2">Phone: {profile.phone || 'N/A'}</Typography>
            <Typography variant="body2">Role: {profile.role}</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
