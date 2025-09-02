'use client'

import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'

export default function Footer() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const socialIcons = [
    { icon: <FacebookIcon />, href: '#' },
    { icon: <TwitterIcon />, href: '#' },
    { icon: <InstagramIcon />, href: '#' },
    { icon: <YouTubeIcon />, href: '#' },
  ]

  const quickLinks = [
    { title: 'Home', href: '/' },
    { title: 'All Treks', href: '/treks' },
    { title: 'Blog', href: '/blog/list' },
    { title: 'Login', href: '/auth/login' },
  ]

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1976D2',
        color: 'white',
        py: 8,
        mt: 'auto',
        px: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          justifyContent={isMobile ? 'center' : 'space-between'}
          textAlign={isMobile ? 'center' : 'left'}
        >
          {/* Brand */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              TrekTrail
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Your trusted partner for mountain treks, guided adventures, and unforgettable journeys.
            </Typography>
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: isMobile ? 'center' : 'flex-start',
                gap: 1,
              }}
            >
              {socialIcons.map((social, idx) => (
                <IconButton
                  key={idx}
                  href={social.href}
                  sx={{
                    color: 'white',
                    transition: 'transform 0.3s, color 0.3s',
                    '&:hover': {
                      color: '#FFC107',
                      transform: 'scale(1.2)',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Quick Links
            </Typography>
            <Box
              component="div"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                alignItems: isMobile ? 'center' : 'flex-start',
              }}
            >
              {quickLinks.map((link) => (
                <MuiLink
                  key={link.title}
                  href={link.href}
                  color="inherit"
                  underline="hover"
                  sx={{
                    transition: 'color 0.3s, transform 0.3s',
                    '&:hover': {
                      color: '#FFC107',
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  {link.title}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Contact
            </Typography>
            <Box
              component="div"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                alignItems: isMobile ? 'center' : 'flex-start',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  transition: 'color 0.3s, transform 0.3s',
                  '&:hover': { color: '#FFC107', transform: 'translateX(5px)' },
                  cursor: 'pointer',
                }}
              >
                📧 kumar.rajeev0005@gmail.com
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  transition: 'color 0.3s, transform 0.3s',
                  '&:hover': { color: '#FFC107', transform: 'translateX(5px)' },
                  cursor: 'pointer',
                }}
              >
                📞 +91-8877665544
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  transition: 'color 0.3s, transform 0.3s',
                  '&:hover': { color: '#FFC107', transform: 'translateX(5px)' },
                  cursor: 'pointer',
                }}
              >
                📍 Kolkata, India
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom */}
        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: '1px solid rgba(255,255,255,0.2)',
            textAlign: 'center',
            fontSize: '0.9rem',
            opacity: 0.8,
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} TrekTrail. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
