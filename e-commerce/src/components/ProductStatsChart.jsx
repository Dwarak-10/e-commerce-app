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

const ProductStatsChart = ({ salesData, isCategory, setIsCategory }) => {
  // console.log("Sales Data in Chart:", salesData);
  const chartData = [salesData.Summary, ...salesData?.result]
  // console.log(chartData)

  const { totalSold, totalRevenue } = useMemo(() => {
    return chartData.reduce(
      (acc, curr) => {
        acc.totalSold += curr?.quantity_sold || 0;
        acc.totalRevenue += (curr?.Earnings || curr?.earnings) || 0;
        return acc
      },
      { totalSold: 0, totalRevenue: 0 }
    )
  }, [chartData])



  // Normalize data, skip the first item if it's summary
  const normalizedData = chartData
    .filter((item) => item.date) // keep only items with valid date
    .map((item) => ({
      date: item.date,
      quantity: item.quantity_sold ?? 0,
      earnings: (item.Earnings || item.earnings) ?? 0,
    }));


  return (
    <Card sx={{ width: '100%', height: '100%', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" textAlign="center" gutterBottom>
          Product Sales Statistics ({isCategory === 'week' ? 'This Week' : 'Monthly'})
        </Typography>

        <ToggleButtonGroup
          value={isCategory}
          exclusive
          onChange={(e, newMode) => {
            if (newMode) setIsCategory(newMode)
          }}
          sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}
        >
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="year">Month</ToggleButton>
        </ToggleButtonGroup>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={normalizedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value, name) => name === 'Revenue' ? [`₹${value}`, name] : [value, name]} />
            <Legend />
            <Bar dataKey="quantity" fill="#1976d2" name="Sold Quantity" />
            <Bar dataKey="earnings" fill="#81c784" name="Revenue" />
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
