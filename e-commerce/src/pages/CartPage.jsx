import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart } from '../utlis/cartSlice'
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material'

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items)
  const dispatch = useDispatch()

  if (cartItems.length === 0) {
    return <h2 className="text-center text-xl mt-10">Your cart is empty.</h2>
  }

  return (
    <div className="p-4 grid md:grid-cols-2 gap-4">
      {cartItems.map((item) => (
        <Card key={item.id} className="flex">
          <CardMedia
            component="img"
            image={item.image}
            alt={item.title}
            sx={{ width: 150 }}
          />
          <CardContent className="flex-1">
            <Typography variant="h6">{item.title}</Typography>
            <Typography variant="body2" className="my-2">
              {item.description}
            </Typography>
            <Typography variant="body1" color="primary">
              ₹ {item.price}
            </Typography>
            <Typography variant="body2">Qty: {item.quantity}</Typography>
            <Button
              variant="outlined"
              color="error"
              className="mt-2"
              onClick={() => dispatch(removeFromCart(item.id))}
            >
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default CartPage
