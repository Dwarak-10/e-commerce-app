import { useSelector, useDispatch } from 'react-redux'
import { clearCart, removeFromCart } from '../utlis/cartSlice'
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'



const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items)
  const dispatch = useDispatch()
  const navigate = useNavigate()
console.log(cartItems)
  if (cartItems.length === 0) {
    return <h2 className="text-center text-xl mt-10">Your cart is empty.</h2>
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">🛒 Your Cart</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col md:flex-row items-start"
              sx={{
                backgroundColor: '#fff',
                borderRadius: 3,
                boxShadow: 3,
              }}
            >
              <CardMedia
                component="img"
                image={item.image}
                alt={item.name}
                sx={{
                  width: 150,
                  height: 150,
                  objectFit: 'contain',
                  borderRadius: '12px 0 0 12px',
                  margin: 'auto',
                  padding: 1,
                }}
              />

              <CardContent className="flex-1">
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {item.name}
                </Typography>

                <Typography variant="body2" sx={{ color: 'gray' }} className="my-1">
                  {item.description.length > 100
                    ? item.description.slice(0, 100) + '...'
                    : item.description}
                </Typography>

                <div className="flex justify-between items-center mt-3">
                  <Typography variant="h6" color="primary">
                    ₹ {item.price}
                  </Typography>

                  <Typography variant="body2" className="text-gray-600">
                    Qty: <span className="font-semibold">{item.quantity}</span>
                  </Typography>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => dispatch(removeFromCart(item.id))}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                      }}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => navigate('/products/' + item.id)}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                      }}
                    >
                      View
                    </Button>
                  </div>


                </div>

              </CardContent>
            </Card>
          ))
        )}
      </div>
      <div className='flex justify-end mt-5'>
        <Button
          variant="contained"
          color="warning"
          size="large"
          onClick={() => alert("Your order is being processed", navigate("/home"), dispatch(clearCart()))

          }
          sx={{
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Buy Now
        </Button>
      </div>
    </div>
  )
}

export default CartPage
