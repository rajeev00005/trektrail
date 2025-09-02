// src/components/ChartWrapper.tsx
'use client'

import { Line, Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Box, Typography, Paper } from '@mui/material'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
)

type ChartWrapperProps = {
  type: 'line' | 'bar' | 'pie'
  data: any
  title: string
}

export default function ChartWrapper({ type, data, title }: ChartWrapperProps) {
  let Component
  switch (type) {
    case 'line':
      Component = Line
      break
    case 'bar':
      Component = Bar
      break
    case 'pie':
      Component = Pie
      break
    default:
      Component = Bar
  }

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Box height={400}>
        <Component data={data} options={{ responsive: true, maintainAspectRatio: false }} />
      </Box>
    </Paper>
  )
}