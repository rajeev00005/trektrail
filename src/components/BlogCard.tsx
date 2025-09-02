// src/components/BlogCard.tsx
'use client'

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
} from '@mui/material'
import Link from 'next/link'

export default function BlogCard({ post }: { post: any }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={Link} href={`/blog/post/${post.slug}`}>
        {post.cover_image && (
          <CardMedia
            component="img"
            height="180"
            image={post.cover_image}
            alt={post.title}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {post.content.slice(0, 120)}...
          </Typography>
          <Typography variant="caption" color="text.secondary">
            By {post.author} • {new Date(post.created_at).toLocaleDateString()}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}