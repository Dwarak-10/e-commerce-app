import React, { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../utlis/api'
import {
  Card, CardContent, Typography, CircularProgress,
  Box, TextField,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination
} from '@mui/material'

const fetchVendorAnalytics = async (vendorId) => {
  const { data } = await api.get(`/api/admin/vendors/${vendorId}/analytics/`)
  return data
}

const VendorAnalytics = () => {
  const { id } = useParams()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['vendor-analytics', id],
    queryFn: () => fetchVendorAnalytics(id),
    enabled: !!id,
  })

  const products = data?.Products || []
  const totalRevenue = Number(data?.Summary?.TotalRevenue) || 0
  const totalSold = Number(data?.Summary?.TotalProductsSold) || 0

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products
    return products.filter(item =>
      [item?.Product, String(item?.Price)].some(field =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [searchTerm, products])

  const handlePageChange = (_, newPage) => setPage(newPage)
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  if (isLoading) return <Box className="flex justify-center items-center h-screen w-screen"><CircularProgress /></Box>
  if (isError) return <Typography className="text-red-500 text-center" variant="h6" mt={5}>Failed to load analytics.</Typography>

  return (
    <Box className="p-6 max-w-5xl mx-auto">
      <Typography variant="h5" gutterBottom>Vendor Analytics</Typography>

      <Card sx={{
        my: 3,
        background: 'linear-gradient(to right, #1976d2, #42a5f5)',
        color: 'white',
        boxShadow: 6,
        borderRadius: 3,
        p: 2,
      }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600}>Total Revenue: ₹{totalRevenue.toLocaleString()}</Typography>
          <Typography variant="h6" fontWeight={600} mt={1}>Total Products Sold: {totalSold}</Typography>
        </CardContent>
      </Card>

      <Box mb={3}>
        <TextField
          variant="outlined"
          placeholder="Search By Products, Price"
          fullWidth
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Units Sold</TableCell>
              <TableCell align="right">Price (₹)</TableCell>
              <TableCell align="right">Revenue (₹)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">No Data Available</TableCell>
              </TableRow>
            ) : (
              filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow key={row.id ?? index}>
                  <TableCell>{page * rowsPerPage + index + 1}. {row.Product}</TableCell>
                  <TableCell align="right">{row.QuantitySold}</TableCell>
                  <TableCell align="right">{Number(row.Price).toFixed(2)}</TableCell>
                  <TableCell align="right">{Number(row.Total).toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredProducts.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </Box>
  )
}

export default VendorAnalytics
