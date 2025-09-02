"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import TrekCard from "../components/treks/TrekCard";
import { motion } from "framer-motion";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Mock trekker highlights
const trekkerHighlights = [
  {
    id: 1,
    name: "Zeshan Khan",
    avatar: "/images/avatar1.avif",
    review:
      "An unforgettable journey through Turkey with breathtaking hot air balloons, ancient sites, and warm hospitality. Highly recommend this trek for culture & adventure lovers!",
  },
  {
    id: 2,
    name: "Rajeev Kumar",
    avatar: "/images/avatar2.webp",
    review:
      "A lifetime experience hiking through the Himalayas with amazing guides and scenic beauty. Truly unforgettable!",
  },
  {
    id: 3,
    name: "Deepika Tiwari",
    avatar: "/images/avatar3.jpg",
    review:
      "Exploring Machu Picchu was magical! The trek was tough but the views and culture made it 100% worth it.",
  },
  {
    id: 4,
    name: "Amitabh Singh",
    avatar: "/images/avatar4.jpg",
    review:
      "The Safari Adventure was thrilling and well-organized. Saw incredible wildlife and landscapes. Highly recommend!",
  },
];

export default function Home() {
  const [treks, setTreks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: treksData, error } = await supabase
        .from("treks")
        .select("*")
        .eq("featured", true)
        .limit(10);

      if (error) {
        console.error("Error fetching treks:", error);
      }
      setTreks(treksData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ width: "full", overflowX: "hidden" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          borderRadius: 0,
          overflow: "hidden",
          mb: 10,
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "translate(-50%, -50%)",
            zIndex: -2,
          }}
        >
          <source src={"/videos/video1.mp4"} type="video/mp4" />
        </video>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.45)",
            zIndex: -1,
          }}
        />

        {/* Animated Hero Content */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <Box sx={{ color: "white", p: { xs: 2, md: 8 }, maxWidth: "650px" }}>
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{ mb: 2, fontSize: { xs: "2.5rem", md: "4rem" } }}
            >
              Discover the World’s{" "}
              <Typography
                component="span"
                color="primary.main"
                variant="inherit"
                fontWeight="inherit"
              >
                Hidden
              </Typography>{" "}
              Wonders
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Find the unique moments and hidden gems that define unforgettable
              adventures.
            </Typography>
            <Button
              component={Link}
              href="/treks"
              variant="contained"
              size="large"
              sx={{ borderRadius: 3, px: 4 }}
            >
              Plan your trip
            </Button>
          </Box>
        </motion.div>
      </Box>

      {/* Top Destinations */}
      <Container maxWidth={false} sx={{ maxWidth: "1350px", mx: "auto" }}>
        <Box sx={{ mb: 12, position: "relative" }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Top Destinations
          </Typography>

          {treks.length > 0 ? (
            <>
              {/* Custom Navigation Buttons */}
              <Box
                className="swiper-button-prev"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "-80px", // push outside
                  zIndex: 10,
                  cursor: "pointer",
                }}
              />
              <Box
                className="swiper-button-next"
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: "-80px", // push outside
                  zIndex: 10,
                  cursor: "pointer",
                }}
              />

              <Swiper
                spaceBetween={50}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                autoplay={{ delay: 2000 }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
                }}
                modules={[Navigation, Autoplay]}
              >
                {treks.map((trek) => (
                  <SwiperSlide key={trek.id}>
                    <TrekCard trek={trek} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : (
            <Typography textAlign="center">No treks available.</Typography>
          )}
        </Box>
      </Container>

      {/* Modern About Section */}
      <Container maxWidth="lg" sx={{ mb: 12 }} id="/about">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            minHeight: "100vh",
            overflow: "hidden",
            mb: 12,
            boxShadow: 6,
          }}
        >
          {/* Left Image */}
          <Box
            sx={{
              backgroundImage: "url(/images/about-img.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Right Content */}
          <Box
            sx={{
              bgcolor: "background.paper",
              p: { xs: 4, md: 8 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              About Our Adventures
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 4, lineHeight: 1.8, color: "text.secondary" }}
            >
              We curate the most unique trekking experiences across the globe —
              from Himalayan peaks to hidden South American gems. Our journeys
              are crafted for true explorers seeking unforgettable memories,
              cultural immersion, and the thrill of discovery.
            </Typography>
            <Button
              component={Link}
              href="/blog/list"
              variant="contained"
              size="large"
              sx={{ borderRadius: 3, textTransform: "none", fontWeight: 600 }}
            >
              Learn More
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Trekker’s Highlights */}
      <Container maxWidth={false} sx={{ maxWidth: "1350px", mx: "auto" }}>
        <Box sx={{ mb: 12 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Trekker’s Highlights
          </Typography>
          {trekkerHighlights.map((highlight) => (
            <Accordion
              key={highlight.id}
              sx={{
                borderRadius: 4,
                mb: 2,
                "&:before": { display: "none" },
                boxShadow: 2,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Avatar src={highlight.avatar} sx={{ mr: 2 }} />
                <Typography variant="subtitle1" fontWeight="600">
                  {highlight.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  “{highlight.review}”
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>


      {/* Promotional Offers & Deals Section */}
      <Container maxWidth="lg" sx={{ mb: 12 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          textAlign="center"
        >
          Special Offers & Deals 🎉
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 6 }}
        >
          Save big on your next adventure! Limited-time deals curated just for you.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
            gap: 4,
          }}
        >
          {/* Offer Card 1 */}
          <Paper
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 4,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                backgroundImage: "url(/images/offer1.jpeg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: 200,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  bgcolor: "error.main",
                  color: "white",
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                }}
              >
                20% OFF
              </Box>
            </Box>
            <Box sx={{ p: 3, flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Himalayan Adventure
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Conquer the heights of the Himalayas with exclusive savings.
              </Typography>
              <Button variant="contained" size="small" component={Link} href="/treks">
                Book Now
              </Button>
            </Box>
          </Paper>

          {/* Offer Card 2 */}
          <Paper
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 4,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                backgroundImage: "url(/images/offer2.avif)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: 200,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  bgcolor: "success.main",
                  color: "white",
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                }}
              >
                Save $150
              </Box>
            </Box>
            <Box sx={{ p: 3, flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Machu Picchu Trek
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Discover the lost city of the Incas with discounted packages.
              </Typography>
              <Button variant="contained" size="small" component={Link} href="/treks">
                Book Now
              </Button>
            </Box>
          </Paper>

          {/* Offer Card 3 */}
          <Paper
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 4,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                backgroundImage: "url(/images/offer3.avif)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: 200,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  bgcolor: "warning.main",
                  color: "white",
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                }}
              >
                Limited Deal
              </Box>
            </Box>
            <Box sx={{ p: 3, flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Safari Adventure
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Experience the wild landscapes with a special discount.
              </Typography>
              <Button variant="contained" size="small" component={Link} href="/treks">
                Book Now
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>


      {/* CTA Section */}
      <Container maxWidth="xl" sx={{ mb: 12 }}>
        <Paper
          sx={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1526772662000-3f88f10405ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "white",
            p: { xs: 4, md: 8 },
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Get Your Travel Inspiration Straight to Your Inbox
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Subscribe to our newsletter and receive trekking guides, offers, and
            stories weekly.
          </Typography>
          <Button variant="contained" color="secondary" size="large" component={Link} href="/ContactForm">
            Subscribe
          </Button>
        </Paper>
      </Container>

    </Box>
  );
}






