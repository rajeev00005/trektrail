"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Avatar,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import Link from "next/link";
import ContactForm from "../../../components/treks/ContactForm";
import ReviewForm from "../../../components/treks/ReviewForm";
import dynamic from "next/dynamic";

// Dynamically import LeafletMap (disable SSR)
const LeafletMap = dynamic(() => import("../../../components/treks/LeafletMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function TrekDetailPage() {
  const { id } = useParams();
  const [trek, setTrek] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fallbackImage =
    "https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg";

  useEffect(() => {
    const fetchTrekAndReviews = async () => {
      if (!id) return;
      try {
        const { data: trekData, error: trekError } = await supabase
          .from("treks")
          .select("*")
          .eq("id", id)
          .single();

        if (trekError) throw trekError;
        setTrek(trekData);

        const { data: reviewData } = await supabase
          .from("reviews")
          .select("*")
          .eq("trek_id", id)
          .order("created_at", { ascending: false });

        setReviews(reviewData || []);
      } catch (err) {
        setError("Failed to load trek details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrekAndReviews();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <CircularProgress />
        <Typography mt={2}>Loading trek details...</Typography>
      </Container>
    );
  }

  if (error || !trek) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <Alert severity="error">{error || "Trek not found."}</Alert>
        <Link href="/treks">
          <Button variant="outlined" sx={{ mt: 2 }}>
            ← Back to Treks
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 260, md: 450 },
          mb: 6,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 4,
        }}
      >
        <CardMedia
          component="img"
          height="100%"
          image={trek.images || fallbackImage}
          alt={trek.title}
          sx={{ objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "flex-end",
            p: { xs: 2, md: 4 },
            color: "white",
          }}
        >
          <Box>
            <Typography variant={isMobile ? "h5" : "h3"} fontWeight="bold">
              {trek.title}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
              <Chip label={`${trek.duration_days} Days`} color="primary" />
              <Chip label={trek.difficulty} color="warning" />
              <Chip label={`${trek.max_elevation_m}m`} />
              <Chip label={trek.region} color="secondary" />
              <Chip label={trek.season} color="info" />
            </Box>
          </Box>
        </Box>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="flex-start">
          {/* Left Column: Content */}
          <Grid item xs={12} md={7}>
            {/* About Trek */}
            {trek.description && (
              <Box sx={{ mb: 5 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  About This Trek
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  {trek.description}
                </Typography>
              </Box>
            )}

            {/* Itinerary */}
            {Array.isArray(trek.itinerary) && trek.itinerary.length > 0 && (
              <Box sx={{ mb: 5 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Itinerary
                </Typography>
                <Box sx={{ pl: 2, borderLeft: "3px solid #1976D2" }}>
                  {trek.itinerary.map((day: any, idx: number) => (
                    <Box key={idx} mb={2}>
                      <Typography variant="subtitle1" fontWeight="600">
                        Day {day.day}: {day.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {day.description}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Reviews */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                User Reviews & Ratings
              </Typography>
              <ReviewForm trekId={trek.id} />
              <Grid container spacing={2} mt={1}>
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <Grid item xs={12} key={review.id}>
                      <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                        <CardContent>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar sx={{ bgcolor: "primary.main" }}>
                              {review.full_name?.[0]}
                            </Avatar>
                            <Box>
                              <Typography fontWeight="bold">
                                {review.full_name}
                              </Typography>
                              <Rating value={review.rating} readOnly size="small" />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(review.created_at).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{ mt: 2 }}>
                            {review.comment}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" mt={2}>
                    No reviews yet. Be the first to review this trek!
                  </Typography>
                )}
              </Grid>
            </Box>
          </Grid>

          {/* Right Column: Sticky Sidebar */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: "sticky", top: 100, display: "flex", flexDirection: "column", gap: 4 , mb: 3}}>
              {/* Map */}
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Trek Location 📌
              </Typography>
              <Paper
                sx={{
                  height: 300,
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: 3,
                }}
              >
                <Suspense fallback={<p>Loading map...</p>}>
                  <LeafletMap trekId={trek.id} />
                </Suspense>
              </Paper>

              {/* Contact Form */}
              <Paper sx={{ py: 3, borderRadius: 3, boxShadow: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Ready to Book?
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Fill out the form below and our team will contact you within 24h.
                </Typography>
                <ContactForm trekId={trek.id} />

              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
