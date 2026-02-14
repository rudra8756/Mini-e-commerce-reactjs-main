# TODO - Product Display Enhancement

## Phase 1: Update Seed Data
- [ ] **server/seedProducts.js**: Update to populate multiple images for each product (generate 4-5 images per product using variations of the thumbnail URL)

## Phase 2: Create Product Detail Page
- [ ] **src/pages/ProductDetail.jsx**: Create new page with:
  - Image carousel/gallery with thumbnail navigation (Flipkart-style)
  - Main image display with click-to-zoom or view gallery
  - Price display with discount percentage and original price strikethrough
  - Product title, description, brand, category
  - Rating display
  - Add to cart / Remove from cart functionality

## Phase 3: Update Navigation
- [ ] **src/main.jsx**: Add route for `/product/:id`
- [ ] **src/pages/Home.jsx**: Make product cards clickable to navigate to Product Detail
- [ ] **src/pages/Product.jsx**: Make product cards clickable to navigate to Product Detail

## Phase 4: Test
- [ ] Run seed script to populate multiple images
- [ ] Test the new Product Detail page
- [ ] Verify navigation between pages
