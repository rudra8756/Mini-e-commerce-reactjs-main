const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Product image map with multiple images for each product
const productImagesMap = {
  // Smartphones - Multiple images
  "iPhone 15 Pro": {
    thumbnail: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580910051074-3eb6948865a9?w=600&h=600&fit=crop"
    ],
    highlights: ["A17 Pro Chip", "48MP Camera", "Titanium Design", "5x Optical Zoom"],
    description: "The iPhone 15 Pro features a titanium design, A17 Pro chip, and a 48MP camera system with 5x optical zoom. Experience the ultimate smartphone technology."
  },
  "Samsung Galaxy S24 Ultra": {
    thumbnail: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop"
    ],
    highlights: ["Snapdragon 8 Gen 3", "200MP Camera", "S Pen", "Titanium Frame"],
    description: "Samsung Galaxy S24 Ultra with 200MP camera, S Pen, and titanium frame. The ultimate Android experience."
  },
  "iPhone 15": {
    thumbnail: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580910051074-3eb6948865a9?w=600&h=600&fit=crop"
    ],
    highlights: ["A16 Bionic", "48MP Camera", "Dynamic Island", "USB-C"],
    description: "iPhone 15 brings Dynamic Island, a 48MP camera, and USB-C charging."
  },
  // Laptops
  "MacBook Air M3": {
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop"
    ],
    highlights: ["M3 Chip", "15.3 inch Display", "Silent Design", "All-day Battery"],
    description: "MacBook Air M3 - Super fast, super light. The M3 chip delivers exceptional performance."
  },
  "MacBook Pro 14": {
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop"
    ],
    highlights: ["M3 Pro/Max Chip", "Liquid Retina XDR", "ProMotion 120Hz", "MagSafe 3"],
    description: "MacBook Pro 14 with M3 Pro or M3 Max chip for unprecedented performance."
  },
  // Men's Shoes
  "Nike Air Max": {
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop"
    ],
    highlights: ["Air Max Unit", "Breathable Mesh", "Rubber Outsole", "Lightweight"],
    description: "Nike Air Max with visible Air cushioning for all-day comfort."
  },
  "Adidas Ultraboost": {
    thumbnail: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&h=600&fit=crop"
    ],
    highlights: ["Boost Midsole", "Primeknit Upper", "Continental Rubber", "Torsion System"],
    description: "Adidas Ultraboost - Incredible energy return with every step."
  },
  // Watches
  "Apple Watch Series 9": {
    thumbnail: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop"
    ],
    highlights: ["S9 Chip", "Always-On Retina", "GPS + Cellular", "Water Resistant"],
    description: "Apple Watch Series 9 - The ultimate device for a healthy life."
  },
  "Titan Smart Watch": {
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop"
    ],
    highlights: ["1.2 inch Display", "7 Days Battery", "Health Tracking", "5ATM Water Resistant"],
    description: "Titan Smart Watch with premium design and advanced health features."
  },
  // TVs
  "LG OLED 55 inch": {
    thumbnail: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1523441298448-8db5ef11f7bb?w=600&h=600&fit=crop"
    ],
    highlights: ["OLED Display", "4K Ultra HD", "Dolby Vision IQ", "webOS 23"],
    description: "LG OLED 55 inch TV with self-lit pixels for perfect blacks."
  },
  // Electronics
  "Sony WH-1000XM5": {
    thumbnail: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"
    ],
    highlights: ["Industry Leading ANC", "30 Hour Battery", "Hi-Res Audio", "Multipoint Connection"],
    description: "Sony WH-1000XM5 - The best noise cancelling headphones."
  },
  "Sony PlayStation 5": {
    thumbnail: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&h=600&fit=crop"
    ],
    highlights: ["4K Gaming", "120 FPS", "Ray Tracing", "Tempest 3D AudioTech"],
    description: "PlayStation 5 - Experience lightning-fast loading and deeper immersion."
  },
  // Groceries
  "Organic Bananas 1kg": {
    thumbnail: "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=600&h=600&fit=crop"
    ],
    highlights: ["Organic Certified", "Fresh & Natural", "Rich in Potassium", "Daily Nutrition"],
    description: "Fresh organic bananas, perfect for daily consumption."
  },
  "Apple 1kg": {
    thumbnail: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&h=600&fit=crop"
    ],
    highlights: ["Fresh Apples", "Rich in Fiber", "Natural Sweetness", "Imported Quality"],
    description: "Premium quality apples, crisp and sweet."
  },
  // Snacks
  "Parle-G (Multiple)": {
    thumbnail: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=600&fit=crop"
    ],
    highlights: ["India's Favorite Biscuit", "Parle-G", "Pack of Multiple", "Sweet & Crunchy"],
    description: "Parle-G biscuits - The perfect tea-time snack."
  },
  // Personal Care
  "Dove Soap (4 pcs)": {
    thumbnail: "https://images.unsplash.com/photo-1556228578-0d85b1a4d573?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d573?w=600&h=600&fit=crop"
    ],
    highlights: ["Moisturizing Cream", "Gentle on Skin", "Pack of 4", "pH Balanced"],
    description: "Dove soap with moisturizing cream for soft, smooth skin."
  },
  "Shampoo 400ml": {
    thumbnail: "https://images.unsplash.com/photo-1585232569525-f087bd9dae8e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1585232569525-f087bd9dae8e?w=600&h=600&fit=crop"
    ],
    highlights: ["Hair Fall Control", "400ml Bottle", "For All Hair Types", "Natural Ingredients"],
    description: "Anti-hair fall shampoo for stronger, healthier hair."
  },
  // Furniture
  "Sofa Set 3+2": {
    thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&h=600&fit=crop"
    ],
    highlights: ["3+2 Seater", "Premium Fabric", "Wooden Legs", "Comfortable Cushions"],
    description: "Elegant 3+2 sofa set perfect for your living room."
  },
  "Dining Table 6 Seater": {
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop"
    ],
    highlights: ["6 Seater Capacity", "Modern Design", "Wooden Top", "Sturdy Base"],
    description: "Beautiful dining table for family gatherings."
  },
  // Books
  "Novel Bestseller": {
    thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop"
    ],
    highlights: ["Bestselling Novel", "Engaging Story", "Hardcover", "Page Turner"],
    description: "A captivating novel that keeps you hooked till the end."
  },
  // Fitness
  "Yoga Mat": {
    thumbnail: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop"
    ],
    highlights: ["Non-Slip Surface", "6mm Thickness", "Eco-Friendly", "Easy to Clean"],
    description: "Premium yoga mat for your daily practice."
  },
  "Dumbbells Set": {
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop"
    ],
    highlights: ["Adjustable Weights", "20kg Set", "Rubber Coated", "Anti-Slip"],
    description: "Complete dumbbells set for home workout."
  },
  // Baby Products
  "Diapers (Pack of 30)": {
    thumbnail: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=600&fit=crop"
    ],
    highlights: ["Pack of 30", "Super Absorbent", "Comfort Fit", "Leak Protection"],
    description: "Soft and comfortable diapers for your baby."
  },
  // Toys
  "Remote Control Car": {
    thumbnail: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&h=600&fit=crop"
    ],
    highlights: ["Remote Controlled", "Rechargeable Battery", "High Speed", "LED Lights"],
    description: "Exciting RC car for kids with LED lights."
  }
};

