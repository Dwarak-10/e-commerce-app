import {
  Card, CardMedia, CardContent, Typography,
  CardActions, Button, Box, Dialog, DialogTitle,
  DialogActions, Snackbar
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import api from '../utlis/api'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAddToCart } from '../utlis/service'
import { addToCart } from '../utlis/cartSlice'



const ProductCard = ({ product, onDelete }) => {
  // console.log(product)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const userData = useSelector((state) => state.user)
  const [openDialog, setOpenDialog] = useState(false)
  const addToCartMutation = useAddToCart();

  const [snackbar, setSnackbar] = useState({ open: false, message: '' })

  const handleDelete = async () => {
    try {
      await api.delete(`/api/vendor/products/${product.id}/`)
      setSnackbar({ open: true, message: 'Product deleted successfully' })
      setOpenDialog(false)
      onDelete && onDelete(product.id)
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete product' })
    }
  }

  if (!product || Object.keys(product).length === 0) {
    return <div className="text-center text-red-500 mt-10">Product not found.</div>
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product))
    addToCartMutation.mutate(product.id, {
      onSuccess: () => {
        setSnackbar({ open: true, message: 'Product added to cart' });
      },
      onError: () => {
        setSnackbar({ open: true, message: 'Failed to add product to cart' });
      },
    });
  };

  return (
    <>
      <Card sx={{ maxWidth: 250, minWidth: 250, maxHeight: 350, borderRadius: 2, boxShadow: 3 }}>
        <CardMedia
          component="img"
          style={{ height: 100 }}
          image={product.image}
          alt={product.name}
          sx={{ objectFit: 'contain' }}
        />
        <CardContent>
          <Typography variant="h6" component="div" noWrap>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ height: 60, overflow: 'hidden' }}>
            {product.description}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
            ₹{product.price}
          </Typography>
        </CardContent>
        <CardActions>
          {pathname === '/vendor/my-products' ? (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => navigate(`/vendor/products/${product.id}/edit`)}
              >
                Edit
              </Button>
              <Link to={`/products/${product.id}`}>
                <Button variant="contained" fullWidth>
                  View
                </Button>
              </Link>
              <Button
                size="small"
                variant="contained"
                color="warning"
                onClick={() => setOpenDialog(true)}
              >
                Delete
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Link to={`/products/${product.id}`}>
                <Button variant="outlined" fullWidth>
                  View
                </Button>
              </Link>
              {userData?.role === "customer" &&
                <Button
                  variant="contained"
                  color="primary"
                  size='medium'
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                >
                  {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                </Button>}
            </Box>
          )}
        </CardActions>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </>
  )
}

export default ProductCard
