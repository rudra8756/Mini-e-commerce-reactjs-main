const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Realistic categories with price ranges (in INR)
const categoryPriceRanges = {
  // Groceries - Very cheap
  "groceries": { min: 20, max: 500 },
  "fruits": { min: 30, max: 200 },
  "vegetables": { min: 20, max: 150 },
  "snacks": { min: 10, max: 200 },
  "beverages": { min: 20, max: 300 },
  "dry food": { min: 30, max: 400 },
  "spices": { min: 20, max: 250 },
  
  // Personal Care - Cheap to Mid
  "personal care": { min: 30, max: 500 },
  "beauty": { min: 50, max: 1000 },
  "health supplements": { min: 100, max: 2000 },
  
  // Home & Kitchen - Mid range
  "home appliances": { min: 500, max: 15000 },
  "kitchen appliances": { min: 300, max: 8000 },
  "furniture": { min: 1000, max: 50000 },
  
  // Electronics - Expensive
  "smartphones": { min: 5000, max: 150000 },
  "laptops": { min: 25000, max: 200000 },
  "electronics": { min: 500, max: 50000 },
  "tv": { min: 10000, max: 150000 },
  "cameras": { min: 20000, max: 200000 },
  "watches": { min: 500, max: 50000 },
  
  // Shoes - Mid range
  "mens shoes": { min: 500, max: 5000 },
  "womens shoes": { min: 500, max: 5000 },
  
  // Other categories
  "books": { min: 100, max: 1000 },
  "toys": { min: 100, max: 3000 },
  "pet supplies": { min: 100, max: 2000 },
  "fitness equipment": { min: 500, max: 15000 },
  "outdoor gear": { min: 500, max: 10000 },
  "baby products": { min: 200, max: 5000 },
  "stationery": { min: 20, max: 500 },
  "office supplies": { min: 100, max: 3000 },
  "gardening tools": { min: 100, max: 3000 },
  "automotive accessories": { min: 200, max: 5000 },
  "musical instruments": { min: 1000, max: 50000 },
  "kitchen": { min: 100, max: 3000 }
};

