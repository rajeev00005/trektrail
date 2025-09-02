// src/app/blog/list/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import BlogCard from '../../../components/BlogCard'
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
} from '@mui/material'
import Masonry from '@mui/lab/Masonry'
import { motion } from 'framer-motion'

export default function BlogListPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading posts:', error)
      } else {
        setPosts(data || [])
      }
      setLoading(false)
    }
    fetchPosts()
  }, [])

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh' }}>
      {/* 🌄 Hero Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          textAlign: 'center',
          background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
          color: 'white',
          mb: 6,
          borderBottomLeftRadius: { xs: 40, md: 80 },
          borderBottomRightRadius: { xs: 40, md: 80 },
        }}
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}
        >
          Trekking Blog
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 700, mx: 'auto', opacity: 0.9 }}>
          Tips, stories, and guides from the trail – written by trekkers, for trekkers.
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Typography textAlign="center" color="text.secondary">
            No posts yet.
          </Typography>
        ) : (
          <Masonry
            columns={{ xs: 1, sm: 2, md: 3 }}
            spacing={3}
            sx={{ m: 0 }}
          >
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <BlogCard post={post} />
                </Paper>
              </motion.div>
            ))}
          </Masonry>
        )}
      </Container>
    </Box>
  )
}
