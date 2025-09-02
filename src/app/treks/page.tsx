// src/app/treks/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import TrekCard from '../../components/treks/TrekCard'
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import TrekFilter from '../../components/treks/TrekFilter'

export default function TreksPage() {
  const [treks, setTreks] = useState<any[]>([])
  const [filteredTreks, setFilteredTreks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    const fetchTreks = async () => {
      const { data, error } = await supabase.from('treks').select('*')
      if (error) console.error(error)
      else {
        setTreks(data)
        setFilteredTreks(data)
      }
      setLoading(false)
    }
    fetchTreks()
  }, [])

  const handleFilter = (filters: {
    difficulty?: string
    region?: string
    season?: string
  }) => {
    let filtered = treks
    if (filters.difficulty)
      filtered = filtered.filter((t) => t.difficulty === filters.difficulty)
    if (filters.region)
      filtered = filtered.filter((t) => t.region === filters.region)
    if (filters.season)
      filtered = filtered.filter((t) => t.season === filters.season)
    setFilteredTreks(filtered)
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h2" gutterBottom textAlign="center" sx={{ mb: 2 }}>
        All Treks
      </Typography>

      <TrekFilter onFilter={handleFilter} />

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          sx={{
            mt: 1,
            mb: 6,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {filteredTreks.length > 0 ? (
            filteredTreks.map((trek) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={trek.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 360,
                    height: '100%',
                    display: 'flex',
                  }}
                >
                  <TrekCard trek={trek} />
                </Box>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" textAlign="center">
                No treks match your filters.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  )
}