// Sample products with realistic prices (title, category, base price)
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
  { title: "MSI Modern 15", category: "laptops", basePrice: 55000 },
  
  // TVs
  { title: "LG OLED 55 inch", category: "tv", basePrice: 80000 },
  { title: "Samsung QLED 55 inch", category: "tv", basePrice: 65000 },
  { title: "Sony Bravia 55 inch", category: "tv", basePrice: 75000 },
  { title: "OnePlus TV 55 inch", category: "tv", basePrice: 35000 },
  { title: "Xiaomi TV 50 inch", category: "tv", basePrice: 28000 },
  { title: "TCL TV 55 inch", category: "tv", basePrice: 32000 },
  
  // Men's Shoes
  { title: "Nike Air Max", category: "mens shoes", basePrice: 8000 },
  { title: "Adidas Ultraboost", category: "mens shoes", basePrice: 12000 },
  { title: "Puma RS-X", category: "mens shoes", basePrice: 6000 },
  { title: "Reebok Classic", category: "mens shoes", basePrice: 4000 },
  { title: "Nike Jordan 1", category: "mens shoes", basePrice: 10000 },
  { title: "Sparx Running Shoes", category: "mens shoes", basePrice: 1500 },
  { title: "Bata Formal Shoes", category: "mens shoes", basePrice: 2000 },
  { title: "Liberty Casual Shoes", category: "mens shoes", basePrice: 1800 },
  
  // Women's Shoes
  { title: "Nike Air Force 1", category: "womens shoes", basePrice: 7000 },
  { title: "Adidas Stan Smith", category: "womens shoes", basePrice: 6000 },
  { title: "Puma Suede", category: "womens shoes", basePrice: 4000 },
  { title: "Heels Party Wear", category: "womens shoes", basePrice: 1500 },
  { title: "Sandal Daily Wear", category: "womens shoes", basePrice: 800 },
  { title: "Bata Flats", category: "womens shoes", basePrice: 1200 },
  
  // Watches
  { title: "Titan Smart Watch", category: "watches", basePrice: 3000 },
  { title: "Fastrack Smart Watch", category: "watches", basePrice: 2000 },
  { title: "Apple Watch Series 9", category: "watches", basePrice: 35000 },
  { title: "Samsung Galaxy Watch", category: "watches", basePrice: 15000 },
  { title: "Noise Smart Watch", category: "watches", basePrice: 2500 },
  { title: "Rolex Submariner", category: "watches", basePrice: 500000 },
  { title: "Casio G-Shock", category: "watches", basePrice: 8000 },
  
  // Electronics
  { title: "Sony WH-1000XM5", category: "electronics", basePrice: 25000 },
  { title: "Bose QuietComfort", category: "electronics", basePrice: 22000 },
  { title: "JBL Flip 6", category: "electronics", basePrice: 5000 },
  { title: "Sony PlayStation 5", category: "electronics", basePrice: 50000 },
  { title: "Nintendo Switch", category: "electronics", basePrice: 25000 },
  { title: "Canon EOS R6", category: "cameras", basePrice: 150000 },
  { title: "Nikon Z50", category: "cameras", basePrice: 85000 },
  { title: "GoPro Hero 12", category: "cameras", basePrice: 35000 },
  
  // Home Appliances
  { title: "LG Refrigerator 300L", category: "home appliances", basePrice: 35000 },
  { title: "Samsung Refrigerator 250L", category: "home appliances", basePrice: 28000 },
  { title: "Whirlpool Washing Machine", category: "home appliances", basePrice: 20000 },
  { title: "LG AC 1.5 Ton", category: "home appliances", basePrice: 35000 },
  { title: "Samsung AC 1.5 Ton", category: "home appliances", basePrice: 32000 },
  { title: "Microwave Oven", category: "kitchen appliances", basePrice: 8000 },
  { title: "Mixer Grinder", category: "kitchen appliances", basePrice: 2500 },
  { title: "Electric Kettle", category: "kitchen appliances", basePrice: 800 },
  { title: "Induction Cooktop", category: "kitchen appliances", basePrice: 2500 },
  { title: "Pressure Cooker", category: "kitchen appliances", basePrice: 1000 },
  { title: "Air Fryer", category: "kitchen appliances", basePrice: 5000 },
  
  // Groceries - Fruits
  { title: "Organic Bananas 1kg", category: "fruits", basePrice: 60 },
  { title: "Apple 1kg", category: "fruits", basePrice: 150 },
  { title: "Orange 1kg", category: "fruits", basePrice: 80 },
  { title: "Mangoes 1kg", category: "fruits", basePrice: 120 },
  { title: "Grapes 500g", category: "fruits", basePrice: 100 },
  { title: "Papaya 1kg", category: "fruits", basePrice: 50 },
  { title: "Watermelon 1kg", category: "fruits", basePrice: 30 },
  { title: "Pomegranate 1kg", category: "fruits", basePrice: 180 },
  
  // Vegetables
  { title: "Potatoes 1kg", category: "vegetables", basePrice: 30 },
  { title: "Onions 1kg", category: "vegetables", basePrice: 35 },
  { title: "Tomatoes 1kg", category: "vegetables", basePrice: 40 },
  { title: "Carrots 500g", category: "vegetables", basePrice: 40 },
  { title: "Spinach 250g", category: "vegetables", basePrice: 20 },
  { title: "Cucumber 500g", category: "vegetables", basePrice: 25 },
  { title: "Green Chillies 100g", category: "vegetables", basePrice: 30 },
  { title: "Ginger 100g", category: "vegetables", basePrice: 40 },
  
  // Daily Essentials
  { title: "Aata (Wheat Flour) 10kg", category: "groceries", basePrice: 350 },
  { title: "Rice (Basmati) 5kg", category: "groceries", basePrice: 400 },
  { title: "Daal (Lentils) 1kg", category: "groceries", basePrice: 100 },
  { title: "Sugar 1kg", category: "groceries", basePrice: 45 },
  { title: "Salt 1kg", category: "groceries", basePrice: 25 },
  { title: "Cooking Oil 1L", category: "groceries", basePrice: 150 },
  { title: "Ghee 500g", category: "groceries", basePrice: 350 },
  { title: "Turmeric Powder 100g", category: "spices", basePrice: 50 },
  { title: "Red Chilli Powder 100g", category: "spices", basePrice: 40 },
  { title: "Coriander Powder 100g", category: "spices", basePrice: 35 },
  { title: "Tea 250g", category: "beverages", basePrice: 150 },
  { title: "Coffee 250g", category: "beverages", basePrice: 200 },
  { title: "Milk 1L", category: "groceries", basePrice: 50 },
  { title: "Eggs (12 pcs)", category: "groceries", basePrice: 80 },
  { title: "Bread 1 loaf", category: "groceries", basePrice: 50 },
  
  // Snacks
  { title: "Parle-G (Multiple)", category: "snacks", basePrice: 10 },
  { title: "Britannia Marie", category: "snacks", basePrice: 30 },
  { title: "Lays Chips", category: "snacks", basePrice: 20 },
  { title: "Kurkure", category: "snacks", basePrice: 20 },
  { title: "Maggi Noodles (Pack)", category: "snacks", basePrice: 15 },
  { title: "Chocolate (Bar)", category: "snacks", basePrice: 50 },
  { title: "Biscuits Pack", category: "snacks", basePrice: 30 },
  { title: "Namkeen Mix", category: "snacks", basePrice: 50 },
  
  // Personal Care
  { title: "Dove Soap (4 pcs)", category: "personal care", basePrice: 100 },
  { title: "Shampoo 400ml", category: "personal care", basePrice: 180 },
  { title: "Toothpaste", category: "personal care", basePrice: 80 },
  { title: "Comb", category: "personal care", basePrice: 20 },
  { title: "Hair Oil", category: "personal care", basePrice: 120 },
  { title: "Face Cream", category: "beauty", basePrice: 250 },
  { title: "Moisturizer", category: "beauty", basePrice: 300 },
  { title: "Lipstick", category: "beauty", basePrice: 350 },
  { title: "Deodorant", category: "personal care", basePrice: 250 },
  { title: "Detergent Powder 1kg", category: "personal care", basePrice: 150 },
  
  // Furniture
  { title: "Dining Table 6 Seater", category: "furniture", basePrice: 15000 },
  { title: "Office Chair", category: "furniture", basePrice: 5000 },
  { title: "Sofa Set 3+2", category: "furniture", basePrice: 35000 },
  { title: "Bed King Size", category: "furniture", basePrice: 25000 },
  { title: "Wardrobe", category: "furniture", basePrice: 12000 },
  { title: "Book Shelf", category: "furniture", basePrice: 5000 },
  { title: "Coffee Table", category: "furniture", basePrice: 3000 },
  
  // Books
  { title: "Novel Bestseller", category: "books", basePrice: 350 },
  { title: "Self Help Book", category: "books", basePrice: 300 },
  { title: "Programming Guide", category: "books", basePrice: 500 },
  { title: "School Textbook", category: "books", basePrice: 400 },
  
  // Fitness
  { title: "Yoga Mat", category: "fitness equipment", basePrice: 500 },
  { title: "Dumbbells Set", category: "fitness equipment", basePrice: 1500 },
  { title: "Treadmill", category: "fitness equipment", basePrice: 35000 },
  { title: "Cycling Machine", category: "fitness equipment", basePrice: 10000 },
  { title: "Gym Bench", category: "fitness equipment", basePrice: 3000 },
  { title: "Resistance Bands", category: "fitness equipment", basePrice: 500 },
  
  // Toys
  { title: "Remote Control Car", category: "toys", basePrice: 1500 },
  { title: "Action Figure", category: "toys", basePrice: 500 },
  { title: "Board Game", category: "toys", basePrice: 400 },
  { title: "Building Blocks", category: "toys", basePrice: 600 },
  { title: "Soft Toy", category: "toys", basePrice: 300 },
  { title: "Puzzle Set", category: "toys", basePrice: 250 },
  
  // Baby Products
  { title: "Diapers (Pack of 30)", category: "baby products", basePrice: 400 },
  { title: "Baby Powder", category: "baby products", basePrice: 150 },
  { title: "Baby Soap", category: "baby products", basePrice: 80 },
  { title: "Baby Food", category: "baby products", basePrice: 200 },
  { title: "Baby Stroller", category: "baby products", basePrice: 5000 },
  { title: "Baby Cradle", category: "baby products", basePrice: 3000 },
  
  // Pet Supplies
  { title: "Dog Food 5kg", category: "pet supplies", basePrice: 800 },
  { title: "Cat Food 1kg", category: "pet supplies", basePrice: 400 },
  { title: "Pet Bed", category: "pet supplies", basePrice: 1000 },
  { title: "Pet Toys", category: "pet supplies", basePrice: 300 },
  { title: "Pet Leash", category: "pet supplies", basePrice: 200 },
  
  // Dry Fruits
  { title: "Almonds 500g", category: "dry food", basePrice: 400 },
  { title: "Cashews 500g", category: "dry food", basePrice: 500 },
  { title: "Raisins 500g", category: "dry food", basePrice: 200 },
  { title: "Walnuts 500g", category: "dry food", basePrice: 450 },
  { title: "Pistachios 500g", category: "dry food", basePrice: 600 },
  { title: "Makhana (Fox Nuts) 500g", category: "dry food", basePrice: 250 },
  
  // Stationery
  { title: "Notebook", category: "stationery", basePrice: 40 },
  { title: "Pen Set", category: "stationery", basePrice: 50 },
  { title: "Pencil Box", category: "stationery", basePrice: 80 },
  { title: "Sketch Book", category: "stationery", basePrice: 60 },
  { title: "Glue Stick", category: "stationery", basePrice: 30 },
  { title: "Scissors", category: "stationery", basePrice: 40 },
  { title: "Stapler", category: "stationery", basePrice: 80 },
  { title: "File Folder", category: "stationery", basePrice: 30 },
  
  // Musical Instruments
  { title: "Acoustic Guitar", category: "musical instruments", basePrice: 5000 },
  { title: "Keyboard Piano", category: "musical instruments", basePrice: 8000 },
  { title: "Tabla Set", category: "musical instruments", basePrice: 6000 },
  { title: "Harmonium", category: "musical instruments", basePrice: 7000 },
  { title: "Violin", category: "musical instruments", basePrice: 10000 },
  { title: "Drum Set", category: "musical instruments", basePrice: 15000 },
  
  // Outdoor Gear
  { title: "Camping Tent", category: "outdoor gear", basePrice: 5000 },
  { title: "Sleeping Bag", category: "outdoor gear", basePrice: 1500 },
  { title: "Backpack 50L", category: "outdoor gear", basePrice: 2000 },
  { title: "Water Bottle", category: "outdoor gear", basePrice: 500 },
  { title: "Flashlight", category: "outdoor gear", basePrice: 300 },
  { title: "Compass", category: "outdoor gear", basePrice: 200 },
  
  // Automotive
  { title: "Car Phone Mount", category: "automotive accessories", basePrice: 500 },
  { title: "Car Vacuum Cleaner", category: "automotive accessories", basePrice: 2000 },
  { title: "Seat Cover Set", category: "automotive accessories", basePrice: 2500 },
  { title: "Car Freshener", category: "automotive accessories", basePrice: 200 },
  { title: "Tyre Inflator", category: "automotive accessories", basePrice: 1500 },
  { title: "Jump Starter", category: "automotive accessories", basePrice: 3000 },
  
  // Gardening
  { title: "Garden Tools Set", category: "gardening tools", basePrice: 800 },
  { title: "Watering Can", category: "gardening tools", basePrice: 200 },
  { title: "Plant Pots (Set of 3)", category: "gardening tools", basePrice: 300 },
  { title: "Garden Gloves", category: "gardening tools", basePrice: 150 },
  { title: "Soil Fertilizer", category: "gardening tools", basePrice: 200 },
  { title: "Seeds Pack", category: "gardening tools", basePrice: 50 }
];

