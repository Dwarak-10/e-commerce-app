import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../utlis/api'
import { CircularProgress, Card, CardContent, Typography, CardMedia, Button, Snackbar, Box } from '@mui/material'
import { addToCart } from '../utlis/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { useAddToCart } from '../utlis/service';
import { useState } from 'react'

const fetchProductById = async (id) => {
    try {

        const userRole = JSON.parse(localStorage.getItem('user'))?.role;
        const url = ['vendor', 'admin'].includes(userRole) ? `/api/vendor/products/${id}/` : `/api/product/details/${id}/`;
        const { data } = await api.get(url);
        // console.log("Product data:", data)
        return data
    } catch (error) {
        console.log(error)
        // throw new Error('Error fetching product')
    }
}

const ProductView = () => {
    const { id } = useParams()
    const role = useSelector(store => store?.user?.role)
    const [snackbar, setSnackbar] = useState({ open: false, message: '' })
    const dispatch = useDispatch()

    const { data: product, isLoading, isError } = useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProductById(id),
    })
    const addToCartMutation = useAddToCart();

    const handleAddToCart = async () => {
        try {
            dispatch(addToCart(product));
            await addToCartMutation.mutateAsync(product.id);
            setSnackbar({ open: true, message: 'Product added to cart' });
        } catch {
            setSnackbar({ open: true, message: 'Failed to add product to cart' });
        }
    };



    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-screen ">
                <CircularProgress />
            </div>
        )
    }

    if (isError) {
        return <div className="text-center text-red-500 mt-10">No product found.</div>
    }

    const totalSales = product.total_quantity_sold || 0
    const totalRevenue = product.total_revenue || 0


    const chartData = [
        { name: 'Revenue', revenue: Number(product.total_revenue) || 0 },
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || payload.length === 0) return null;

        const revenueBar = payload.find(entry => entry.dataKey === "revenue");

        if (!revenueBar) return null;
        const barData = revenueBar;
        return (
            <div style={{ backgroundColor: '#fff', padding: 10, border: '1px solid #ccc' }}>
                <p style={{ margin: 0, color: barData.color, fontWeight: 'bold' }}>
                    Revenue: ₹ {barData?.value?.toLocaleString()}
                </p>
            </div>
        );
    };

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
                                sx={{ textTransform: 'none', px: 3, py: 1, borderRadius: '8px' }}
                                onClick={handleAddToCart}
                                disabled={addToCartMutation.isPending}
                            >
                                {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
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

                    <Box>



                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="revenue" name="Revenue" fill="#43a047" barSize={200} />
                            </BarChart>
                        </ResponsiveContainer>


                        <div>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Total Sales: {totalSales.toLocaleString()}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Total Revenue: ₹{totalRevenue.toLocaleString()}
                            </Typography>
                        </div>

                    </Box>

                </Card>}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={() => setSnackbar({ open: false, message: '' })}
                message={snackbar.message}
            />
        </div>
    )
}

export default ProductView
