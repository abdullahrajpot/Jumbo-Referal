const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const User = require('../models/User');

// Get user's cart
router.get('/cart/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.json({ items: [] });
    }
    res.json({ items: cart.items });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart
router.post('/cart/:userId/add', async (req, res) => {
  try {
    const { product } = req.body;
    const userId = req.params.userId;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      // Create new cart if it doesn't exist
      cart = new Cart({
        userId,
        items: [{
          productId: product.id,
          name: product.name,
          thumb: product.thumb,
          description: product.description,
          price: product.price,
          salePrice: product.salePrice,
          quantity: 1
        }]
      });
    } else {
      // Check if product already exists in cart
      const existingItemIndex = cart.items.findIndex(item => item.productId === product.id);
      
      if (existingItemIndex > -1) {
        // Update quantity if product exists
        cart.items[existingItemIndex].quantity += 1;
      } else {
        // Add new item if product doesn't exist
        cart.items.push({
          productId: product.id,
          name: product.name,
          thumb: product.thumb,
          description: product.description,
          price: product.price,
          salePrice: product.salePrice,
          quantity: 1
        });
      }
    }

    await cart.save();
    res.json({ success: true, cart: cart.items });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update item quantity in cart
router.put('/cart/:userId/update', async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    return res.status(400).json({ error: 'Missing productId or quantity' });
  }

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.find(
      (i) => i.productId.toString() === productId.toString()
    );

    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    item.quantity = quantity;
    await cart.save();

    res.json({ cart: cart.items });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ error: 'Failed to update item quantity' });
  }
});


// Remove item from cart
router.delete('/cart/:userId/remove/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId !== parseInt(productId));
    await cart.save();

    res.json({ success: true, cart: cart.items });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear entire cart
router.delete('/cart/:userId/clear', async (req, res) => {
  try {
    const userId = req.params.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({ success: true, cart: cart.items });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Checkout - process order and clear cart
router.post('/cart/:userId/checkout', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { totalAmount } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has enough balance
    if (user.wallet < totalAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Deduct amount from user's wallet
    user.wallet -= totalAmount;
    await user.save();

    // Here you would typically create an order record
    // For now, we'll just clear the cart
    cart.items = [];
    await cart.save();

    res.json({ 
      success: true, 
      message: 'Order placed successfully',
      remainingBalance: user.wallet,
      orderTotal: totalAmount
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to process checkout' });
  }
});

module.exports = router;