import React, { useContext, useEffect, useState } from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import { userContext } from '../MainContext'
import API from '../api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Home() {
  let { cart, setcart } = useContext(userContext)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/products")
      .then(res => {
        if (res.data && res.data.products) {
          setProducts(res.data.products);
        } else if (Array.isArray(res.data)) {
          setProducts(res.data);
        }
      })
      .catch(err => {
        console.error("Error fetching products:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

  if (loading) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-screen-xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Big Shopping Festival
              </h1>
              <p className="text-xl mb-6">
                Up to 80% Off on Electronics, Fashion & More
              </p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full">
                Shop Now
              </button>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600" 
                alt="Shopping" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200' },
              { name: 'Fashion', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200' },
              { name: 'Home', img: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=200' },
              { name: 'Beauty', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200' },
              { name: 'Sports', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200' },
              { name: 'Books', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200' }
            ].map((cat, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-4 text-center cursor-pointer hover:shadow-xl transition-shadow">
                <img src={cat.img} alt={cat.name} className="w-20 h-20 mx-auto rounded-full object-cover mb-2" />
                <p className="font-semibold">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Trending Products</h2>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.thumbnail || product.image || 'https://via.placeholder.com/300'}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                      }}
                    />
                    {product.discount && (
                      <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 h-10 overflow-hidden">
                      {product.title}
                    </h3>
                    
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500 text-sm">⭐ {product.rating || '4.0'}</span>
                      <span className="text-gray-500 text-xs ml-2">(123 reviews)</span>
                    </div>
                    
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-gray-400 text-sm line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 mt-3 rounded transition-colors"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl mb-2">🚚</div>
              <h3 className="font-bold">Free Delivery</h3>
              <p className="text-sm">On orders above ₹499</p>
            </div>
            <div>
              <div className="text-4xl mb-2">↩️</div>
              <h3 className="font-bold">Easy Returns</h3>
              <p className="text-sm">10 Day Return Policy</p>
            </div>
            <div>
              <div className="text-4xl mb-2">🛡️</div>
              <h3 className="font-bold">Secure Payment</h3>
              <p className="text-sm">100% Secure Payment</p>
            </div>
            <div>
              <div className="text-4xl mb-2">📞</div>
              <h3 className="font-bold">24/7 Support</h3>
              <p className="text-sm">Dedicated Support</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ToastContainer />
    </div>
  )
}