// Sample products data with realistic prices
const sampleProductsData = [
  // Smartphones
  { title: "iPhone 15 Pro", category: "smartphones", basePrice: 120000 },
  { title: "iPhone 15", category: "smartphones", basePrice: 80000 },
  { title: "Samsung Galaxy S24 Ultra", category: "smartphones", basePrice: 100000 },
  { title: "Samsung Galaxy S24", category: "smartphones", basePrice: 55000 },
  { title: "OnePlus Nord 3", category: "smartphones", basePrice: 25000 },
  { title: "OnePlus 12", category: "smartphones", basePrice: 55000 },
  { title: "Redmi Note 13 Pro", category: "smartphones", basePrice: 18000 },
  { title: "Realme GT 5", category: "smartphones", basePrice: 25000 },
  { title: "Vivo V30", category: "smartphones", basePrice: 28000 },
  { title: "OPPO Reno 11", category: "smartphones", basePrice: 30000 },
  
  // Laptops
  { title: "MacBook Air M3", category: "laptops", basePrice: 115000 },
  { title: "MacBook Pro 14", category: "laptops", basePrice: 180000 },
  { title: "Dell XPS 15", category: "laptops", basePrice: 140000 },
  { title: "HP Pavilion Plus", category: "laptops", basePrice: 75000 },
  { title: "Lenovo ThinkPad X1", category: "laptops", basePrice: 120000 },
  { title: "ASUS ROG Strix", category: "laptops", basePrice: 150000 },
  { title: "Acer Aspire 5", category: "laptops", basePrice: 45000 },
  
  // TVs
  { title: "LG OLED 55 inch", category: "tv", basePrice: 80000 },
  { title: "Samsung QLED 55 inch", category: "tv", basePrice: 65000 },
  { title: "Sony Bravia 55 inch", category: "tv", basePrice: 75000 },
  { title: "OnePlus TV 55 inch", category: "tv", basePrice: 35000 },
  { title: "Xiaomi TV 50 inch", category: "tv", basePrice: 28000 },
  
  // Men's Shoes
  { title: "Nike Air Max", category: "mens shoes", basePrice: 8000 },
  { title: "Adidas Ultraboost", category: "mens shoes", basePrice: 12000 },
  { title: "Puma RS-X", category: "mens shoes", basePrice: 6000 },
  { title: "Nike Jordan 1", category: "mens shoes", basePrice: 10000 },
  { title: "Sparx Running Shoes", category: "mens shoes", basePrice: 1500 },
  
  // Women's Shoes
  { title: "Nike Air Force 1", category: "womens shoes", basePrice: 7000 },
  { title: "Adidas Stan Smith", category: "womens shoes", basePrice: 6000 },
  { title: "Heels Party Wear", category: "womens shoes", basePrice: 1500 },
  
  // Watches
  { title: "Titan Smart Watch", category: "watches", basePrice: 3000 },
  { title: "Apple Watch Series 9", category: "watches", basePrice: 35000 },
  { title: "Samsung Galaxy Watch", category: "watches", basePrice: 15000 },
  { title: "Noise Smart Watch", category: "watches", basePrice: 2500 },
  
  // Electronics
  { title: "Sony WH-1000XM5", category: "electronics", basePrice: 25000 },
  { title: "Bose QuietComfort", category: "electronics", basePrice: 22000 },
  { title: "Sony PlayStation 5", category: "electronics", basePrice: 50000 },
  { title: "Nintendo Switch", category: "electronics", basePrice: 25000 },
  
  // Groceries
  { title: "Organic Bananas 1kg", category: "fruits", basePrice: 60 },
  { title: "Apple 1kg", category: "fruits", basePrice: 150 },
  { title: "Mangoes 1kg", category: "fruits", basePrice: 120 },
  { title: "Grapes 500g", category: "fruits", basePrice: 100 },
  
  // Daily Essentials
  { title: "Aata (Wheat Flour) 10kg", category: "groceries", basePrice: 350 },
  { title: "Rice (Basmati) 5kg", category: "groceries", basePrice: 400 },
  { title: "Daal (Lentils) 1kg", category: "groceries", basePrice: 100 },
  { title: "Cooking Oil 1L", category: "groceries", basePrice: 150 },
  { title: "Tea 250g", category: "beverages", basePrice: 150 },
  
  // Snacks
  { title: "Parle-G (Multiple)", category: "snacks", basePrice: 10 },
  { title: "Lays Chips", category: "snacks", basePrice: 20 },
  { title: "Maggi Noodles (Pack)", category: "snacks", basePrice: 15 },
  { title: "Chocolate (Bar)", category: "snacks", basePrice: 50 },
  
  // Personal Care
  { title: "Dove Soap (4 pcs)", category: "personal care", basePrice: 100 },
  { title: "Shampoo 400ml", category: "personal care", basePrice: 180 },
  { title: "Toothpaste", category: "personal care", basePrice: 80 },
  { title: "Face Cream", category: "beauty", basePrice: 250 },
  
  // Furniture
  { title: "Dining Table 6 Seater", category: "furniture", basePrice: 15000 },
  { title: "Sofa Set 3+2", category: "furniture", basePrice: 35000 },
  { title: "Office Chair", category: "furniture", basePrice: 5000 },
  { title: "Bed King Size", category: "furniture", basePrice: 25000 },
  
  // Books
  { title: "Novel Bestseller", category: "books", basePrice: 350 },
  { title: "Programming Guide", category: "books", basePrice: 500 },
  
  // Fitness
  { title: "Yoga Mat", category: "fitness equipment", basePrice: 500 },
  { title: "Dumbbells Set", category: "fitness equipment", basePrice: 1500 },
  { title: "Treadmill", category: "fitness equipment", basePrice: 35000 },
  
  // Toys
  { title: "Remote Control Car", category: "toys", basePrice: 1500 },
  { title: "Action Figure", category: "toys", basePrice: 500 },
  { title: "Board Game", category: "toys", basePrice: 400 },
  
  // Baby Products
  { title: "Diapers (Pack of 30)", category: "baby products", basePrice: 400 },
  { title: "Baby Powder", category: "baby products", basePrice: 150 },
  { title: "Baby Soap", category: "baby products", basePrice: 80 },
  
  // Dry Fruits
  { title: "Almonds 500g", category: "dry food", basePrice: 400 },
  { title: "Cashews 500g", category: "dry food", basePrice: 500 },
  { title: "Raisins 500g", category: "dry food", basePrice: 200 }
];

