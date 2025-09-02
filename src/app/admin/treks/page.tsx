// src/app/admin/treks/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAuth } from '../../../context/AuthContext'
import { useRouter } from 'next/navigation'
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Alert,
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'

export default function TrekManagement() {
  const { profile } = useAuth()
  const router = useRouter()
  const [treks, setTreks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (profile?.role !== 'admin') {
      router.push('/profile')
      return
    }

    const fetchTreks = async () => {
      const {  data, error } = await supabase.from('treks').select('*')
      if (error) {
        setError('Failed to load treks')
      } else {
        setTreks(data)
      }
      setLoading(false)
    }

    fetchTreks()
  }, [profile, router])

  if (profile?.role !== 'admin') return null

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="h5" fontWeight="bold">
          Trek Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/admin/treks/new')}
        >
          Add Trek
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Trek Name</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {treks.map((trek) => (
              <TableRow key={trek.id}>
                <TableCell>{trek.title}</TableCell>
                <TableCell>{trek.region}</TableCell>
                <TableCell>{trek.duration_days}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => router.push(`/admin/treks/edit/${trek.id}`)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={async () => {
                      if (confirm('Delete this trek?')) {
                        await supabase.from('treks').delete().eq('id', trek.id)
                        setTreks(treks.filter(t => t.id !== trek.id))
                      }
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}