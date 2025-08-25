// MyProducts.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utlis/api';
import ProductCard from '../components/ProductCard';
import { useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';


const fetchMyProducts = async () => {
    const { data } = await api.get(`/api/vendor/products/`)
    // console.log("My Products:", data);
    return data;
};


export default function MyProducts() {

    const queryClient = useQueryClient();

    const { data: products, isLoading, isError } = useQuery({
        queryKey: ["myProducts"],
        queryFn: fetchMyProducts,
    });
    if (isLoading) return <div className='flex justify-center items-center h-screen w-screen'><CircularProgress /></div>;
    if (isError) return <p>Error loading products</p>;


    const handleDeleteProduct = (deletedId) => {
        queryClient.setQueryData(["myProducts"], (old) =>
            old ? old.filter((p) => p.id !== deletedId) : []
        );
    };

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', padding: 2, marginTop: 10 }}>
            <ul className="flex flex-wrap gap-10">
                {products?.map((p) => (
                    <ProductCard key={p.id} product={p}
                        onDelete={handleDeleteProduct}
                    />
                ))}
            </ul>
        </Box>

    );
}
