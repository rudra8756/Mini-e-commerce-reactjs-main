import React, { useContext, useEffect, useState } from 'react'
import Header from '../common/Header'
import { userContext } from '../MainContext';
import { useNavigate, Link } from 'react-router';
import API from '../api';

export default function Login() {
   let navigate = useNavigate()
   let { user, setuser } = useContext(userContext)
   
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState("")

   const handleLogin = async (e) => {
      e.preventDefault()
      setLoading(true)
      setError("")
      
      try {
         const response = await API.post("/auth/login", {
            email,
            password
         });
         
         if (response.data.token && response.data.user) {
            // Store for compatibility
            localStorage.setItem("USER_TOKEN", response.data.token)
            localStorage.setItem("USER_ID", response.data.user._id)
            localStorage.setItem("USER_NAME", response.data.user.name)
            // Store for MainContext
            localStorage.setItem("TOKEN", response.data.token)
            localStorage.setItem("USER", JSON.stringify(response.data.user))
            
            setuser(response.data.user)
            alert("Login Successful!")
            navigate('/')
         }
      } catch (err) {
         setError(err.response?.data?.message || "Login failed. Please check your credentials.")
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      if (user) {
         navigate('/')
      }
   }, [user, navigate])

   return (
      <div>
         <Header />

         <div className="flex items-center min-h-screen p-4 bg-gray-100 lg:justify-center">
            <div className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md">
               <div className="p-4 py-6 text-white bg-orange-500 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly">
                  <div className="my-3 text-4xl font-bold tracking-wider text-center">ShopEasy</div>
                  <p className="mt-6 font-normal text-center text-gray-200 md:mt-0">Your one-stop shop for everything!</p>
                  <p className="flex flex-col items-center justify-center mt-10 text-center">
                     <span>Don't have an account?</span>
                     <Link to="/register" className="underline">Get Started!</Link>
                  </p>
                  <p className="mt-6 text-sm text-center text-gray-300">Best prices guaranteed</p>
               </div>
               <div className="p-5 bg-white md:flex-1">
                  <h3 className="my-4 text-2xl font-semibold text-gray-700">Account Login</h3>
                  
                  {error && (
                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                     </div>
                  )}
                  
                  <form className="flex flex-col space-y-5" onSubmit={handleLogin}>
                     <div className="flex flex-col space-y-1">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-500">Email address</label>
                        <input 
                           type="email" 
                           id="email" 
                           name="email" 
                           className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-orange-200"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           required
                        />
                     </div>
                     <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                           <label htmlFor="password" className="text-sm font-semibold text-gray-500">Password</label>
                        </div>
                        <input 
                           type="password" 
                           name="password" 
                           id="password" 
                           className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-orange-200"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           required
                        />
                     </div>
                     <div>
                        <button 
                           type="submit" 
                           disabled={loading}
                           className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-orange-500 rounded-md shadow hover:bg-orange-600 focus:outline-none disabled:bg-gray-400"
                        >
                           {loading ? "Logging in..." : "Log in"}
                        </button>
                     </div>
                  </form>
                  
                  <div className="mt-4 text-center text-sm text-gray-500">
                     <p>Don't have an account? <Link to="/register" className="text-orange-500 hover:underline">Register here</Link></p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
