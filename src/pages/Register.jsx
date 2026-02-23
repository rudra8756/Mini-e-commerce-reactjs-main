import React, { useState } from 'react'
import Header from '../common/Header'
import API from '../api'
import { useNavigate, Link } from 'react-router'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    setError("")

    try {
      await API.post("/auth/register", {
        name,
        email,
        password
      });

      alert("Registration Successful! Please login.")
      navigate('/login')
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header />

      <div className="flex items-center min-h-screen p-4 bg-gray-100 lg:justify-center">
        <div className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md">
          <div className="p-4 py-6 text-white bg-orange-500 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly">
            <div className="my-3 text-4xl font-bold tracking-wider text-center">ShopEasy</div>
            <p className="mt-6 font-normal text-center text-gray-200 md:mt-0">Join millions of happy shoppers!</p>
            <p className="flex flex-col items-center justify-center mt-10 text-center">
              <span>Already have an account?</span>
              <Link to="/login" className="underline">Login here</Link>
            </p>
            <p className="mt-6 text-sm text-center text-gray-300">Best deals & discounts</p>
          </div>
          
          <div className="p-5 bg-white md:flex-1">
            <h3 className="my-4 text-2xl font-semibold text-gray-700">Create Account</h3>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-1">
                <label htmlFor="name" className="text-sm font-semibold text-gray-500">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-orange-200"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex flex-col space-y-1">
                <label htmlFor="email" className="text-sm font-semibold text-gray-500">Email address</label>
                <input 
                  type="email" 
                  id="email"
                  className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-orange-200"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex flex-col space-y-1">
                <label htmlFor="password" className="text-sm font-semibold text-gray-500">Password</label>
                <input 
                  type="password" 
                  id="password"
                  className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-orange-200"
                  placeholder="Create a password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              
              <div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-orange-500 rounded-md shadow hover:bg-orange-600 focus:outline-none disabled:bg-gray-400"
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Already have an account? <Link to="/login" className="text-orange-500 hover:underline">Login here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
