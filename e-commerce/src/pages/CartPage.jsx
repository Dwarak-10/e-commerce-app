import { useSelector, useDispatch } from 'react-redux'
import { addToCart, clearCart, deleteCartItem, removeFromCart } from '../utlis/cartSlice'
import { Card, CardMedia, CardContent, Typography, Button, CircularProgress, Box, Grid, Divider, Snackbar } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import api from '../utlis/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'


const fetchCartData = async () => {
  const response = await api.get('/api/add-to-cart/')
  // console.log("Cart data:", response.data?.items)
  return response.data?.items
}

const orderPlaced = async (cartData) => {
  const response = await api.post('/api/buy-now/', { cart: cartData })
  // console.log("Order placed data:", response.data)
  return response.data
}

const deleteCart = async (itemId) => {
  const response = await api.delete(`/api/add-to-cart/${itemId}/`)
  // console.log("Delete Cart data:", response)
  return response
}

const CartPage = () => {
  // const cartItems = useSelector((state) => state.cart.items)
  const [snackbar, setSnackbar] = useState({ open: false, message: '' })
  const [deletingItemId, setDeletingItemId] = useState(null);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { data: cartItems, isLoading: isLoadingCart, isError: isErrorCart } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCartData,
  });


  const cartData = useSelector((state) => state.cart.items);
  const mergedData = cartData.map(product => {
    // Find matching cart item where product.id === cartItem.product_id
    const matchingCartItem = cartItems?.find(cartItem => cartItem.product_id === product.id);

    // If found, add CartId from cartItem.id, else no CartId
    return {
      ...product,
      ...(matchingCartItem ? { CartId: matchingCartItem.id } : {})
    };
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteCart,
    onSuccess: () => {
      // Refetch cart after delete or invalidate cart query cache
      queryClient.invalidateQueries(['cart']);
    },
    onError: (error) => {
      console.error("Failed to delete cart item:", error);
      setSnackbar({ open: true, message: 'Failed to remove item from cart' });
    },
  });
  const handleDeleteCartItem = (productId) => {
    const itemToDelete = mergedData.find(item => item.CartId === productId);
    if (!itemToDelete) {
      console.error("Item not found in mergedData");
      return;
    }

    const backendId = itemToDelete.CartId || itemToDelete.id; // cart-specific id for Redux
    const cartItemId = itemToDelete.id; // product id or backend id for mutation

    setDeletingItemId(productId);

    deleteMutation.mutate(backendId, {
      onSuccess: () => {
        dispatch(deleteCartItem(cartItemId));
        queryClient.invalidateQueries(['cart']);
        setDeletingItemId(null);
      },
      onError: (error) => {
        console.error("Failed to delete item", error);
        setDeletingItemId(null);
      }
    });
  };




  const orderMutation = useMutation({
    mutationFn: orderPlaced,
    onSuccess: () => {
      // Handle successful order placement
      queryClient.invalidateQueries(['cart']);
      dispatch(clearCart());
      setSnackbar({ open: true, message: 'Order placed successfully!' });
    },
    onError: (error) => {
      console.error("Failed to place order:", error);
      // Optionally show toast/snackbar for error
      setSnackbar({ open: true, message: 'Failed to place order' });
    },
  });

  if (isLoadingCart) {
    return <h2 className="flex justify-center items-center h-screen w-screen"><CircularProgress /></h2>
  }
  if (isErrorCart) {
    return <h2 className="text-center text-xl mt-10">Error loading cart.</h2>
  }
  if (cartItems?.length === 0) {
    return <h2 className="text-center text-xl mt-10">Your cart is empty.</h2>
  }


  return (
    <Box p={{ xs: 2, md: 6 }} bgcolor="#f9f9f9" minHeight="100vh">
      <Typography variant="h4" fontWeight={700} mb={4} color="text.primary">
        🛒 Your Cart
      </Typography>

      <Grid container spacing={4}>
        {cartItems.length === 0 ? (
          <Typography variant="h6" color="text.secondary" textAlign="center" width="100%">
            Your cart is empty.
          </Typography>
        ) : (
          <>
            <Grid  >
              <Grid container direction="row" spacing={3}>
                {cartItems.map((item) => (
                  <Grid key={item.id}>
                    <Card
                      sx={{
                        // display: 'flex',
                        boxShadow: 2,
                        borderRadius: 2,
                        bgcolor: '#fff',
                        p: 2,
                        transition: 'box-shadow 0.3s ease',
                        '&:hover': { boxShadow: 6 },
                        width: 400,
                        height: 250,
                      }}
                    >
                      <div className='flex'>
                        <CardMedia
                          component="img"
                          image={item.product_image || '/placeholder-image.png'}
                          alt={item.product_name}
                          sx={{
                            width: 140,
                            height: 140,
                            objectFit: 'contain',
                            borderRadius: 2,
                            mr: 3,
                            bgcolor: '#fafafa',
                          }}
                        />
                        <CardContent sx={{ flexGrow: 1, p: 0 }}>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            {item.product_name}
                          </Typography>
                          {/* Uncomment below if you add descriptions */}
                          {/* <Typography variant="body2" color="text.secondary" mb={2}>
                          {item.description.length > 100 ? item.description.slice(0, 100) + '...' : item.description}
                        </Typography> */}
                          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                              ₹ {parseFloat(item.total).toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Qty: <Box component="span" fontWeight="600">{item.quantity}</Box>
                            </Typography>
                          </Box>
                        </CardContent>
                      </div>
                      <Box mt={3} ml={4} display="flex" gap={2}>
                        {/* <div
                          // onClick={() => handleDeleteCartItem(item.id)}
                          style={{
                            cursor: 'pointer',
                            padding: '6px 12px',
                            border: '1px solid #f44336',
                            borderRadius: '4px',
                            color: '#f44336',
                            fontWeight: 600,
                          }}
                        >
                          <strong>-</strong>
                        </div> */}
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteCartItem(item.id)}
                          sx={{ textTransform: 'none', fontWeight: 600 }}
                          disabled={deleteMutation.isPending && deletingItemId === item.id}
                          startIcon={deleteMutation.isPending && deletingItemId === item.id ? <CircularProgress size={16} /> : null}
                        >
                          Delete
                        </Button>
                        {/* <div
                          // onClick={}
                          style={{
                            cursor: 'pointer',
                            padding: '6px 12px',
                            border: '1px solid #4caf50',
                            borderRadius: '4px',
                            color: '#4caf50',
                            fontWeight: 600,
                          }}
                        >
                          <strong>+</strong>
                        </div> */}
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => { navigate(`/products/${item.product_id}`) }}
                          sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                          View
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid>
              <Box
                sx={{
                  bgcolor: '#fff',
                  borderRadius: 2,
                  p: 4,
                  boxShadow: 3,
                  position: { md: 'sticky' },
                  top: { md: 80 },
                }}
              >
                <Typography variant="h6" fontWeight={700} mb={3}>
                  Order Summary
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="body1" fontWeight={600}>
                    Total Items:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={4}>
                  <Typography variant="body1" fontWeight={600}>
                    Total Price:
                  </Typography>
                  <Typography variant="body1" fontWeight={700} color="primary">
                    ₹{' '}
                    {cartItems
                      .reduce((sum, item) => sum + parseFloat(item.total), 0)
                      .toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="warning"
                  fullWidth
                  size="large"
                  onClick={() => orderMutation.mutate(cartItems)}
                  disabled={orderMutation.isPending}
                  sx={{ textTransform: 'none', fontWeight: 700 }}
                >
                  {orderMutation.isPending ? 'Processing...' : 'Buy Now'}
                </Button>

              </Box>
            </Grid>
          </>
        )}
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Box>
  );

}

export default CartPage
