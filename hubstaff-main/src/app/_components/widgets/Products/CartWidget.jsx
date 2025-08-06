import { Cart } from "./Cart";
import { useCart } from "./CartProvider";

const CartWidget = () => {
  const { 
    cart, 
    loading,
    error,
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    checkout ,
    checkoutWithStripe,

  } = useCart();

  return (
    <Cart
      cartItems={cart}
      onUpdateQuantity={updateQuantity}
      onRemoveFromCart={removeFromCart}
      checkoutWithStripe={checkoutWithStripe} 
      onClearCart={clearCart}
      onCheckout={checkout}
      loading={loading}
      error={error}
    />
  );
};

export { CartWidget }; 