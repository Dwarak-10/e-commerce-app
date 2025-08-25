import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../utlis/api'
import {
    Card, CardContent, Typography, CircularProgress,
    Box,
    TextField
} from '@mui/material'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, TablePagination
} from '@mui/material'
import { useEffect, useState } from 'react'

const fetchVendorAnalytics = async (vendorId) => {
       const { data } = await api.get(`/api/admin/vendors/${vendorId}/analytics/`)
       console.log("Vendor Analytics data:", data)
       return data
}

const VendorAnalytics = () => {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [searchTerm, setSearchTerm] = useState('');
    const [dummyData, setDummyData] = useState([]);


    const { id } = useParams()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['vendor-analytics', id],
        queryFn: () => fetchVendorAnalytics(id),
        // enabled: !!id,
    })
    // if (!id) return <div>Missing Vendor ID</div>; 

    if (isLoading) return <div className="flex justify-center items-center h-screen w-screen"><CircularProgress /></div>
    if (isError) return <div className="text-red-500 text-center">Failed to load analytics</div>

    console.log(data?.Products)
    const allData = [...data?.Products] || [];
    const totalRevenue = Number(data?.Summary?.TotalRevenue) || 0;
    const totalSold = Number(data?.Summary?.TotalProductsSold) || 0;


    useEffect(() => {
        const filteredData = data?.Products?.filter(item =>
            [item?.Product, String(item?.Price)]?.some(field =>
                (field || '')?.toLowerCase()?.includes(searchTerm?.toLowerCase())
            )
        );
        console.log("Filtered Data:", filteredData);
        setDummyData(filteredData);
        setPage(0);
    }, [searchTerm, data?.Products]);

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
            <Box>
                <TextField
                    variant="outlined"
                    placeholder="Search By Products, Price"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>

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
            </ResponsiveContainer>
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
                                    <TableCell>{page * rowsPerPage + index + 1 + ". " + row.Product}</TableCell>
                                    <TableCell align="right">{row.QuantitySold}</TableCell>
                                    <TableCell align="right">{row.Price}</TableCell>
                                    <TableCell align="right">{row.Total}</TableCell>
                                </TableRow>
                            ))}
                        {dummyData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No Data Available
                                </TableCell>
                            </TableRow>
                        )}
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

        </div>
    )
}

export default VendorAnalytics