// Fallback image using picsum.photos (more reliable than unsplash source)
const getFallbackImage = (baseTitle) => {
  // Generate a consistent hash from the title
  let hash = 0;
  for (let i = 0; i < baseTitle.length; i++) {
    hash = baseTitle.charCodeAt(i) + ((hash << 5) - hash);
  }
  const id = Math.abs(hash % 1000);
  return `https://picsum.photos/seed/${id}/600/600`;
};

// Product image map (high-quality images)
const productImageMap = {
  // Smartphones
  "iPhone 15 Pro": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop",
  "iPhone 15": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop",
  "Samsung Galaxy S24 Ultra": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop",
  "Samsung Galaxy S24": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600&h=600&fit=crop",
  "OnePlus Nord 3": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop",
  "OnePlus 12": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop",
  "Redmi Note 13 Pro": "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=600&fit=crop",
  "Realme GT 5": "https://images.unsplash.com/photo-1592478411213-61535fdd861d?w=600&h=600&fit=crop",
  "Vivo V30": "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&h=600&fit=crop",
  "OPPO Reno 11": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop",
  
  // Laptops
  "MacBook Air M3": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop",
  "MacBook Pro 14": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop",
  "Dell XPS 15": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop",
  "HP Pavilion Plus": "https://images.unsplash.com/photo-1615759223820-d5f7e54e01d6?w=600&h=600&fit=crop",
  "Lenovo ThinkPad X1": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=600&fit=crop",
  "ASUS ROG Strix": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=600&fit=crop",
  "Acer Aspire 5": "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&h=600&fit=crop",
  "MSI Modern 15": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop",
  
  // TVs
  "LG OLED 55 inch": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop",
  "Samsung QLED 55 inch": "https://images.unsplash.com/photo-1558883520-d4e4e54e01d6?w=600&h=600&fit=crop",
  "Sony Bravia 55 inch": "https://images.unsplash.com/photo-1523441298448-8db5ef11f7bb?w=600&h=600&fit=crop",
  "OnePlus TV 55 inch": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop",
  "Xiaomi TV 50 inch": "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=600&h=600&fit=crop",
  "TCL TV 55 inch": "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=600&h=600&fit=crop",
  
  // Men's Shoes
  "Nike Air Max": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
  "Adidas Ultraboost": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop",
  "Puma RS-X": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop",
  "Reebok Classic": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop",
  "Nike Jordan 1": "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&h=600&fit=crop",
  "Sparx Running Shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
  "Bata Formal Shoes": "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&h=600&fit=crop",
  "Liberty Casual Shoes": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=600&fit=crop",
  
  // Women's Shoes
  "Nike Air Force 1": "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&h=600&fit=crop",
  "Adidas Stan Smith": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=600&fit=crop",
  "Puma Suede": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop",
  "Heels Party Wear": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop",
  "Sandal Daily Wear": "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&h=600&fit=crop",
  "Bata Flats": "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&h=600&fit=crop",
  
  // Watches
  "Titan Smart Watch": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
  "Fastrack Smart Watch": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
  "Apple Watch Series 9": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop",
  "Samsung Galaxy Watch": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop",
  "Noise Smart Watch": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop",
  "Rolex Submariner": "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=600&fit=crop",
  "Casio G-Shock": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&h=600&fit=crop",
  
  // Electronics
  "Sony WH-1000XM5": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop",
  "Bose QuietComfort": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
  "JBL Flip 6": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop",
  "Sony PlayStation 5": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop",
  "Nintendo Switch": "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&h=600&fit=crop",
  "Canon EOS R6": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop",
  "Nikon Z50": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop",
  "GoPro Hero 12": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop",
  
  // Groceries - Fruits
  "Organic Bananas 1kg": "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=600&h=600&fit=crop",
  "Apple 1kg": "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&h=600&fit=crop",
  "Orange 1kg": "https://images.unsplash.com/photo-1547514701-42782101795e?w=600&h=600&fit=crop",
  "Mangoes 1kg": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&h=600&fit=crop",
  "Grapes 500g": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&h=600&fit=crop",
  "Papaya 1kg": "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&h=600&fit=crop",
  "Watermelon 1kg": "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=600&h=600&fit=crop",
  "Pomegranate 1kg": "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600&h=600&fit=crop",
  
  // Vegetables
  "Potatoes 1kg": "https://images.unsplash.com/photo-1518977676601-b53f82be6b8c?w=600&h=600&fit=crop",
  "Onions 1kg": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop",
  "Tomatoes 1kg": "https://images.unsplash.com/photo-1546470427-227c7369a9b5?w=600&h=600&fit=crop",
  "Carrots 500g": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&h=600&fit=crop",
  "Spinach 250g": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=600&fit=crop",
  "Cucumber 500g": "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600&h=600&fit=crop",
  "Green Chillies 100g": "https://images.unsplash.com/photo-1508254627335-5f751474588e?w=600&h=600&fit=crop",
  "Ginger 100g": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=600&fit=crop",
  
  // Daily Essentials
  "Aata (Wheat Flour) 10kg": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=600&fit=crop",
  "Rice (Basmati) 5kg": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop",
  "Daal (Lentils) 1kg": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop",
  "Sugar 1kg": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop",
  "Salt 1kg": "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=600&h=600&fit=crop",
  "Cooking Oil 1L": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop",
  "Ghee 500g": "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=600&fit=crop",
  "Tea 250g": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop",
  "Coffee 250g": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
  "Milk 1L": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=600&fit=crop",
  "Eggs (12 pcs)": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=600&fit=crop",
  "Bread 1 loaf": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop",
  
  // Snacks
  "Parle-G (Multiple)": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=600&fit=crop",
  "Britannia Marie": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=600&fit=crop",
  "Lays Chips": "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&h=600&fit=crop",
  "Kurkure": "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&h=600&fit=crop",
  "Maggi Noodles (Pack)": "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=600&h=600&fit=crop",
  "Chocolate (Bar)": "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&h=600&fit=crop",
  
  // Personal Care
  "Dove Soap (4 pcs)": "https://images.unsplash.com/photo-1556228578-0d85b1a4d573?w=600&h=600&fit=crop",
  "Shampoo 400ml": "https://images.unsplash.com/photo-1585232569525-f087bd9dae8e?w=600&h=600&fit=crop",
  "Toothpaste": "https://images.unsplash.com/photo-1585675322389-21c67162b021?w=600&h=600&fit=crop",
  "Face Cream": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
  
  // Furniture
  "Dining Table 6 Seater": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop",
  "Office Chair": "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&h=600&fit=crop",
  "Sofa Set 3+2": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop",
  "Bed King Size": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=600&fit=crop",
  
  // Books
  "Novel Bestseller": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop",
  "Programming Guide": "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop",
  
  // Fitness
  "Yoga Mat": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop",
  "Dumbbells Set": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop",
  
  // Toys
  "Remote Control Car": "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&h=600&fit=crop",
  "Action Figure": "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=600&h=600&fit=crop"
};

