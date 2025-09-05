import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utlis/api';
import ProductCard from '../components/ProductCard';
import { Box, CircularProgress, Button, Typography } from '@mui/material';
import { useState } from 'react';

const fetchMyProducts = async (page, productsPerPage) => {
    const { data } = await api.get(`/api/vendor/products/?page-num=${page}&page-size=${productsPerPage}`);
    // console.log("My Products:", data);
    return data;
};

export default function MyProducts() {
    const [page, setPage] = useState(1);
    const productsPerPage = 10;
    const queryClient = useQueryClient();

    // Use object form for v5 and pass page, productsPerPage via queryKey
    const { data, isLoading, isError } = useQuery({
        queryKey: ["myProducts", page, productsPerPage],
        queryFn: ({ queryKey }) => {
            const [_key, pageNum, pageSize] = queryKey;
            return fetchMyProducts(pageNum, pageSize);
        },
        keepPreviousData: true,
    });

    const products = data?.results || [];
    const currentPage = data?.current_page || page;
    const totalPages = data?.total_pages || 1;


    const handleDeleteProduct = (deletedId) => {
        queryClient.setQueryData(["myProducts", page, productsPerPage], (old) => {
            if (!old) return old;
            const filtered = old.results.filter((p) => p.id !== deletedId);
            return { ...old, results: filtered };
        });
        // Optionally: refetch if this page is now empty and not the first page
        if (products.length === 1 && currentPage > 1) {
            setPage(currentPage - 1);
        }
    };

    const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
    const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

    if (isLoading)
        return (
            <div className='flex justify-center items-center h-screen w-screen'><CircularProgress /></div>
        );
    if (isError)
        return <p>Error loading products</p>;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3, alignItems: 'center', padding: 2 }}>
            {products.length === 0 && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    No products found. Please add some products.
                </Box>
            )}
            {products.length !== 0 && (
                <Typography variant="h4" component="h1" >
                    My Products
                </Typography>
            )}
            <ul className="flex flex-wrap gap-10">

                {products.map((p) => (
                    <li key={p.id}>
                        <ProductCard product={p} onDelete={handleDeleteProduct} />
                    </li>
                ))}
            </ul>
            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={3}>
                    <Button variant="outlined" onClick={handlePrev} disabled={!data?.previous}>
                        Previous
                    </Button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <Button variant="outlined" onClick={handleNext} disabled={!data?.next}>
                        Next
                    </Button>
                </Box>
            )}
        </Box>
    );
}
