import { Span } from "@jumbo/shared";
import { 
  CardMedia, 
  ListItem, 
  ListItemText, 
  Typography, 
  Button, 
  IconButton,
  Box,
  TextField
} from "@mui/material";
import { Add, Remove, ShoppingCart, Delete } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useCart } from "../CartProvider";

const Product = ({ product }) => {
  const { 
    getCartItem, 
    addToCart, 
    removeFromCart, 
    updateQuantity 
  } = useCart();
  
  const cartItem = getCartItem(product.id);

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        boxShadow: 1,
      }}
    >
      <CardMedia
        component="img"
        image={product.thumb}
        alt={product.name}
        sx={{
          width: 120,
          height: 161,
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
      <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
          {product.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
            ${product.price}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            ${product.salePrice}
          </Typography>
        </Box>
        
        {/* Cart Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
          <Button
            variant={cartItem ? "outlined" : "contained"}
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            size="small"
            fullWidth
          >
            {cartItem ? "Added to Cart" : "Add to Cart"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export { Product };

Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    thumb: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    salePrice: PropTypes.number.isRequired,
  }).isRequired,
};