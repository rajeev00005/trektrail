'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import {
  Box,
  TextField,
  Button,
  Typography,
  Rating,
  Alert,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material'
import { Star } from '@mui/icons-material'

export default function ReviewForm({ trekId }: { trekId: string }) {
  const session = useAuth()
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!rating) {
      setError('Please give a star rating')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('reviews').insert([
      {
        trek_id: trekId,
        user_id: session?.user?.id,
        full_name: session?.user?.user_metadata?.full_name || 'Anonymous',
        rating,
        comment,
      },
    ])

    if (error) {
      setError('Failed to submit review. Try again.')
      console.error('Supabase error:', error)
    } else {
      setSuccess(true)
      setRating(null)
      setComment('')
    }

    setLoading(false)
  }

  if (!session) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 4,
          mt: 4,
          textAlign: 'center',
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Want to share your experience?
        </Typography>
        <Typography color="text.secondary">
          Please <a href="/auth/login">log in</a> to leave a review.
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper
      elevation={3}
      sx={{
        mt: 6,
        p: 4,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #fdfdfd 0%, #f8f8f8 100%)',
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Share Your Experience
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Your feedback helps other adventurers choose their next trek 🌍
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          🎉 Thank you for your review!
        </Alert>
      )}

      {!success && (
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1">Your Rating:</Typography>
            <Rating
              name="rating"
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              size="large"
              icon={<Star fontSize="inherit" />}
              emptyIcon={<Star fontSize="inherit" style={{ opacity: 0.3 }} />}
            />
          </Box>

          <TextField
            label="Write your review..."
            multiline
            rows={4}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 5,
              py: 1.2,
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Review'}
          </Button>
        </Box>
      )}
    </Paper>
  )
}
