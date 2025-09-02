// src/app/admin/inquiries/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAuth } from '../../../context/AuthContext'
import { useRouter } from 'next/navigation'
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material'

export default function InquiriesPage() {
  const { profile } = useAuth()
  const router = useRouter()
  const [inquiries, setInquiries] = useState<any[]>([])

  useEffect(() => {
    if (profile?.role !== 'admin') {
      router.push('/profile')
      return
    }

    const fetchInquiries = async () => {
      const {  data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false })
      setInquiries(data || [])
    }

    fetchInquiries()
  }, [profile, router])

  if (profile?.role !== 'admin') return null

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        User Inquiries
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Trek</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inquiries.map((inq) => (
              <TableRow key={inq.id}>
                <TableCell>{inq.name}</TableCell>
                <TableCell>{inq.email}</TableCell>
                <TableCell>{inq.treks?.title || 'Unknown'}</TableCell>
                <TableCell>
                  <Chip label={inq.status} color={inq.status === 'pending' ? 'error' : 'success'} size="small" />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => router.push(`/admin/inquiries/${inq.id}`)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}