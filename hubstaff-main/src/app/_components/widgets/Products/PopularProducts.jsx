import { CardActions, List, Box } from "@mui/material";
import Button from "@mui/material/Button";
import { ShoppingCart } from "@mui/icons-material";

import { JumboCard } from "@jumbo/components";
import { JumboDdMenu } from "@jumbo/components/JumboDdMenu";
import { Product } from "./components";
import { menuItems, productsData } from "./data";
import PropTypes from "prop-types";
import { useCart } from "./CartProvider";

const PopularProducts = ({ title, subheader }) => {
  const { getCartTotal, getCartItemCount } = useCart();

  return (
    <JumboCard
      title={title}
      subheader={subheader}
      action={<JumboDdMenu menuItems={menuItems} />}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 3,
          p: 2,
        }}
      >
        {productsData.map((item, key) => (
          <Product 
            key={key} 
            product={item}
          />
        ))}
      </Box>
      <CardActions sx={{ justifyContent: 'space-between', px: 3 

       }}>
        <Button variant={"text"} sx={{ mb: 1 }}>
          View all
        </Button>
        
      </CardActions>
    </JumboCard>
  );
};

export { PopularProducts };

PopularProducts.propTypes = {
  title: PropTypes.node.isRequired,
  subheader: PropTypes.node.isRequired,
}; 