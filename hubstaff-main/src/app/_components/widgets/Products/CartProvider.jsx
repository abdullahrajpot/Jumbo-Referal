import { createContext, useContext, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { cartService } from "../../../../services/cartService";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.id || user._id;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  // Load cart from backend on component mount
  useEffect(() => {
    const loadCart = async () => {
      const userId = getCurrentUser();
      if (!userId) return;

      setLoading(true);
      try {
        const cartItems = await cartService.getCart(userId);
        setCart(cartItems);
        setError(null);
      } catch (error) {
        console.error('Error loading cart:', error);
        setError('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const addToCart = useCallback(async (product) => {
    const userId = getCurrentUser();
    if (!userId) {
      setError('User not logged in');
      return;
    }

    setLoading(true);
    try {
      const updatedCart = await cartService.addToCart(userId, product);
      setCart(updatedCart);
      setError(null);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    const userId = getCurrentUser();
    if (!userId) {
      setError('User not logged in');
      return;
    }

    setLoading(true);
    try {
      const updatedCart = await cartService.removeFromCart(userId, productId);
      setCart(updatedCart);
      setError(null);
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (productId, newQuantity) => {
    const userId = getCurrentUser();
    if (!userId) {
      setError('User not logged in');
      return;
    }

    setLoading(true);
    try {
      const updatedCart = await cartService.updateQuantity(userId, productId, newQuantity);
      setCart(updatedCart);
      setError(null);
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Failed to update quantity');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    const userId = getCurrentUser();
    if (!userId) {
      setError('User not logged in');
      return;
    }

    setLoading(true);
    try {
      const updatedCart = await cartService.clearCart(userId);
      setCart(updatedCart);
      setError(null);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.salePrice * item.quantity), 0);
  }, [cart]);

  const getCartItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const getCartItem = useCallback((productId) => {
    return cart.find(item => item.productId === productId);
  }, [cart]);

  // const checkout = useCallback(async () => {
  //   const userId = getCurrentUser();
  //   if (!userId) {
  //     setError('User not logged in');
  //     return;
  //   }
      

  //   const totalAmount = getCartTotal();
  //   if (totalAmount <= 0) {
  //     setError('Cart is empty');
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const result = await cartService.checkout(userId, totalAmount);
  //     setCart([]);
  //     setError(null);
  //     // You can show a success message here
  //     alert(`Order placed successfully! Total: $${totalAmount.toFixed(2)}`);
  //     return result;
  //   } catch (error) {
  //     console.error('Error during checkout:', error);
  //     if (error.response?.data?.error === 'Insufficient balance') {
  //       setError('Insufficient balance in wallet');
  //     } else {
  //       setError('Failed to process checkout');
  //     }
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [cart, getCartTotal]);

  const checkoutWithStripe = useCallback(async () => {
    const userId = getCurrentUser();
    if (!userId) {
        setError('User not logged in');
        return;
    }
    
    if (cart.length === 0) {
        setError('Cart is empty');
        return;
    }
    
    setLoading(true);
    try {
        const stripeUrl = await cartService.checkoutWithStripe(cart, userId);
        window.location.href = stripeUrl; // Redirect to Stripe Checkout
    } catch (error) {
        console.error('Stripe checkout error:', error);
        setError('Failed to redirect to Stripe');
    } finally {
        setLoading(false);
    }
}, [cart]);

  const value = {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getCartItem,
    // checkout,
    checkoutWithStripe,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
}; 