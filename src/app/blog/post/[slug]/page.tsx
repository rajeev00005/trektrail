// src/app/blog/post/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Divider,
  Avatar,
} from "@mui/material";
import Link from "next/link";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error loading post:", error);
      } else {
        setPost(data);
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading)
    return (
      <Box
        sx={{ py: 10, textAlign: "center", display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Box>
    );

  if (!post)
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Post not found.
        </Typography>
        <Button component={Link} href="/blog/list" variant="outlined" sx={{ mt: 2 }}>
          ← Back to Blog
        </Button>
      </Container>
    );

  return (
    <Box>
      {/* Hero Cover Image */}
      {post.cover_image && (
        <Box
          sx={{
            position: "relative",
            height: { xs: 240, md: 400 },
            width: "100%",
            overflow: "hidden",
          }}
        >
          <img
            src={post.cover_image}
            alt={post.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: "rgba(0,0,0,0.6)",
              color: "white",
              p: { xs: 2, md: 4 },
            }}
          >
            <Typography variant="h3" fontWeight="bold">
              {post.title}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              By {post.author} • {new Date(post.created_at).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      )}

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Author Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 4,
          }}
        >
          <Avatar sx={{ bgcolor: "primary.main" }}>
            {post.author?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="600">
              {post.author}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(post.created_at).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          {/* Blog Content */}
          <Box
            sx={{
              typography: "body1",
              "& h2": { fontSize: "1.5rem", fontWeight: "bold", mt: 3, mb: 2 },
              "& h3": { fontSize: "1.25rem", fontWeight: "600", mt: 3, mb: 1 },
              "& p": { mb: 2, lineHeight: 1.8 },
              "& ul": { pl: 3, mb: 2 },
              "& li": { mb: 1 },
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Paper>

        <Divider sx={{ my: 5 }} />

        {/* Back Button */}
        <Box sx={{ textAlign: "center" }}>
          <Button component={Link} href="/blog/list" variant="contained" color="primary">
            ← Back to Blog
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
