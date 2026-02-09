import React, { useState } from 'react'
import Header from '../common/Header'
import API from '../api'   // 🔥 axios instance

export default function Register() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/register", {
        name,
        email,
        password
      });

      alert("User Registered Successfully")
      setName("")
      setEmail("")
      setPassword("")

    } catch (error) {
      alert(error.response?.data?.msg || "Error")
    }
  }

  return (
    <div>
      <Header />

      <div className='pt-12'>
        <div className="container mx-auto">
          <div className="w-5/6 lg:w-1/2 mx-auto bg-white rounded border">

            <div className="py-4 px-8 text-black text-xl font-bold border-b capitalize">
              Register for a free account
            </div>

            <form className="py-4 px-8" onSubmit={handleSubmit}>

              {/* NAME */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Name
                </label>

                <input
                  className="appearance-none border rounded w-full py-2 px-3"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Email Address
                </label>

                <input
                  className="appearance-none border rounded w-full py-2 px-3"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Password
                </label>

                <input
                  className="appearance-none border rounded w-full py-2 px-3"
                  type="password"
                  placeholder="Your secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <p className="text-xs mt-1">
                  At least 6 characters
                </p>
              </div>

              <div className="flex items-center justify-between mt-8">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  type="submit"
                >
                  Sign Up
                </button>
              </div>

            </form>

          </div>

          <footer className="w-full py-8">
            <div className="container mx-auto text-center px-8">
              <p className="mb-2 text-sm">
                This is a product of <span className="font-bold">Your Company</span>
              </p>
            </div>
          </footer>

        </div>
      </div>
    </div>
  )
}
