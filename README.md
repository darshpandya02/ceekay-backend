/*
# E-commerce Backend API

A complete backend service for an e-commerce mobile application built with Node.js, Express, and MongoDB.

## Features

- User authentication (JWT-based)
- Product management
- Shopping cart functionality
- Order management
- User profiles and addresses
- Wishlist functionality
- Password reset
- Product search and filtering
- Admin panel capabilities

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ceekay-db
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=http://localhost:3000
   ```

4. Start MongoDB service on your machine

5. Seed the database with sample data:

   ```bash
   node utils/seedDatabase.js
   ```

6. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- POST /api/auth/signup - Register a new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user
- GET /api/auth/verify - Verify token
- POST /api/auth/forgot-password - Request password reset
- POST /api/auth/reset-password - Reset password

### Products

- GET /api/products - Get all products
- GET /api/products/promoted - Get promoted products
- GET /api/products/search - Search products
- GET /api/products/category/:category - Get products by category
- GET /api/products/:id - Get product by ID

### Cart (Protected)

- GET /api/cart - Get user's cart
- POST /api/cart/add - Add item to cart
- PUT /api/cart/update - Update cart item quantity
- DELETE /api/cart/remove - Remove item from cart
- DELETE /api/cart/clear - Clear cart

### Orders (Protected)

- GET /api/orders - Get user's orders
- GET /api/orders/:id - Get order by ID
- POST /api/orders - Place new order
- PUT /api/orders/:id/cancel - Cancel order

### User (Protected)

- GET /api/user/profile - Get user profile
- PUT /api/user/profile - Update user profile
- GET /api/user/addresses - Get user addresses
- POST /api/user/addresses - Add new address
- PUT /api/user/addresses/:id - Update address
- DELETE /api/user/addresses/:id - Delete address
- GET /api/user/wishlist - Get user wishlist
- POST /api/user/wishlist/add - Add to wishlist
- DELETE /api/user/wishlist/remove - Remove from wishlist

## Database Models

### User

- name, email, password, phone, companyName
- addresses array
- wishlist array
- role (user/admin)

### Product

- name, description, price, originalPrice
- category, subcategory, brand
- images array, stock, sku
- isActive, isPromoted
- reviews and ratings

### Cart

- user reference
- items array with product references and quantities
- totalAmount

### Order

- user reference
- orderNumber (auto-generated)
- items array with product details
- totalAmount, status, paymentStatus
- shippingAddress, paymentMethod
- tracking information

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Input validation
- Error handling middleware

## Testing

Run tests with:

```bash
npm test
```

## Deployment

The application is ready for deployment on platforms like:

- Heroku
- AWS
- Digital Ocean
- Vercel

Make sure to set environment variables in your deployment platform.

## License

MIT License
*/
