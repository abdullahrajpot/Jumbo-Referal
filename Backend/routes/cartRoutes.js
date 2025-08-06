const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const User = require('../models/User');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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

    // Fixed: Handle both string and number productIds
    cart.items = cart.items.filter(item => 
      item.productId.toString() !== productId.toString()
    );
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



// Stripe Checkout - FIXED: Move the validation inside the try block
router.post('/create-checkout-session', async (req, res) => {
  const { cartItems, userId } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: 'No items in cart' });
  }

  // Create line items for Stripe
  const lineItems = cartItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        // images: [item.thumb],
        description: item.description,
      },
      unit_amount: item.salePrice * 100, // Stripe expects amount in cents
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:5174/products',
      cancel_url: 'http://localhost:3000/cancel',
      metadata: {
        userId: userId, 
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe session creation failed:', error.message);
    console.error(error.stack);
    res.status(500).json({ error: error.message });
  }
  
});


module.exports = router;