// src/components/treks/TrekCard.tsx
'use client'

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Skeleton,
} from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'

export default function TrekCard({ trek }: { trek: any }) {
  const [imageLoading, setImageLoading] = useState(true)

  const fallbackImage =
    'https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg'

  return (
    <Card
      sx={{
        height: '100%', // ensures equal height in Grid
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        },
      }}
    >
      {/* Image wrapper with aspect ratio */}
      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
        {imageLoading && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
          />
        )}
        <CardMedia
          component="img"
          src={trek.images ? trek.images : fallbackImage}
          alt={trek.title || 'Trek image'}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            opacity: imageLoading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      </Box>

      {/* Content area */}
      <CardContent
        sx={{
          flexGrow: 1, // expands to fill available space
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          fontWeight="600"
          color="text.primary"
          sx={{
            fontSize: '1.1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
          }}
        >
          {trek.title || 'Untitled Trek'}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {trek.region || 'Unknown Region'} • {trek.duration_days || '?'} days
        </Typography>

        <Typography variant="body2" color="text.secondary">
          <strong>{trek.difficulty || 'Unknown'}</strong> •{' '}
          Up to {trek.max_elevation_m ? `${trek.max_elevation_m}m` : 'N/A'}
        </Typography>

        {/* Spacer pushes button down */}
        <Box sx={{ flexGrow: 1 }} />
      </CardContent>

      {/* Button always aligned bottom */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          component={Link}
          href={`/treks/${trek.id}`}
          fullWidth
          variant="outlined"
          color="primary"
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '8px',
            py: 1,
          }}
        >
          View Details
        </Button>
      </Box>
    </Card>
  )
}
