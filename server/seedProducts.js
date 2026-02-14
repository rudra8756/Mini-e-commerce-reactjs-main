const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const categories = [
  "smartphones","laptops","mens shoes","womens shoes","electronics",
  "tv","cameras","furniture","groceries","beauty","home appliances","watches",
  "fruits","vegetables","snacks","beverages","personal care",
  "kitchen appliances","outdoor gear","fitness equipment","books","toys",
  "pet supplies","dry food","stationery","automotive accessories",
  "musical instruments","baby products","office supplies","gardening tools",
  "health supplements"
];

const sampleProducts = [
  "iPhone 15 Pro","Samsung Galaxy S24 Ultra","OnePlus Nord 3",
  "Dell XPS 15","MacBook Air M2","Nike Air Zoom Pegasus",
  "Adidas Ultraboost","Sony WH-1000XM5","Canon EOS R6","Nikon Z50",
  "LG OLED TV","Samsung QLED TV","Fujifilm X-T4","Ikea Dining Table",
  "HP Pavilion Laptop","Reebok Classic Shoes","Puma Runner",
  "Organic Bananas","Pure Olive Oil","Dove Shampoo","Pond's Face Cream",
  "LG Refrigerator","Whirlpool Microwave","Titan Smart Watch",
  "Rolex Datejust","Fruits","Vegetables","Snacks","Beverages","Personal Care",
  "Kitchen Appliances","Outdoor Gear","Fitness Equipment","Books","Toys",
  "Pet Supplies","Dryn Food","Stationery","Automotive Accessories",
  "Musical Instruments","Baby Products","Office Supplies","Gardening Tools",
  "Health Supplements","Aata","Daal","Chawal","Cheeni","Ghee","Oil",
  "Makhana","Kishmish","Kaaju","Badam","Pista","Rice","Wheat Flour","Sugar",
  "Pulses","Spices","Tea","Coffee","Biscuits","Chocolates","Noodles","Sauces",
  "Pickles","Honey","Jams","Butter","Cheese","Milk","Yogurt","Paneer","Eggs",
  "Meat","Fish","Chicken","Mutton","Pork","Beef"
];

