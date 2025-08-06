# Backend Integration Setup

## 1. Add Cart Routes to Your Backend Server

Add this to your main server file (e.g., `server.js` or `app.js`):

```javascript
const cartRoutes = require('./src/routes/cartRoutes');

// Add this line with your other route middleware
app.use('/api', cartRoutes);
```

## 2. Ensure User Model Exists

Make sure you have a User model with wallet field:

```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  wallet: { type: Number, default: 0 },
  totalDeposits: { type: Number, default: 0 },
  // ... other fields
});

module.exports = mongoose.model('User', userSchema);
```

## 3. API Endpoints Available

### Cart Operations:
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/:userId/add` - Add item to cart
- `PUT /api/cart/:userId/update` - Update item quantity
- `DELETE /api/cart/:userId/remove/:productId` - Remove item from cart
- `DELETE /api/cart/:userId/clear` - Clear entire cart
- `POST /api/cart/:userId/checkout` - Process checkout

## 4. Features Implemented

✅ **User Authentication Required** - Only logged-in users can use cart
✅ **Persistent Cart Storage** - Cart saved to database
✅ **Wallet Integration** - Checkout deducts from user's wallet
✅ **Error Handling** - Proper error messages for all operations
✅ **Loading States** - UI shows loading during operations
✅ **Real-time Updates** - Cart updates immediately after operations

## 5. How It Works

1. **User Login**: Cart loads from database
2. **Add to Cart**: Item saved to database
3. **Update Quantity**: Database updated in real-time
4. **Checkout**: 
   - Validates user has sufficient balance
   - Deducts amount from wallet
   - Clears cart
   - Shows success/error message

## 6. Security Features

- User authentication required for all cart operations
- Balance validation before checkout
- Proper error handling and validation
- Database transactions for data integrity 