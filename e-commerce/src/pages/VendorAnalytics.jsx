import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../utlis/api'
import {
    Card, CardContent, Typography, CircularProgress
} from '@mui/material'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, TablePagination
} from '@mui/material'
import { useState } from 'react'

const fetchVendorAnalytics = async (vendorId) => {
    const { data } = await api.get(`/vendors/${vendorId}/analytics`)
    return data
}

const VendorAnalytics = () => {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    //   const { id } = useParams()

    //   const { data, isLoading, isError } = useQuery({
    //     queryKey: ['vendor-analytics', id],
    //     queryFn: () => fetchVendorAnalytics(id),
    //   })

    //   if (isLoading) return <div className="flex justify-center py-10"><CircularProgress /></div>
    //   if (isError) return <div className="text-red-500 text-center">Failed to load analytics</div>

    const totalRevenue = 1165165151
    //   data.reduce((sum, p) => sum + (p.price * p.sold), 0)
    const totalSold = 500
    //   data.reduce((sum, p) => sum + p.sold, 0)

    const dummyData = [
        { productName: 'T-Shirt', sold: 100, price: 250 },
        { productName: 'Shoes', sold: 60, price: 800 },
        { productName: 'Jeans', sold: 40, price: 1200 },
        { productName: 'Jacket', sold: 25, price: 1500 },
        { productName: 'Cap', sold: 80, price: 150 },
        { productName: 'T-Shirt', sold: 100, price: 250 },
        { productName: 'Shoes', sold: 60, price: 800 },
        { productName: 'Jeans', sold: 40, price: 1200 },
        { productName: 'Jacket', sold: 25, price: 1500 },
        { productName: 'Cap', sold: 80, price: 150 },
        { productName: 'T-Shirt', sold: 100, price: 250 },
        { productName: 'Shoes', sold: 60, price: 800 },
        { productName: 'Jeans', sold: 40, price: 1200 },
        { productName: 'Jacket', sold: 25, price: 1500 },
        { productName: 'Cap', sold: 80, price: 150 },
        { productName: 'T-Shirt', sold: 100, price: 250 },
        { productName: 'Shoes', sold: 60, price: 800 },
        { productName: 'Jeans', sold: 40, price: 1200 },
        { productName: 'Jacket', sold: 25, price: 1500 },
        { productName: 'Cap', sold: 80, price: 150 },
        { productName: 'T-Shirt', sold: 100, price: 250 },
        { productName: 'Shoes', sold: 60, price: 800 },
        { productName: 'Jeans', sold: 40, price: 1200 },
        { productName: 'Jacket', sold: 25, price: 1500 },
        { productName: 'Cap', sold: 80, price: 150 },
        { productName: 'T-Shirt', sold: 100, price: 250 },
        { productName: 'Shoes', sold: 60, price: 800 },
        { productName: 'Jeans', sold: 40, price: 1200 },
        { productName: 'Jacket', sold: 25, price: 1500 },
        { productName: 'Cap', sold: 80, price: 150 },
    ]


    return (
        <div className="p-6 max-w-5xl mx-auto">
            <Typography variant="h5" gutterBottom>
                Vendor Analytics
            </Typography>

            <Card
                sx={{
                    my: 3,
                    background: 'linear-gradient(to right, #1976d2, #42a5f5)',
                    color: 'white',
                    boxShadow: 6,
                    borderRadius: 3,
                    p: 2,
                }}
            >
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Total Revenue: ₹{totalRevenue.toLocaleString()}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                        Total Products Sold: {totalSold}
                    </Typography>
                </CardContent>
            </Card>


            <ResponsiveContainer width="100%" height={400}>
                {/* <BarChart data={dummyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="productName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sold" fill="#1976d2" name="Units Sold" />
                    <Bar dataKey={(item) => item.sold * item.price} fill="#43a047" name="Revenue (₹)" />
                </BarChart> */}
                <TableContainer component={Paper} sx={{ mt: 4 }}>
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
                            {dummyData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{page * rowsPerPage + index + 1 + ". " + row.productName}</TableCell>
                                        <TableCell align="right">{row.sold}</TableCell>
                                        <TableCell align="right">{row.price}</TableCell>
                                        <TableCell align="right">{row.sold * row.price}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>

                    <TablePagination
                        component="div"
                        count={dummyData.length}
                        page={page}
                        onPageChange={(event, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10))
                            setPage(0)
                        }}
                        rowsPerPageOptions={[5, 10, 25]}
                    />
                </TableContainer>

            </ResponsiveContainer>
        </div>
    )
}

export default VendorAnalytics
