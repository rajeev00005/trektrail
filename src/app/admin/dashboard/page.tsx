'use client'

import { useAuth } from '../../../context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material'
import { Terrain, People, QuestionAnswer, Reviews } from '@mui/icons-material'
import { supabase } from '../../../lib/supabaseClient'

export default function AdminDashboard() {
  const { session, profile, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalTreks: 0,
    totalUsers: 0,
    totalInquiries: 0,
    totalReviews: 0,
  })

  useEffect(() => {
    if (!session || profile?.role !== 'admin') {
      router.push('/profile')
      return
    }

    const fetchStats = async () => {
      const [
        { count: treks },
        { count: users },
        { count: inquiries },
        { count: reviews },
      ] = await Promise.all([
        supabase.from('treks').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
      ])

      setStats({
        totalTreks: treks || 0,
        totalUsers: users || 0,
        totalInquiries: inquiries || 0,
        totalReviews: reviews || 0,
      })
    }

    fetchStats()
  }, [session, profile, router])

  if (loading || !session) {
    return (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography mt={3} variant="h6" color="text.secondary">
          Loading dashboard...
        </Typography>
      </Box>
    )
  }

  if (profile?.role !== 'admin') {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        You do not have admin access.
      </Alert>
    )
  }

  // Reusable stat card
  const StatCard = ({ title, value, icon, color }: any) => (
    <Card
      sx={{
        borderRadius: 4,
        backdropFilter: 'blur(10px)',
        background: 'rgba(255, 255, 255, 0.8)',
        boxShadow: 3,
        transition: '0.3s',
        '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 },
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            width: 56,
            height: 56,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, <strong>{profile.full_name}</strong>.  
          Here’s a quick overview of your platform.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Treks"
            value={stats.totalTreks}
            icon={<Terrain fontSize="large" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Users"
            value={stats.totalUsers}
            icon={<People fontSize="large" />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Inquiries"
            value={stats.totalInquiries}
            icon={<QuestionAnswer fontSize="large" />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Reviews"
            value={stats.totalReviews}
            icon={<Reviews fontSize="large" />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          {[
            { label: 'Manage Treks', href: '/admin/treks', color: 'primary' },
            { label: 'View Inquiries', href: '/admin/inquiries', color: 'warning' },
            { label: 'Manage Users', href: '/admin/users', color: 'success' },
            { label: 'Moderate Reviews', href: '/admin/reviews', color: 'info' },
          ].map((action) => (
            <Grid item xs={12} sm={6} md={3} key={action.label}>
              <Button
                href={action.href}
                fullWidth
                variant="contained"
                color={action.color as any}
                sx={{
                  py: 2.5,
                  fontWeight: 600,
                  borderRadius: 3,
                  boxShadow: 2,
                  textTransform: 'none',
                  '&:hover': { boxShadow: 4 },
                }}
              >
                {action.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}
