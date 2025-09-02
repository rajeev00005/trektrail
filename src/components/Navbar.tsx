// src/components/Navbar.tsx
'use client'

import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { useRouter, usePathname } from 'next/navigation'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  CircularProgress,
  IconButton,
  Drawer,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'

export default function Navbar() {
  const { session, profile, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    setDrawerOpen(false)
  }

  const getLinkStyle = (path: string) => ({
    mx: 1.5,
    px: 2,
    py: 0.8,
    borderRadius: '8px',
    fontWeight: 500,
    textTransform: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: pathname === path ? 'primary.main' : 'transparent',
    color: pathname === path ? '#fff' : 'text.primary',
    '&:hover': {
      backgroundColor: pathname === path ? 'primary.dark' : 'action.hover',
    },
  })

  const navLinks = (
    <>
      <Button sx={getLinkStyle('/')} onClick={() => { router.push('/'); setDrawerOpen(false) }}>Home</Button>
      <Button sx={getLinkStyle('/treks')} onClick={() => { router.push('/treks'); setDrawerOpen(false) }}>Treks</Button>
      <Button sx={getLinkStyle('/blog/list')} onClick={() => { router.push('/blog/list'); setDrawerOpen(false) }}>Blog</Button>
      <Button sx={getLinkStyle('/about')} onClick={() => { router.push('/about'); setDrawerOpen(false) }}>About</Button>

      {session && (
        <>
          {profile?.role === 'admin' ? (
            <Button sx={getLinkStyle('/admin/dashboard')} onClick={() => { router.push('/admin/dashboard'); setDrawerOpen(false) }}>Admin</Button>
          ) : (
            <Button sx={getLinkStyle('/profile')} onClick={() => { router.push('/profile'); setDrawerOpen(false) }}>Profile</Button>
          )}
        </>
      )}
    </>
  )

  const authButton = session ? (
    <Button
      sx={{
        ml: 2,
        px: 2.5,
        py: 0.8,
        borderRadius: '8px',
        fontWeight: 500,
        textTransform: 'none',
        backgroundColor: 'error.main',
        color: '#fff',
        '&:hover': { backgroundColor: 'error.dark' },
      }}
      onClick={handleLogout}
    >
      Logout
    </Button>
  ) : (
    <Button
      sx={{
        ml: 2,
        px: 2.5,
        py: 0.8,
        borderRadius: '8px',
        fontWeight: 500,
        textTransform: 'none',
        backgroundColor: 'primary.main',
        color: '#fff',
        '&:hover': { backgroundColor: 'primary.dark' },
      }}
      onClick={() => { router.push('/auth/login'); setDrawerOpen(false) }}
    >
      Login
    </Button>
  )

  if (loading) {
    return (
      <AppBar position="sticky" color="default" elevation={2}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600 }}>TrekTrail</Typography>
          <CircularProgress size={20} color="inherit" />
        </Toolbar>
      </AppBar>
    )
  }

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        backgroundColor: '#fff',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left: Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              cursor: 'pointer',
              color: 'text.primary',
              textDecoration: 'none',
              '&:hover': { color: 'primary.main' },
            }}
            onClick={() => router.push('/')}
          >
            TrekTrail
          </Typography>
        </Box>

        {/* Center: Nav Links */}
        {!isMobile && (
          <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            {navLinks}
          </Box>
        )}

        {/* Right: Auth Button */}
        {!isMobile && <Box sx={{ display: 'flex', alignItems: 'center' }}>{authButton}</Box>}

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton edge="end" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: '80%', maxWidth: 300, bgcolor: '#fff' } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight="bold">Menu</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List sx={{ px: 2 }}>
          {navLinks}
          <ListItem sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>{authButton}</ListItem>
        </List>
      </Drawer>
    </AppBar>
  )
}
