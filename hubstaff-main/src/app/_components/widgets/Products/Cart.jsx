import { 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  IconButton, 
  Button, 
  Box,
  Divider,
  TextField
} from "@mui/material";
import { Add, Remove, Delete, ShoppingCart } from "@mui/icons-material";
import { Span } from "@jumbo/shared";
import PropTypes from "prop-types";

const Cart = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  onClearCart,
  checkoutWithStripe,
  loading = false,
  error = null
}) => {
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.salePrice * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };
  const handleStripeCheckout = () => {
    if (typeof checkoutWithStripe === 'function') {
      checkoutWithStripe();
    } else {
      console.error('checkoutWithStripe is not a function');
    }
  };
  
  if (cartItems.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <ShoppingCart sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Your cart is empty
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add some products to get started
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography variant="body2" color="error.contrastText">
              {error}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Shopping Cart
          </Typography>
          <Button 
            variant="outlined" 
            color="error" 
            size="small"
            onClick={onClearCart}
            disabled={loading}
          >
            Clear Cart
          </Button>
        </Box>
        
        <List>
          {cartItems.map((item, index) => (
            <div key={item.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    src={item.thumb}
                    alt={item.name}
                    sx={{ width: 56, height: 56 ,marginRight:2 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Span sx={{ color: "text.secondary" }}>
                          <del>${item.price}</del>
                        </Span>
                        <Typography variant="body2" fontWeight="bold">
                          ${item.salePrice}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Remove />
                    </IconButton>
                    
                    <TextField
                      size="small"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        onUpdateQuantity(item.productId, value);
                      }}
                      sx={{ width: 60 }}
                      inputProps={{ 
                        min: 1, 
                        style: { textAlign: 'center' } 
                      }}
                    />
                    
                    <IconButton
                      size="small"
                      onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body2" fontWeight="bold">
                    ${(item.quantity * item.salePrice).toFixed(2)}
                  </Typography>
                  
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onRemoveFromCart(item.productId)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </ListItem>
              {index < cartItems.length - 1 && <Divider />}
            </div>
          ))}
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Total ({getCartItemCount()} items):
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            ${getCartTotal().toFixed(2)}
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleStripeCheckout}
          disabled={cartItems.length === 0 || loading}
        >
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </Button>
      </CardContent>
    </Card>
  );
};

export { Cart };

Cart.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      productId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      thumb: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      salePrice: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemoveFromCart: PropTypes.func.isRequired,
  onClearCart: PropTypes.func.isRequired,
  onCheckout: PropTypes.func.isRequired,
  checkoutWithStripe: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
}; 