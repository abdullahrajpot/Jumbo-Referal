import { Grid, Container, Typography, Box } from "@mui/material";
import { 
  PopularProducts, 
  CartWidget, 
  CartProvider 
} from "../index";

const ProductsDemo = () => {
  return (
    <CartProvider>
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Products 
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
          Checkout what other people are liking the most.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <PopularProducts
            title="Popular Products"
            subheader="Discover our most popular items with great deals"
          />
        </Box>
        <Box>
          <CartWidget />
        </Box>
      </Container>
    </CartProvider>
  );
};

export { ProductsDemo }; 