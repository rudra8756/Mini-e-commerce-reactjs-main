# TODO: Deploy Backend to Vercel API Routes

## Progress Tracker
- [x] Create Vercel API routes directory structure
- [x] Create /api/products route
- [x] Create /api/auth route (register, login)
- [x] Create /api/cart route
- [x] Create /api/orders route
- [x] Create /api/wishlist route
- [x] Create /api/payment route
- [x] Update MongoDB connection for serverless
- [x] Update src/api.js to use relative paths
- [x] Add backend dependencies to package.json
- [x] Create .env.example file

## Next Steps
1. Deploy to Vercel
2. Set the following environment variables in Vercel:
   - MONGO_URI: Your MongoDB connection string
   - JWT_SECRET: Your JWT secret key
   - STRIPE_SECRET_KEY: Your Stripe secret key (optional)
3. Seed products in the MongoDB database
4. Test the deployment
