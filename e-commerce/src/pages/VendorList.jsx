import { useQuery } from '@tanstack/react-query';
import api from '../utlis/api';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Pagination,
    CircularProgress,
    CardActions,
    Button,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const fetchVendors = async (page, rowsPerPage, searchTerm, filters) => {
    let url = `/api/admin/vendors/?page-num=${page}&page-size=${rowsPerPage}`;

    if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
    }

    Object.entries(filters).forEach(([key, value]) => {
        if (value) url += `&${key}=${encodeURIComponent(value)}`;
    });

    const { data } = await api.get(url);
    // console.log('Vendors data:', data);
    return data;
};

const VendorList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({});
    const [vendorsPerPage, setVendorsPerPage] = useState(5);

    const searchRef = useRef(null);

    useEffect(() => {
        if (searchRef.current) {
            searchRef.current.focus();
        }
    }, []);

    const {
        data: vendors,
        isLoading: isVendorLoading,
        isError: isVendorError,
    } = useQuery({
        queryKey: ['vendors', currentPage, vendorsPerPage, searchTerm, filters],
        queryFn: () => fetchVendors(currentPage, vendorsPerPage, searchTerm, filters),
        keepPreviousData: true,
    });

    const handlePageChange = (_, newPage) => {
        setCurrentPage(newPage);
    };

    const handleRowsPerPageChange = (e) => {
        setVendorsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1);
    };

    if (isVendorLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <CircularProgress />
            </div>
        );
    }

    if (isVendorError) {
        return <div className="text-center text-red-500">Failed to fetch vendors.</div>;
    }

    const currentVendors = vendors?.results || [];
    const totalPages = vendors?.total_pages || 1;

    return (
        <div className="m-6 bg-white p-6 rounded-lg shadow w-[80%] mx-auto">
            <Typography variant="h5" className="font-semibold" sx={{ mb: 4 }}>
                Vendor List
            </Typography>

            {/* Search bar */}
            <TextField
                fullWidth
                label="Search by name, email or company"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); 
                }}
                sx={{ mb: 4 }}
            />

            {/* Vendor cards */}
            {currentVendors?.length === 0 ? (
                <p className="text-gray-500">No vendors found.</p>
            ) : (
                <div className="space-y-4">
                    {currentVendors.map((vendor, index) => (
                        <Card
                            key={vendor.id}
                            className="shadow-sm flex justify-between items-center p-4"
                        >
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <div className="flex gap-2">
                                    <Typography variant="h6">
                                        {(vendors?.current_page - 1) * vendorsPerPage + index + 1}.
                                    </Typography>
                                    <div>
                                        <Typography variant="h6">Name: {vendor.username}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Email: {vendor.email}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Phone: {vendor.phone || 'N/A'}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Company: {vendor.company_name || vendor.company || 'N/A'}
                                        </Typography>
                                    </div>
                                </div>
                            </CardContent>
                            <CardActions>
                                <Button
                                    href={`/admin/vendor/${vendor.id}/analytics`}
                                    sx={{
                                        color: 'white',
                                        backgroundColor: '#43a047',
                                        textTransform: 'none',
                                        '&:hover': { backgroundColor: '#2e7d32' },
                                    }}
                                    size="medium"
                                >
                                    Analytics
                                </Button>
                                <Button
                                    href={`/admin/vendor/${vendor.id}`}
                                    sx={{
                                        color: 'white',
                                        backgroundColor: '#1976d2',
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: '#125ea6',
                                        },
                                    }}
                                    size="medium"
                                >
                                    View Products
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </div>
            )}

            {/*  Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination
                        count={totalPages}
                        page={vendors?.current_page || 1}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </div>
            )}
        </div>
    );
};

export default VendorList;
