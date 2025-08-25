import { useQuery } from '@tanstack/react-query'
import ProductCard from '../components/ProductCard'
import { CircularProgress, Typography } from '@mui/material'
import api from '../utlis/api'

const fetchProducts = async () => {
    const { data } = await api.get('/api/product/')
    console.log(data)
    return data
}

const HomePage = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    })

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-60">
                <CircularProgress />
            </div>
        )
    }
    if (!data || data.length === 0) {
        return (
            <div className="text-center text-red-500 mt-10">
                No products available.
            </div>
        )
    }

    if (isError) {
        return (
            <div className="text-center text-red-500 mt-10">
                Failed to load products.
            </div>
        )
    }

    return (
        <div className="p-4">
            <Typography variant="h4" align="center" gutterBottom>
                All Products
            </Typography>
            <div className="flex flex-wrap justify-center gap-10">
                {data?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default HomePage