// CORRECTED product image URLs - Each product has its own unique image
const productImageMap = {
  // Electronics - Smartphones
  "iPhone 15 Pro": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop",
  "Samsung Galaxy S24 Ultra": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop",
  "OnePlus Nord 3": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop",
  
  // Laptops
  "Dell XPS 15": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop",
  "MacBook Air M2": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop",
  "HP Pavilion Laptop": "https://images.unsplash.com/photo-1615759223820-d5f7e14c9f9d?w=600&h=600&fit=crop",
  
  // Shoes
  "Nike Air Zoom Pegasus": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
  "Adidas Ultraboost": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop",
  "Reebok Classic Shoes": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop",
  "Puma Runner": "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&fit=600&h=crop",
  
  // Electronics - Audio/Video
  "Sony WH-1000XM5": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop",
  "Canon EOS R6": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop",
  "Nikon Z50": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop",
  "Fujifilm X-T4": "https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=600&h=600&fit=crop",
  
  // TVs
  "LG OLED TV": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop",
  "Samsung QLED TV": "https://images.unsplash.com/photo-1558883520-d4a4e54e01d6?w=600&h=600&fit=crop",
  
  // Furniture
  "Ikea Dining Table": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop",
  
  // Home Appliances
  "LG Refrigerator": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&h=600&fit=crop",
  "Whirlpool Microwave": "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=600&fit=crop",
  
  // Watches
  "Titan Smart Watch": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
  "Rolex Datejust": "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=600&fit=crop",
  
  // Groceries - Fruits
  "Organic Bananas": "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=600&h=600&fit=crop",
  "Fruits": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&h=600&fit=crop",
  
  // Groceries - Vegetables
  "Vegetables": "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600&h=600&fit=crop",
  
  // Groceries - Snacks
  "Snacks": "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&h=600&fit=crop",
  "Biscuits": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=600&fit=crop",
  "Chocolates": "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&h=600&fit=crop",
  "Noodles": "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=600&h=600&fit=crop",
  
  // Groceries - Beverages
  "Beverages": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=600&fit=crop",
  "Tea": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop",
  "Coffee": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
  
  // Groceries - Personal Care
  "Personal Care": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
  "Dove Shampoo": "https://images.unsplash.com/photo-1556228578-0d85b1a4d573?w=600&h=600&fit=crop",
  "Pond's Face Cream": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
  
  // Groceries - Kitchen
  "Kitchen Appliances": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop",
  "Pure Olive Oil": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop",
  "Ghee": "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=600&fit=crop",
  
  // Groceries - Sauces & Condiments
  "Sauces": "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=600&h=600&fit=crop",
  "Pickles": "https://images.unsplash.com/photo-1588854337115-1cbd5f79d6b8?w=600&h=600&fit=crop",
  "Honey": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop",
  "Jams": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=600&fit=crop",
  
  // Groceries - Dairy
  "Milk": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=600&fit=crop",
  "Butter": "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=600&h=600&fit=crop",
  "Cheese": "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&h=600&fit=crop",
  "Yogurt": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=600&fit=crop",
  "Paneer": "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=600&fit=crop",
  "Eggs": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=600&fit=crop",
  
  // Groceries - Meat & Fish
  "Meat": "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=600&fit=crop",
  "Fish": "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600&h=600&fit=crop",
  "Chicken": "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&h=600&fit=crop",
  "Mutton": "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=600&fit=crop",
  "Pork": "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&h=600&fit=crop",
  "Beef": "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=600&fit=crop",
  
  // Groceries - Staples
  "Aata": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=600&fit=crop",
  "Wheat Flour": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=600&fit=crop",
  "Rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop",
  "Chawal": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop",
  "Daal": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop",
  "Pulses": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop",
  "Cheeni": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop",
  "Sugar": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop",
  "Oil": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop",
  "Spices": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop",
  
  // Groceries - Dry Fruits
  "Makhana": "https://images.unsplash.com/photo-1596561139413-aa8a8e5d9f35?w=600&h=600&fit=crop",
  "Kishmish": "https://images.unsplash.com/photo-1515023115689-589c33041697?w=600&h=600&fit=crop",
  "Kaaju": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=600&fit=crop",
  "Badam": "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=600&h=600&fit=crop",
  "Pista": "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&h=600&fit=crop",
  
  // Other Categories
  "Toys": "https://images.unsplash.com/photo-1558877385-1199c1af4e0e?w=600&h=600&fit=crop",
  "Books": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop",
  "Pet Supplies": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=600&fit=crop",
  "Stationery": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=600&fit=crop",
  "Office Supplies": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=600&fit=crop",
  "Baby Products": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=600&fit=crop",
  "Fitness Equipment": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop",
  "Gardening Tools": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop",
  "Health Supplements": "https://images.unsplash.com/photo-1550572017-edd951aa8ca9?w=600&h=600&fit=crop",
  "Musical Instruments": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop",
  "Automotive Accessories": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
  "Outdoor Gear": "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=600&fit=crop"
};

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

// Get thumbnail for product - tries to find specific image first, then uses fallback
const getThumbnail = (title) => {
  // Remove the random number at the end to get the base product name
  const words = title.split(' ');
  const lastWord = words[words.length - 1];
  if (!isNaN(lastWord)) {
    words.pop();
  }
  const baseTitle = words.join(' ');

  // Check if we have a specific image for this product
  if (productImageMap[baseTitle]) {
    return productImageMap[baseTitle];
  }

  // Use fallback with consistent seed based on title
  return getFallbackImage(baseTitle);
};

// Generate 1000 unique products
let products = [];
while (products.length < 1000) {
  const title =
    sampleProducts[Math.floor(Math.random() * sampleProducts.length)] +
    " " +
    Math.floor(Math.random() * 1000);
  
  // Check for duplicates
  const exists = products.some(p => p.title === title);
  if (!exists) {
    products.push({
      title,
      price: Math.floor(Math.random() * 95000) + 1000,
      rating: (Math.random() * 1 + 4).toFixed(1),
      discountPercentage: Math.floor(Math.random() * 25),
      category: categories[Math.floor(Math.random() * categories.length)],
      brand: title.split(" ")[0]
    });
  }
}

const finalProducts = products.map((p) => ({
  ...p,
  thumbnail: getThumbnail(p.title)
}));

const seedData = async () => {
  try {
    // Clear existing products to ensure fresh seeding
    await Product.deleteMany({});
    // Insert products
    await Product.insertMany(finalProducts);
    console.log("Products Seeded Successfully with Correct Images!");
    console.log(`Total products: ${finalProducts.length}`);
    process.exit();
  } catch (error) {
    console.log("Error seeding products:", error);
    process.exit(1);
  }
};

seedData();
