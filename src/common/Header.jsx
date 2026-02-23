import React, { useContext, useState } from 'react'
import { Link } from 'react-router'
import { userContext } from '../MainContext'
import API from '../api'

export default function Header() {
   let { cart, setcart } = useContext(userContext)
   let { token, settoken, user, setuser } = useContext(userContext)
   const [searchQuery, setSearchQuery] = useState("")
   const [searchResults, setSearchResults] = useState([])
   const [showSearch, setShowSearch] = useState(false)

   const handleSearch = async (e) => {
      const query = e.target.value
      setSearchQuery(query)
      
      if (query.length > 2) {
         try {
            const res = await API.get(`/products?search=${query}`)
            const products = res.data.products || res.data
            setSearchResults(products.slice(0, 5))
            setShowSearch(true)
         } catch (err) {
            console.error("Search error:", err)
         }
      } else {
         setSearchResults([])
         setShowSearch(false)
      }
   }

   const addToCartFromSearch = async (product) => {
      try {
         await API.post("/cart", {
            productId: product._id,
            quantity: 1
         })
         setcart(prev => [...prev, { productId: product, quantity: 1 }])
         setShowSearch(false)
         setSearchQuery("")
         alert("Added to cart!")
      } catch (error) {
         alert("Failed to add to cart")
      }
   }

   const handleLogout = () => {
      localStorage.removeItem("USER_TOKEN")
      localStorage.removeItem("USER_ID")
      localStorage.removeItem("USER_NAME")
      localStorage.removeItem("TOKEN")
      localStorage.removeItem("USER")
      localStorage.removeItem("CART")
      settoken('')
      setuser(null)
      setcart([])
   }

   return (
      <div className=" sticky top-0 z-[999] shadow-lg ">
         <nav className="bg-white border-white-200 dark:bg-white-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 bg-white ">
               <div className='align-left flex gap-3 '>
                  <Link to={'/'}>
                     <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo"></img>
                  </Link>
                  <Link to={'/'}>
                     <span className="self-center text-2xl  font-bold whitespace-nowrap dark:text-black">KadriBazar</span>
                  </Link>
               </div>

               {/* Search Bar */}
               <div className="relative flex-1 max-w-md mx-4">
                  <input
                     type="text"
                     placeholder="Search products..."
                     value={searchQuery}
                     onChange={handleSearch}
                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {showSearch && searchResults.length > 0 && (
                     <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 z-50 max-h-80 overflow-y-auto">
                        {searchResults.map(product => (
                           <div key={product._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer border-b">
                              <img 
                                 src={product.thumbnail || product.image || 'https://via.placeholder.com/50'} 
                                 alt={product.title}
                                 className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1" onClick={() => {
                                 setShowSearch(false)
                                 window.location.href = `/Product?id=${product._id}`
                              }}>
                                 <p className="font-semibold text-sm">{product.title}</p>
                                 <p className="text-orange-500 font-bold">₹{product.price}</p>
                              </div>
                              <button 
                                 onClick={() => addToCartFromSearch(product)}
                                 className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
                              >
                                 Add
                              </button>
                           </div>
                        ))}
                     </div>
                  )}
               </div>

               <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                  <span className="sr-only">Open main menu</span>
                  <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"></path>
                  </svg>
               </button>
               <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                  <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-white-100 rounded-lg bg-white-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-white-800 md:white:bg-white-900 dark:border-white-700">
                     <li className='text-[black]'><Link to={'/Cart'}>🛒 Cart ({cart.length})</Link></li>
                     <li className='text-[black]'><Link to={'/Product'}>Products</Link></li>
                     {user ? (
                        <>
                           <li className='text-[black]'><Link to={'/Dashboard'}>👤 My Account</Link></li>
                           <li className='cursor-pointer text-red-500' onClick={handleLogout}>Logout</li>
                        </>
                     ) : (
                        <>
                           <li className='text-[black]'> <Link to={'/Register'}>Register</Link></li>
                           <li className='text-[black]'><Link to={'/Login'}>Login</Link></li>
                        </>
                     )}
                  </ul>
               </div>
            </div>
         </nav>
      </div>
   )
}
