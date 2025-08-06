import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import  api  from '../utlis/api'
import { CircularProgress, Card, CardContent, Typography, CardMedia, Button } from '@mui/material'
import { addToCart } from '../utlis/cartSlice'
import { useDispatch } from 'react-redux'

const fetchProductById = async (id) => {
    try {
        const { data } = await api.get(`/products/${id}`)
        return data
    } catch (error) {
        throw new Error('Error fetching product')
    }
}

const ProductView = () => {
    const { id } = useParams()
    const { data: product, isLoading, isError } = useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProductById(id),
    })

    const dispatch = useDispatch()
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-60">
                <CircularProgress />
            </div>
        )
    }

    if (isError || !product || product.lenghth === 0) {
        return <div className="text-center text-red-500 mt-10">Product not found.</div>
    }

    return (
        <div className="flex justify-center px-4 py-8 bg-gray-100 min-h-screen">
            <Card
                className="w-full max-w-2xl"
                sx={{
                    borderRadius: 3,
                    boxShadow: 4,
                    padding: 2,
                    backgroundColor: '#ffffff',
                }}
            >
                <div className="flex justify-center p-4">
                    <CardMedia
                        component="img"
                        sx={{
                            height: 300,
                            width: 300,
                            objectFit: 'contain',
                            borderRadius: 2,
                            boxShadow: 2,
                        }}
                        image={product.image}
                        alt={product.title}
                    />
                </div>

                <CardContent>
                    <Typography
                        variant="h5"
                        className="mb-2"
                        sx={{ fontWeight: 600, color: '#1f2937' }}
                    >
                        {product.title}
                    </Typography>

                    <Typography
                        variant="body2"
                        className="text-gray-600"
                        sx={{ marginBottom: 2 }}
                    >
                        {product.description}
                    </Typography>

                    <div className="flex justify-between items-center mt-6">
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: '#16a34a' }}
                        >
                            ₹ {product.price}
                        </Typography>

                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                textTransform: 'none',
                                px: 3,
                                py: 1,
                                borderRadius: '8px',
                            }}
                            onClick={() => dispatch(addToCart(product))}
                        >
                            Add to Cart
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ProductView
