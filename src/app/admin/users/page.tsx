// src/app/admin/users/page.tsx
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
} from '@mui/material'

export default function UsersPage() {
  const { profile } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    if (profile?.role !== 'admin') {
      router.push('/profile')
      return
    }

    const fetchUsers = async () => {
      const {  data } = await supabase.from('profiles').select('*')
      setUsers(data || [])
    }

    fetchUsers()
  }, [profile, router])

  if (profile?.role !== 'admin') return null

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        User Management
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name || '–'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip label={user.role} color={user.role === 'admin' ? 'primary' : 'default'} size="small" />
                </TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}