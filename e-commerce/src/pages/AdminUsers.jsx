import { useQuery } from '@tanstack/react-query';
import api from '../utlis/api';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Pagination,
    CircularProgress,
    Box,
} from '@mui/material';
import { useEffect, useState } from 'react';

const fetchCustomers = async (pageNum, pageSize, searchTerm) => {
    let url = `/api/admin/customers/?page-num=${pageNum}&page-size=${pageSize}`;
    if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`; // Assuming backend supports search param
    }
    const { data } = await api.get(url);
    // console.log('Customers data:', data);
    return data;
};

const AdminUsers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const customersPerPage = 5;

    const { data: customersData, isLoading: isCustomerLoading, isError: isCustomerError } = useQuery({
        queryKey: ['customers', currentPage, searchTerm],
        queryFn: () => fetchCustomers(currentPage, customersPerPage, searchTerm),
        keepPreviousData: true,
        staleTime: 5000,
    });


    // Reset to page 1 when searchTerm changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    if (isCustomerLoading)
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <CircularProgress />
            </div>
        );

    if (isCustomerError)
        return <div className="text-center text-red-500">Failed to fetch customers.</div>;

    const results = customersData?.results || [];
    const totalPages = customersData?.total_pages || 1;

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <div className="m-6 bg-white p-6 rounded-lg shadow w-[80%] mx-auto">
            <Typography variant="h5" className="font-semibold" sx={{ mb: 4 }}>
                Customer List
            </Typography>

            <TextField
                fullWidth
                label="Search by name"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 4 }}
            />

            {results.length === 0 ? (
                <p className="text-gray-500">No customers found.</p>
            ) : (
                <div className="space-y-4">
                    {results.map((customer, index) => (
                        <Card
                            key={customer.id}
                            className="shadow-sm flex justify-between items-center p-2"
                        >
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="h6">
                                    {(currentPage - 1) * customersPerPage + index + 1}.
                                </Typography>
                                <div>
                                    <Typography variant="h6">Name: {customer.username}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Email: {customer.email}
                                    </Typography>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <Box className="flex justify-center mt-6">
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}
        </div>
    );
};

export default AdminUsers;
