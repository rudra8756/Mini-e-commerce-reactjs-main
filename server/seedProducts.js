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

// Real product image URLs from Unsplash with specific photo IDs
const productImageMap = {
  "iPhone 15 Pro": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop",
  "Samsung Galaxy S24 Ultra": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop",
  "OnePlus Nord 3": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop",
  "Dell XPS 15": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop",
  "MacBook Air M2": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop",
  "Nike Air Zoom Pegasus": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
  "Adidas Ultraboost": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop",
  "Sony WH-1000XM5": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop",
  "Canon EOS R6": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop",
  "Nikon Z50": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop",
  "LG OLED TV": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop",
  "Samsung QLED TV": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop",
  "Fujifilm X-T4": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop",
  "Ikea Dining Table": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop",
  "HP Pavilion Laptop": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop",
  "Reebok Classic Shoes": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop",
  "Puma Runner": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
  "Organic Bananas": "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=600&h=600&fit=crop",
  "Pure Olive Oil": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop",
  "Dove Shampoo": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
  "Pond's Face Cream": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
  "LG Refrigerator": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop",
  "Whirlpool Microwave": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop",
  "Titan Smart Watch": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
  "Rolex Datejust": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
  "Fruits": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&h=600&fit=crop",
  "Vegetables": "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600&h=600&fit=crop",
  "Snacks": "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&h=600&fit=crop",
  "Beverages": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=600&fit=crop",
  "Personal Care": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
  "Kitchen Appliances": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop",
  "Outdoor Gear": "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=600&fit=crop",
  "Fitness Equipment": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop",
  "Books": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop",
  "Toys": "https://images.unsplash.com/photo-1558877385-1199c1af4e0e?w=600&h=600&fit=crop",
  "Pet Supplies": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=600&fit=crop",
  "Dryn Food": "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&h=600&fit=crop",
  "Stationery": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=600&fit=crop",
  "Automotive Accessories": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
  "Musical Instruments": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop",
  "Baby Products": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=600&fit=crop",
  "Office Supplies": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=600&fit=crop",
  "Gardening Tools": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop",
  "Health Supplements": "https://images.unsplash.com/photo-1550572017-edd951aa8ca9?w=600&h=600&fit=crop",
  "Aata": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=600&fit=crop",
  "Daal": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop",
  "Chawal": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop",
  "Cheeni": "https://images.unsplash.com/photo-1558642452-9d2a86db23e2?w=600&h=600&fit=crop",
  "Ghee": "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=600&fit=crop",
  "Makhana": "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&h=600&fit=crop",
  "Kishmish": "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=600&h=600&fit=crop",
  "Kaaju": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=600&fit=crop",
  "Badam": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=600&fit=crop",
  "Pista": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=600&fit=crop",
  "Rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop",
  "Wheat Flour": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=600&fit=crop",
  "Sugar": "https://images.unsplash.com/photo-1558642452-9d2a86db23e2?w=600&h=600&fit=crop",
  "Oil": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop",
  "Pulses": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop",
  "Spices": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop",
  "Tea": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=600&fit=crop",
  "Coffee": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=600&fit=crop",
  "Biscuits": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=600&fit=crop",
  "Chocolates": "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&h=600&fit=crop",
  "Noodles": "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=600&h=600&fit=crop",
  "Sauces": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop",
  "Pickles": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop",
  "Honey": "https://images.unsplash.com/photo-1558642452-9d2a86db23e2?w=600&h=600&fit=crop",
  "Jams": "https://images.unsplash.com/photo-1558642452-9d2a86db23e2?w=600&h=600&fit=crop",
  "Butter": "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=600&fit=crop",
  "Cheese": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&h=600&fit=crop",
  "Milk": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=600&fit=crop",
  "Yogurt": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&h=600&fit=crop",
  "Paneer": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&h=600&fit=crop",
  "Eggs": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
  "Meat": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop",
  "Fish": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c0a?w=600&h=600&fit=crop",
  "Chicken": "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&h=600&fit=crop",
  "Mutton": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop",
  "Pork": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop",
  "Beef": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop"
};

// generate 1000 unique
let products = [];
while (products.length < 1000) {
  const title =
    sampleProducts[Math.floor(Math.random() * sampleProducts.length)] +
    " " +
    Math.floor(Math.random() * 1000);
  products.push({
    title,
    price: Math.floor(Math.random() * 95000) + 1000,
    rating: (Math.random() * 1 + 4).toFixed(1),
    discountPercentage: Math.floor(Math.random() * 25),
    category:
      categories[Math.floor(Math.random() * categories.length)],
    brand: title.split(" ")[0]
  });
}

// keyword mapping for better image matching
const keywordMap = {
  "iPhone": "iphone 15 pro",
  "Samsung": "samsung galaxy s24",
  "OnePlus": "oneplus nord",
  "Dell": "dell xps laptop",
  "MacBook": "macbook air",
  "HP": "hp pavilion laptop",
  "Nike": "nike air zoom pegasus",
  "Adidas": "adidas ultraboost",
  "Reebok": "reebok classic shoes",
  "Puma": "puma runner",
  "Sony": "sony wh-1000xm5 headphones",
  "Canon": "canon eos r6",
  "Nikon": "nikon z50",
  "Fujifilm": "fujifilm x-t4",
  "LG": "lg oled tv",
  "Whirlpool": "whirlpool microwave",
  "Titan": "titan smart watch",
  "Rolex": "rolex datejust",
  "Organic": "organic bananas",
  "Pure": "pure olive oil",
  "Dove": "dove shampoo",
  "Pond's": "ponds face cream",
  "Ikea": "ikea dining table",
  "Fruits": "fresh fruits",
  "Vegetables": "fresh vegetables",
  "Snacks": "snacks",
  "Beverages": "beverages",
  "Personal": "personal care",
  "Kitchen": "kitchen appliances",
  "Outdoor": "outdoor gear",
  "Fitness": "fitness equipment",
  "Books": "books",
  "Toys": "toys",
  "Food": "dry food",
  "Grocery":"Groceries",
  "Pet": "pet supplies",
  "Dry": "dry food",
  "Stationery": "stationery",
  "Automotive": "automotive accessories",
  "Musical": "musical instruments",
  "Baby": "baby products",
  "Office": "office supplies",
  "Gardening": "gardening tools",
  "Health": "health supplements"
};

// image function with reliable product-specific images
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

  // Use LoremFlickr for product-specific images based on keywords
  return `https://loremflickr.com/600/600/${encodeURIComponent(baseTitle)}`;
};

const finalProducts = products.map((p) => ({
  ...p,
  thumbnail: getThumbnail(p.title)
}));

const seedData = async () => {
  try {
    // Clear existing products to ensure fresh seeding of 1000 products
    await Product.deleteMany({});
    // Insert 1000 new products with images
    await Product.insertMany(finalProducts);
    console.log("1000 Products Seeded Successfully with Images");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

seedData();
