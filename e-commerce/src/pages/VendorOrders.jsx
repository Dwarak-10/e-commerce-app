import React, { useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    CircularProgress,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import api from '../utlis/api';

const fetchVendorOrders = async () => {
    const { data } = await api.get(`/api/vendor-orders/`)
    // console.log("Vendor Orders data:", data)
    return data
}

const VendorOrders = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useQuery({
        queryKey: ['vendorOrders'],
        queryFn: fetchVendorOrders
    })
    if (ordersLoading) return <div className="flex justify-center items-center h-screen w-screen"><CircularProgress /></div>
    if (ordersError) return <div>Error loading orders data</div>
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedOrders = ordersData?.items?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Vendor Orders
            </Typography>

            <TableContainer component={Paper}>
                <Table aria-label="vendor orders table">
                    <TableHead>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            {/* <TableCell>Order ID</TableCell> */}
                            <TableCell>Product Name</TableCell>
                            <TableCell align="right">Price (₹)</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Total (₹)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedOrders?.map((order, index) => (
                            <TableRow key={order.id}>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                {/* <TableCell>{order.id}</TableCell> */}
                                <TableCell>{order.product_name}</TableCell>
                                <TableCell align="right">{Number(order.price).toFixed(2)}</TableCell>
                                <TableCell align="right">{order.quantity}</TableCell>
                                <TableCell align="right">{Number(order.total).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}

                        {paginatedOrders?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No orders available</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={ordersData?.items?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {/* Overall total display */}
            <Box mt={3} display="flex" justifyContent="flex-end">
                <Typography variant="h6" fontWeight="bold">
                    Overall Total: ₹{Number(ordersData?.overall_total)?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Typography>
            </Box>
        </Box>
    );
};

export default VendorOrders;
