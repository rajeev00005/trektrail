'use client'

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Skeleton,
} from '@mui/material'
import { useState, useEffect } from 'react'

interface TrekFilterProps {
  onFilter: (filters: any) => void
  loading?: boolean
}

export default function TrekFilter({ onFilter, loading = false }: TrekFilterProps) {
  const [difficulty, setDifficulty] = useState('')
  const [region, setRegion] = useState('')
  const [season, setSeason] = useState('')

  const applyFilters = () => {
    onFilter({ difficulty, region, season })
  }

  const resetFilters = () => {
    setDifficulty('')
    setRegion('')
    setSeason('')
    onFilter({})
  }

  return (
    <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        {loading ? (
          <>
            <Skeleton variant="rectangular" width={{ xs: '100%', sm: 150 }} height={40} />
            <Skeleton variant="rectangular" width={{ xs: '100%', sm: 150 }} height={40} />
            <Skeleton variant="rectangular" width={{ xs: '100%', sm: 150 }} height={40} />
            <Skeleton variant="rectangular" width={100} height={40} />
            <Skeleton variant="rectangular" width={100} height={40} />
          </>
        ) : (
          <>
            <FormControl fullWidth size="small">
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficulty}
                label="Difficulty"
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Moderate">Moderate</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
                <MenuItem value="Expert">Expert</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Region</InputLabel>
              <Select value={region} label="Region" onChange={(e) => setRegion(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Nepal">Nepal</MenuItem>
                <MenuItem value="India">India</MenuItem>
                <MenuItem value="Switzerland">Switzerland</MenuItem>
                <MenuItem value="Peru">Peru</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Season</InputLabel>
              <Select value={season} label="Season" onChange={(e) => setSeason(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Spring">Spring</MenuItem>
                <MenuItem value="Summer">Summer</MenuItem>
                <MenuItem value="Autumn">Autumn</MenuItem>
                <MenuItem value="Winter">Winter</MenuItem>
              </Select>
            </FormControl>

            <Button onClick={applyFilters} variant="contained" color="primary">
              Filter
            </Button>
            <Button onClick={resetFilters} variant="outlined">
              Reset
            </Button>
          </>
        )}
      </Stack>
    </Box>
  )
}
