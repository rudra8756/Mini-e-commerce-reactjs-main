import React, { useEffect, useState, useContext } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import API from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cartContext } from '../MainContext';

export default function Product() {

    const [products, setProducts] = useState([]);
    const [sorting, setSorting] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [brandsfilter, setBrandsFilter] = useState([]);
    const [rating, setRating] = useState(null);
    const [range, setrange] = useState(null);
    const [priceRange, setPriceRange] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const { cart, setcart } = useContext(cartContext);

    const Toggle = () => setIsOpen(!isOpen);

    // Clean cart on mount
    useEffect(() => {
        setcart(prev => {
            if (!Array.isArray(prev)) return [];
            return prev.filter(item => item && item.productId && item.productId._id && item.quantity);
        });
    }, []);

    // ⭐ GET PRODUCTS FROM BACKEND
    const getProducts = () => {
        API.get("/products")
            .then((res) => {

                let filtered = res.data.products;

                if (categoryFilter.length > 0) {
                    filtered = filtered.filter(product =>
                        categoryFilter.includes(product.category?.toLowerCase())
                    );
                }

                if (brandsfilter.length > 0) {
                    filtered = filtered.filter(product =>
                        brandsfilter.includes(product.brand?.toLowerCase())
                    );
                }

                if (rating !== null) {
                    filtered = filtered.filter(product => product.rating >= rating);
                }

                if (range !== null) {
                    filtered = filtered.filter(product => product.discountPercentage >= range);
                }

                if (priceRange !== null) {
                    switch (priceRange) {
                        case '10-250':
                            filtered = filtered.filter(p => p.price >= 10 && p.price <= 250);
                            break;
                        case '250-500':
                            filtered = filtered.filter(p => p.price >= 250 && p.price <= 500);
                            break;
                        case '500-1000':
                            filtered = filtered.filter(p => p.price >= 500 && p.price <= 1000);
                            break;
                        case '1000-above':
                            filtered = filtered.filter(p => p.price >= 1000);
                            break;
                    }
                }

                if (sorting !== null) {
                    switch (sorting) {
                        case 1:
                            filtered.sort((a, b) => a.title.localeCompare(b.title));
                            break;
                        case 2:
                            filtered.sort((a, b) => b.title.localeCompare(a.title));
                            break;
                        case 3:
                            filtered.sort((a, b) => a.price - b.price);
                            break;
                        case 4:
                            filtered.sort((a, b) => b.price - a.price);
                            break;
                    }
                }

                setProducts(filtered);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getProducts();
    }, [sorting, categoryFilter, brandsfilter, rating, range, priceRange]);

    // ⭐ CART FUNCTIONS
    const addToCart = async (product) => {
        try {
            await API.post("/cart", {
                productId: product._id,
                quantity: 1
            });
            setcart(prev => [...prev, { productId: product, quantity: 1 }]);
            toast.success("Added to cart");
        } catch (error) {
            toast.error("Failed to add to cart");
        }
    };

    const isProductInCart = (id) => {
        if (!Array.isArray(cart)) return false;
        return cart.some(item => {
            if (!item) return false;
            // Handle old cart structure
            if (item.id) return item.id === id;
            // Handle new cart structure
            if (item.productId && item.productId._id) return item.productId._id === id;
            return false;
        });
    };

    const removeFromCart = async (id) => {
        try {
            await API.delete(`/cart/${id}`);
            // Refresh cart data from server to sync
            const cartResponse = await API.get("/cart");
            setcart(cartResponse.data.products || []);
            toast.warn("Removed From Cart");
        } catch (error) {
            toast.error("Failed to remove from cart");
        }
    };

    return (
        <>
            <Header />
            <ToastContainer />

            {/* Filters Section */}
            <div className="bg-gray-100 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                multiple
                                value={categoryFilter}
                                onChange={(e) => {
                                    const values = Array.from(e.target.selectedOptions, option => option.value);
                                    setCategoryFilter(values);
                                }}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="smartphones">Smartphones</option>
                                <option value="laptops">Laptops</option>
                                <option value="mens shoes">Men's Shoes</option>
                                <option value="womens shoes">Women's Shoes</option>
                                <option value="electronics">Electronics</option>
                                <option value="tv">TV</option>
                                <option value="cameras">Cameras</option>
                                <option value="furniture">Furniture</option>
                                <option value="groceries">Groceries</option>
                                <option value="beauty">Beauty</option>
                                <option value="home appliances">Home Appliances</option>
                                <option value="watches">Watches</option>
                            </select>
                        </div>

                        {/* Brand Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                            <select
                                multiple
                                value={brandsfilter}
                                onChange={(e) => {
                                    const values = Array.from(e.target.selectedOptions, option => option.value);
                                    setBrandsFilter(values);
                                }}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="iphone">iPhone</option>
                                <option value="samsung">Samsung</option>
                                <option value="dell">Dell</option>
                                <option value="macbook">MacBook</option>
                                <option value="nike">Nike</option>
                                <option value="adidas">Adidas</option>
                                <option value="sony">Sony</option>
                                <option value="canon">Canon</option>
                                <option value="lg">LG</option>
                            </select>
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                            <select
                                value={priceRange || ''}
                                onChange={(e) => setPriceRange(e.target.value || null)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">All Prices</option>
                                <option value="10-250">₹10 - ₹250</option>
                                <option value="250-500">₹250 - ₹500</option>
                                <option value="500-1000">₹500 - ₹1000</option>
                                <option value="1000-above">₹1000+</option>
                            </select>
                        </div>

                        {/* Rating Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
                            <select
                                value={rating || ''}
                                onChange={(e) => setRating(e.target.value ? parseFloat(e.target.value) : null)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">All Ratings</option>
                                <option value="4">4+ Stars</option>
                                <option value="3">3+ Stars</option>
                                <option value="2">2+ Stars</option>
                                <option value="1">1+ Stars</option>
                            </select>
                        </div>

                        {/* Sorting */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select
                                value={sorting || ''}
                                onChange={(e) => setSorting(e.target.value ? parseInt(e.target.value) : null)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Default</option>
                                <option value="1">Name A-Z</option>
                                <option value="2">Name Z-A</option>
                                <option value="3">Price Low-High</option>
                                <option value="4">Price High-Low</option>
                            </select>
                        </div>

                        {/* Discount Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Discount %</label>
                            <select
                                value={range || ''}
                                onChange={(e) => setrange(e.target.value ? parseInt(e.target.value) : null)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">All</option>
                                <option value="10">10%+</option>
                                <option value="20">20%+</option>
                                <option value="30">30%+</option>
                                <option value="50">50%+</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setCategoryFilter([]);
                                    setBrandsFilter([]);
                                    setRating(null);
                                    setrange(null);
                                    setPriceRange(null);
                                    setSorting(null);
                                }}
                                className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            >
                                Clear Filters
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 p-5">
                {products.map((item) => (
                    <div key={item._id} className="shadow-lg w-60 p-3">
                        <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-40 object-cover"
                            onError={(e) => e.target.src = 'https://picsum.photos/150'}
                        />

                        <h3 className="font-bold mt-2">{item.title}</h3>
                        <p>₹ {item.price}</p>
                        <p>⭐ {item.rating}</p>

                        {isProductInCart(item._id) ? (
                            <button
                                className="bg-red-500 text-white px-4 py-1 mt-2"
                                onClick={() => removeFromCart(item._id)}
                            >
                                REMOVE
                            </button>
                        ) : (
                            <button
                                className="bg-blue-600 text-white px-4 py-1 mt-2"
                                onClick={() => addToCart(item)}
                            >
                                ADD
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <Footer />
        </>
    );
}
