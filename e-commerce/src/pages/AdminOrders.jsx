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
  Collapse,
  IconButton,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useQuery } from '@tanstack/react-query';
import api from '../utlis/api';

const fetchOrders = async ({ queryKey }) => {
  const [_key, page, rowsPerPage] = queryKey;
  const { data } = await api.get(
    `/api/admin/orders/?page-num=${page + 1}&page-size=${rowsPerPage}`
  );
  return data;
};

const AdminOrders = () => {
  const [expandedOrderIds, setExpandedOrderIds] = useState([]);
  const [page, setPage] = useState(0); // MUI TablePagination is 0-based
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const {
    data: ordersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['ordersData', page, rowsPerPage],
    queryFn: fetchOrders,
    keepPreviousData: true, 
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <CircularProgress />
      </div>
    );
  if (isError) return <p>Error loading orders</p>;

  const orders = ordersData?.results?.orders || [];
  const totalCount = ordersData?.count || 0;
  const overallTotal = ordersData?.results?.Total || 0;

  const toggleExpand = (id) => {
    setExpandedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Admin Orders
      </Typography>

      <TableContainer component={Paper}>
        <Table aria-label="admin orders table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>S.No</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Date and Time</TableCell>
              <TableCell align="right">Total (₹)</TableCell>
              <TableCell>Items</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <TableRow>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{order.username}</TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      ₹{' '}
                      {Number(order.total).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => toggleExpand(order.id)}
                      >
                        {expandedOrderIds.includes(order.id) ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      sx={{ pb: 0, pt: 0, backgroundColor: 'azure' }}
                    >
                      <Collapse
                        in={expandedOrderIds.includes(order.id)}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={2}>
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            component="div"
                          >
                            Items Ordered by {order.username}
                          </Typography>
                          <Table size="small" aria-label="order-items">
                            <TableHead>
                              <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                <TableCell>S.No</TableCell>
                                <TableCell>Product Name</TableCell>
                                <TableCell align="right">Price (₹)</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Total (₹)</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {order.items.map((item, idx) => (
                                <TableRow key={item.id}>
                                  <TableCell>{idx + 1}.</TableCell>
                                  <TableCell>{item.product_name}</TableCell>
                                  <TableCell align="right">
                                    {Number(item.price).toFixed(2)}
                                  </TableCell>
                                  <TableCell align="right">
                                    {item.quantity}
                                  </TableCell>
                                  <TableCell align="right">
                                    {Number(item.total).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Typography variant="h6" fontWeight="bold">
          Overall Total: ₹
          {Number(overallTotal).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminOrders;
