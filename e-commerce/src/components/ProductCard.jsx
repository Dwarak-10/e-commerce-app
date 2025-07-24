import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box
} from '@mui/material'

const ProductCard = ({ product }) => {
  return (
    <Card sx={{ maxWidth: 250, maxHeight:350, borderRadius: 2, boxShadow: 3 }}>
      <CardMedia
        component="img"
        style={{height:100}}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button size="small">View</Button>
          <Button size="small" variant="contained" color="primary">Buy</Button>
        </Box>
      </CardActions>
    </Card>
  )
}

export default ProductCard
