import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../MainContext'
import API from '../api'

export default function Dashboard() {
  const { user } = useContext(userContext)
  const [productsAdded, setProductsAdded] = useState([])

  useEffect(() => {
    if (user) {
      API.get("/user/products-added")
        .then(res => setProductsAdded(res.data.productsAdded))
        .catch(err => console.error(err))
    }
  }, [user])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <h2 className="text-xl mb-2">Products Added to Cart</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Product Name</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Price</th>
          </tr>
        </thead>
        <tbody>
          {productsAdded.map((item, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{item.productId.title}</td>
              <td className="py-2 px-4 border-b">{item.quantity}</td>
              <td className="py-2 px-4 border-b">₹ {item.productId.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
