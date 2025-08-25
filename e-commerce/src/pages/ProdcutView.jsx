import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../utlis/api'
import { CircularProgress, Card, CardContent, Typography, CardMedia, Button } from '@mui/material'
import { addToCart } from '../utlis/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

const fetchProductById = async (id) => {
    try {
        const { data } = await api.get(`/api/vendor/products/${id}/`)
        console.log("Product data:", data)
        return data
    } catch (error) {
        throw new Error('Error fetching product')
    }
}

const ProductView = () => {
    const { id } = useParams()
    const role = useSelector(store => store?.user?.role)
    const { data: product, isLoading, isError } = useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProductById(id),
    })

    const dispatch = useDispatch()

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-screen ">
                <CircularProgress />
            </div>
        )
    }

    if (isError || !product) {
        return <div className="text-center text-red-500 mt-10">Product not found.</div>
    }

    const unitsSold = product.total_quantity_sold || 0
    const revenue = product.total_revenue || 0

    const chartData = [
        { name: 'Units Sold', value: unitsSold },
        { name: 'Revenue', value: revenue }
    ];

    const COLORS = ['#1976d2', '#43a047']

    return (
        <div className="flex justify-around items-center px-4 py-8 bg-gray-100 min-h-screen">
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
                        alt={product.name}
                    />
                </div>

                <CardContent>
                    <Typography
                        variant="h5"
                        className="mb-2"
                        sx={{ fontWeight: 600, color: '#1f2937' }}
                    >
                        {product.name}
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

                        {role === "customer" &&
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
                            </Button>}
                    </div>
                </CardContent>
            </Card>

            {/* Pie Chart Section */}
            {['vendor', 'admin'].includes(role) &&
                <Card
                    className="w-full max-w-2xl mt-6"
                    sx={{
                        borderRadius: 3,
                        boxShadow: 4,
                        padding: 2,
                        backgroundColor: '#ffffff',
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Sales & Revenue Breakdown
                    </Typography>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                                formatter={(value, name) =>
                                    name === 'Revenue'
                                        ? `₹ ${value.toLocaleString()}`
                                        : value
                                }
                            />
                            <Legend />
                            <Bar dataKey="value">
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                </Card>}
        </div>
    )
}

export default ProductView
