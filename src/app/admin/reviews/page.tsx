// src/app/admin/reviews/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAuth } from '../../../context/AuthContext'
import { useRouter } from 'next/navigation'
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
} from '@mui/material'

export default function ReviewsPage() {
  const { profile } = useAuth()
  const router = useRouter()
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    if (profile?.role !== 'admin') {
      router.push('/profile')
      return
    }

    const fetchReviews = async () => {
      const {  data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
      setReviews(data || [])
    }

    fetchReviews()
  }, [profile, router])

  if (profile?.role !== 'admin') return null

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Review Moderation
      </Typography>
      {reviews.map((review) => (
        <Paper key={review.id} sx={{ p: 3, mb: 2 }}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1"><strong>{review.full_name}</strong> rated {review.rating} stars</Typography>
            <Box>
              <Button size="small" color="success">Approve</Button>
              <Button size="small" color="error" sx={{ ml: 1 }}>Reject</Button>
            </Box>
          </Box>
          <Typography variant="body1" sx={{ mt: 1 }}>"{review.comment}"</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {new Date(review.created_at).toLocaleDateString()}
          </Typography>
        </Paper>
      ))}
    </Container>
  )
}