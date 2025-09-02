import React from 'react'

const About = () => {
  return (
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
  )
}

export default About