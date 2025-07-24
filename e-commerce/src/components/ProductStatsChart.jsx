import {
  Card,
  CardContent,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useState } from 'react'

const weeklyData = [
  { label: 'Mon', sold: 30, left: 70 },
  { label: 'Tue', sold: 45, left: 55 },
  { label: 'Wed', sold: 50, left: 50 },
  { label: 'Thu', sold: 20, left: 80 },
  { label: 'Fri', sold: 60, left: 40 },
  { label: 'Sat', sold: 70, left: 30 },
  { label: 'Sun', sold: 40, left: 60 },
]

const monthlyData = [
  { label: 'Jan', sold: 400, left: 200 },
  { label: 'Feb', sold: 300, left: 250 },
  { label: 'Mar', sold: 350, left: 150 },
  { label: 'Apr', sold: 500, left: 100 },
  { label: 'May', sold: 450, left: 50 },
  { label: 'Jun', sold: 600, left: 90 },
  { label: 'Jul', sold: 300, left: 200 },
]

const ProductStatsChart = () => {
  const [mode, setMode] = useState('week')
  const chartData = mode === 'week' ? weeklyData : monthlyData

  return (
    <Card sx={{ width: '100%', height: 400, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" textAlign="center" gutterBottom>
          Product Sales Statistics ({mode === 'week' ? 'This Week' : 'Monthly'})
        </Typography>

        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(e, newMode) => {
            if (newMode) setMode(newMode)
          }}
          sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}
        >
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="month">Month</ToggleButton>
        </ToggleButtonGroup>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sold" fill="#1976d2" name="Sold" />
            <Bar dataKey="left" fill="#e57373" name="Left" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default ProductStatsChart