// Get thumbnail for product
const getThumbnail = (title) => {
  const words = title.split(' ');
  const lastWord = words[words.length - 1];
  if (!isNaN(lastWord)) {
    words.pop();
  }
  const baseTitle = words.join(' ');
  
  if (productImageMap[baseTitle]) {
    return productImageMap[baseTitle];
  }
  return getFallbackImage(baseTitle);
};

// Generate products with variations
const generateProducts = () => {
  let products = [];
  
  // First add all base products
  for (const product of sampleProductsData) {
    const priceRange = categoryPriceRanges[product.category] || { min: 100, max: 1000 };
    const priceVariation = product.basePrice || Math.floor(Math.random() * (priceRange.max - priceRange.min) + priceRange.min);
    const discountPercentage = Math.floor(Math.random() * 25); // 0-25% discount
    const discountedPrice = Math.floor(priceVariation * (1 - discountPercentage / 100));
    
    products.push({
      title: product.title,
      price: priceVariation,
      discountedPrice: discountedPrice,
      discountPercentage: discountPercentage,
      category: product.category,
      brand: product.title.split(' ')[0],
      rating: (Math.random() * 1 + 4).toFixed(1),
      thumbnail: getThumbnail(product.title)
    });
  }
  
  // Then add variations to reach 1000 products
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Silver', 'Gold', 'Gray', 'Pink', 'Purple'];
  const sizes = ['S', 'M', 'L', 'XL', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'];
  
  while (products.length < 1000) {
    const baseProduct = sampleProductsData[Math.floor(Math.random() * sampleProductsData.length)];
    const variant = colors[Math.floor(Math.random() * colors.length)];
    const title = `${baseProduct.title} ${variant}`;
    
    const exists = products.some(p => p.title === title);
    if (!exists) {
      const priceRange = categoryPriceRanges[baseProduct.category] || { min: 100, max: 1000 };
      const priceVariation = Math.floor(Math.random() * (priceRange.max - priceRange.min) + priceRange.min);
      const discountPercentage = Math.floor(Math.random() * 25);
      const discountedPrice = Math.floor(priceVariation * (1 - discountPercentage / 100));
      
      products.push({
        title,
        price: priceVariation,
        discountedPrice: discountedPrice,
        discountPercentage: discountPercentage,
        category: baseProduct.category,
        brand: baseProduct.title.split(' ')[0],
        rating: (Math.random() * 1 + 4).toFixed(1),
        thumbnail: getThumbnail(title)
      });
    }
  }
  
  return products;
};

const seedData = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");
    
    // Generate products
    const products = generateProducts();
    
    // Insert products
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
