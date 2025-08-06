import {
  Card,
  CardContent,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
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
import { useState, useMemo } from 'react'

// Cleaned data (no "left")
const weeklyData = [
  { label: 'Mon', sold: 30, price: 100 },
  { label: 'Tue', sold: 45, price: 120 },
  { label: 'Wed', sold: 50, price: 110 },
  { label: 'Thu', sold: 20, price: 90 },
  { label: 'Fri', sold: 60, price: 150 },
  { label: 'Sat', sold: 70, price: 130 },
  { label: 'Sun', sold: 40, price: 95 },
]

const monthlyData = [
  { label: 'Jan', sold: 400, price: 100 },
  { label: 'Feb', sold: 300, price: 110 },
  { label: 'Mar', sold: 350, price: 120 },
  { label: 'Apr', sold: 500, price: 90 },
  { label: 'May', sold: 450, price: 140 },
  { label: 'Jun', sold: 600, price: 130 },
  { label: 'Jul', sold: 300, price: 100 },
  { label: 'Aug', sold: 400, price: 100 },
  { label: 'Sep', sold: 300, price: 110 },
  { label: 'Oct', sold: 350, price: 120 },
  { label: 'Nov', sold: 500, price: 90 },
  { label: 'Dec', sold: 450, price: 140 },
]

const ProductStatsChart = () => {
  const [mode, setMode] = useState('week')
  const chartData = mode === 'week' ? weeklyData : monthlyData

  const { totalSold, totalRevenue } = useMemo(() => {
    return chartData.reduce(
      (acc, curr) => {
        acc.totalSold += curr.sold
        acc.totalRevenue += curr.sold * curr.price
        return acc
      },
      { totalSold: 0, totalRevenue: 0 }
    )
  }, [chartData])

  return (
    <Card sx={{ width: '100%', height: '100%', boxShadow: 3 }}>
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
            <Tooltip
              formatter={(value, name) =>
                name === 'Revenue' ? [`₹${value}`, name] : [value, name]
              }
            />
            <Legend />
            <Bar dataKey="sold" fill="#1976d2" name="Sold Quantity" />
            <Bar
              dataKey={(entry) => entry.sold * entry.price}
              fill="#81c784"
              name="Revenue"
            />
          </BarChart>
        </ResponsiveContainer>

        <Stack direction="row" justifyContent="space-around" mt={3}>
          <Typography variant="subtitle1">
            Total Sold: <strong>{totalSold}</strong> units
          </Typography>
          <Typography variant="subtitle1">
            Total Revenue: <strong>₹{totalRevenue.toLocaleString()}</strong>
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ProductStatsChart
