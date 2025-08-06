# Products Widget

This widget provides a complete e-commerce solution with product display and cart functionality.

## Components

### PopularProducts
The main product display component that shows a list of products with add to cart functionality.

**Props:**
- `title` (node, required): The title of the products section
- `subheader` (node, required): The subtitle/description

### Cart
A standalone cart component that displays cart items with quantity controls.

**Props:**
- `cartItems` (array, required): Array of cart items
- `onUpdateQuantity` (function, required): Function to update item quantity
- `onRemoveFromCart` (function, required): Function to remove item from cart
- `onClearCart` (function, required): Function to clear all items from cart
- `onCheckout` (function, required): Function to handle checkout

### CartWidget
A wrapper component that uses the Cart component with cart context.

### CartProvider
A React Context provider that manages cart state globally.

**Context Methods:**
- `addToCart(product)`: Add a product to cart
- `removeFromCart(productId)`: Remove a product from cart
- `updateQuantity(productId, quantity)`: Update product quantity
- `clearCart()`: Clear all items from cart
- `getCartTotal()`: Get total cart value
- `getCartItemCount()`: Get total number of items in cart
- `getCartItem(productId)`: Get a specific cart item
- `checkout()`: Handle checkout process

## Usage

### Basic Usage
```jsx
import { CartProvider, PopularProducts, CartWidget } from '@app/_components/widgets/Products';

function App() {
  return (
    <CartProvider>
      <div>
        <PopularProducts 
          title="Popular Products" 
          subheader="Discover our most popular items" 
        />
        <CartWidget />
      </div>
    </CartProvider>
  );
}
```

### Advanced Usage
```jsx
import { CartProvider, PopularProducts, Cart } from '@app/_components/widgets/Products';
import { useCart } from '@app/_components/widgets/Products/CartProvider';

function CustomCart() {
  const { cart, updateQuantity, removeFromCart, clearCart, checkout } = useCart();
  
  return (
    <Cart
      cartItems={cart}
      onUpdateQuantity={updateQuantity}
      onRemoveFromCart={removeFromCart}
      onClearCart={clearCart}
      onCheckout={checkout}
    />
  );
}

function App() {
  return (
    <CartProvider>
      <PopularProducts 
        title="Products" 
        subheader="Shop our collection" 
      />
      <CustomCart />
    </CartProvider>
  );
}
```

## Features

- ✅ Add products to cart
- ✅ Remove products from cart
- ✅ Update product quantities
- ✅ Clear entire cart
- ✅ Real-time cart total calculation
- ✅ Responsive design
- ✅ Material-UI components
- ✅ PropTypes validation
- ✅ React Context for state management

## File Structure

```
Products/
├── components/
│   ├── Product.jsx          # Individual product component
│   └── index.js
├── data/
│   └── index.js             # Product data and menu items
├── demo/
│   ├── ProductsDemo.jsx     # Demo page
│   └── index.js
├── Cart.jsx                 # Cart component
├── CartProvider.jsx         # Cart context provider
├── CartWidget.jsx           # Cart widget wrapper
├── PopularProducts.jsx      # Main products component
├── index.js                 # Main exports
└── README.md               # This file
```

## Data Structure

### Product Object
```javascript
{
  id: number,
  name: string,
  thumb: string,
  description: string,
  price: number,
  salePrice: number
}
```

### Cart Item Object
```javascript
{
  id: number,
  name: string,
  thumb: string,
  description: string,
  price: number,
  salePrice: number,
  quantity: number
}
``` 