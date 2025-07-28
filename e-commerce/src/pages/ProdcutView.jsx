import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {api} from '../utlis/api'
import { CircularProgress, Card, CardContent, Typography, CardMedia, Button } from '@mui/material'

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
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-60">
                <CircularProgress />
            </div>
        )
    }

    if (isError || !product) {
        return <div className="text-center text-red-500 mt-10">Product not found.</div>
    }

    return (
        <div className="flex justify-center p-4">
            <Card className="max-w-xl w-full shadow-lg">
                <div className='flex justify-center'>
                    <CardMedia
                        component="img"
                        sx={{ height: 300, width: 300, objectFit: 'contain' }}
                        image={product.image}
                        alt={product.title}
                    />
                </div>
                <CardContent>
                    <Typography variant="h5">{product.title}</Typography><br />
                    <Typography variant="body1" className="my-2">
                        {product.description}
                    </Typography>
                    <div className='flex justify-between items-center mt-4'>
                        <Typography variant="h6" color="primary">
                            ₹ {product.price}
                        </Typography>
                        <Button variant="contained" color="primary">
                            Add to Cart
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ProductView