// Generate fallback image
const getFallbackImage = (title) => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const id = Math.abs(hash % 1000);
  return `https://picsum.photos/seed/${id}/400/400`;
};

// Get product images
const getProductImages = (title) => {
  // Check if exact title exists in map
  if (productImagesMap[title]) {
    return productImagesMap[title];
  }
  
  // Try partial match
  for (const key of Object.keys(productImagesMap)) {
    if (title.toLowerCase().includes(key.toLowerCase())) {
      return productImagesMap[key];
    }
  }
  
  // Return fallback
  const fallback = getFallbackImage(title);
  return {
    thumbnail: fallback,
    images: [fallback],
    highlights: ["Premium Quality", "Best Value", "Free Delivery"],
    description: `High quality ${title}. Order now at best price.`
  };
};

// Generate products
const generateProducts = () => {
  let products = [];
  
  for (const product of sampleProductsData) {
    const productData = getProductImages(product.title);
    const priceVariation = product.basePrice;
    const discountPercentage = Math.floor(Math.random() * 30) + 5;
    const discountedPrice = Math.floor(priceVariation * (1 - discountPercentage / 100));
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
    
    // Generate random reviews
    const reviews = [];
    const reviewCount = Math.floor(Math.random() * 50) + 5;
    const reviewNames = ["Rajesh", "Priya", "Amit", "Sunita", "Vijay", "Anita", "Raj", "Meera", "Kiran", "Pooja"];
    const reviewComments = [
      "Great product! Very happy with the quality.",
      "Good value for money. Fast delivery.",
      "Excellent! Exceeded my expectations.",
      "Decent product. Recommended.",
      "Good quality. Will buy again.",
      "Nice product. Good packaging.",
      "Pretty good. Worth the price.",
      "Satisfied with the purchase.",
      "Good product. Works as described.",
      "Nice! Better than expected."
    ];
    
    for (let i = 0; i < Math.min(reviewCount, 5); i++) {
      reviews.push({
        userName: reviewNames[Math.floor(Math.random() * reviewNames.length)],
        rating: Math.floor(Math.random() * 2) + 4,
        comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }
    
    products.push({
      title: product.title,
      price: priceVariation,
      discountedPrice: discountedPrice,
      discountPercentage: discountPercentage,
      category: product.category,
      brand: product.title.split(' ')[0],
      rating: parseFloat(rating),
      reviewCount: reviewCount,
      thumbnail: productData.thumbnail,
      images: productData.images,
      description: productData.description,
      highlights: productData.highlights,
      stock: Math.floor(Math.random() * 100) + 10,
      freeDelivery: priceVariation > 500,
      deliveryTime: "3-5 days",
      bankOffers: [
        "10% off on HDFC Bank Cards",
        "5% cashback on Paytm"
      ],
      exchangeOffer: "Up to ₹5000 exchange bonus"
    });
  }
  
  return products;
};

const seedData = async () => {
  try {
    await Product.deleteMany({});
    console.log("Cleared existing products");
    
    const products = generateProducts();
    await Product.insertMany(products);
    console.log("Products Seeded Successfully!");
    console.log(`Total products: ${products.length}`);
    
    process.exit();
  } catch (error) {
    console.log("Error seeding products:", error);
    process.exit(1);
  }
};

seedData();
