import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { addToCart } from '../utlis/cartSlice'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const location = useLocation()

  if (Object.keys(product).length === 0) {
    return <div className="text-center text-red-500 mt-10">Product not found.</div>
  }

  return (
    <Card sx={{ maxWidth: 250, maxHeight: 350, borderRadius: 2, boxShadow: 3 }}>
      <CardMedia
        component="img"
        style={{ height: 100 }}
        image={product.image}
        alt={product.title}
        sx={{ objectFit: 'contain' }}
      />
      <CardContent>
        <Typography variant="h6" component="div" noWrap>
          {product.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ height: 60, overflow: 'hidden' }}>
          {product.description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
          ₹{product.price}
        </Typography>
      </CardContent>
      <CardActions>
        {location.pathname === '/vendor' ? (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button size="small" variant="contained" color='success'>Edit</Button>
            <Button size="small" variant="contained" color="warning">Delete</Button>
          </Box>
        ) :
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            {location.pathname === '/admin/vendor/:id' ? (
              <div className='flex justify-between gap-2'>
                <Button size="small" fullWidth variant="contained" color="primary" sx={{ fontSize: "8px" }} onClick={() => dispatch(addToCart(product))}>Add to Cart</Button>
                <Button size="small" fullWidth variant="outlined" color="success" >Buy</Button>
                <Link to={`/products/${product.id}`} >
                  <Button variant="outlined" fullWidth >View</Button>
                </Link>
              </div>
            ) : (
              <>
                <Link to={`/products/${product.id}`} >
                  <Button variant="outlined" fullWidth >View</Button>
                </Link>
              </>

            )}


          </Box>}
      </CardActions>
    </Card>
  )
}

export default ProductCard
