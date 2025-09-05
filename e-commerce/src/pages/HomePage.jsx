import { useQuery } from '@tanstack/react-query'
import ProductCard from '../components/ProductCard'
import { CircularProgress, Typography, Button } from '@mui/material'
import api from '../utlis/api'
import { useState } from 'react'

const fetchProducts = async (pageNum = 1, productPerPage = 10) => {
    const { data } = await api.get(`/api/product/?page-num=${pageNum}&page-size=${productPerPage}`)
    return data
}

const HomePage = () => {
    const [page, setPage] = useState(1)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['products', page],
        queryFn: ({ queryKey }) => {
            const [_key, pageNum] = queryKey
            return fetchProducts(pageNum)
        },
        keepPreviousData: true,
    })

    const products = data?.results || []
    const totalPages = data?.total_pages || 1
    const currentPage = data?.current_page || page

    // Pagination handlers
    const handlePrev = () => setPage((p) => Math.max(p - 1, 1))
    const handleNext = () => setPage((p) => Math.min(p + 1, totalPages))

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-60">
                <CircularProgress />
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

    if (!products.length) {
        return (
            <div className="text-center text-red-500 mt-10">
                No products available.
            </div>
        )
    }

    return (
        <div className="p-4">
            <Typography variant="h4" align="center" gutterBottom>
                All Products
            </Typography>
            <div className="flex flex-wrap justify-center gap-10">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-8">
                    <Button
                        variant="outlined"
                        onClick={handlePrev}
                        disabled={!data?.previous}
                    >
                        Previous
                    </Button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outlined"
                        onClick={handleNext}
                        disabled={!data?.next}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}

export default HomePage
