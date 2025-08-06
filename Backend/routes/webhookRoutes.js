// routes/webhook.js (CORRECTED)
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Raw body parser is required for Stripe webhooks
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(' Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('🔔 Webhook received:', event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;

    console.log('👤 Processing order for userId:', userId);
    console.log('💰 Session data:', JSON.stringify(session, null, 2));

    try {
      // Find user's cart
      const cart = await Cart.findOne({ userId });
      if (!cart || cart.items.length === 0) {
        console.warn('⚠️ Cart empty or not found for user:', userId);
        return res.status(400).send('Cart not found');
      }

      console.log('🛒 Cart found with items:', cart.items.length);

      // Calculate total from cart items
      const calculatedTotal = cart.items.reduce((acc, item) => acc + item.salePrice * item.quantity, 0);

      // Create an order from the cart
      const order = new Order({
        userId,
        items: cart.items,
        totalAmount: calculatedTotal, // Fixed: was 'total', should be 'totalAmount'
        paymentIntentId: session.payment_intent,
        createdAt: new Date(),
      });
      
      const savedOrder = await order.save();
      console.log('✅ Order saved with ID:', savedOrder._id);

      // Clear the cart
      cart.items = [];
      await cart.save();
      console.log('🧹 Cart cleared for user:', userId);
    } catch (error) {
      console.error(' Error processing checkout session:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  res.status(200).json({ received: true });
});

module.exports = router;

