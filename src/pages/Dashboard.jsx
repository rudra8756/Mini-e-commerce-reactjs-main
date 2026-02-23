import React, { useContext, useEffect, useState } from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import { userContext } from '../MainContext'
import API from '../api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Dashboard() {
  const { user } = useContext(userContext)
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('orders')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchOrders = () => {
    // Get user ID from Firebase or localStorage
    const userId = user?.uid || user?.userId || localStorage.getItem("USER_ID") || "guest"
    
    API.get(`/orders?userId=${userId}`)
      .then(res => {
        if (res.data && res.data.orders) {
          setOrders(res.data.orders)
        } else if (Array.isArray(res.data)) {
          setOrders(res.data)
        }
      })
      .catch(err => {
        console.error("Error fetching orders:", err)
        toast.error("Failed to load orders")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const getStatusColor = (status) => {
    const colors = {
      'placed': 'bg-blue-500',
      'confirmed': 'bg-blue-600',
      'processing': 'bg-yellow-500',
      'shipped': 'bg-purple-500',
      'out_for_delivery': 'bg-orange-500',
      'delivered': 'bg-green-500',
      'cancelled': 'bg-red-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  const getStatusIcon = (status) => {
    const icons = {
      'placed': '📦',
      'confirmed': '✅',
      'processing': '⚙️',
      'shipped': '🚚',
      'out_for_delivery': '🏃',
      'delivered': '🎉',
      'cancelled': '❌'
    }
    return icons[status] || '📋'
  }

  if (!user) {
    return (
      <div>
        <Header />
        <div className="container mx-auto p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Please Login</h1>
          <p className="text-gray-600 mb-4">You need to login to view your dashboard</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Header />
      
      <div className="container mx-auto p-4">
        {/* User Profile Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-500 text-3xl font-bold">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.displayName || 'User'}</h1>
              <p className="text-blue-100">{user.email}</p>
              <p className="text-sm text-blue-200">Member since 2024</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{orders.length}</div>
            <div className="text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {orders.filter(o => o.orderStatus === 'delivered').length}
            </div>
            <div className="text-gray-600">Delivered</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {orders.filter(o => o.orderStatus === 'processing' || o.orderStatus === 'shipped').length}
            </div>
            <div className="text-gray-600">In Transit</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              ₹{orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)}
            </div>
            <div className="text-gray-600">Total Spent</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'orders' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            📦 My Orders
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'profile' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            👤 Profile
          </button>
        </div>

        {/* Orders List */}
        {activeTab === 'orders' && (
          <div>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
                <a href="/" className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg">Shop Now</a>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-gray-50 p-4 flex flex-wrap justify-between items-center gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-mono font-semibold">{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="font-bold text-lg">₹{order.totalAmount}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-white font-semibold ${getStatusColor(order.orderStatus)}`}>
                        {getStatusIcon(order.orderStatus)} {order.orderStatus?.toUpperCase()}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-4">
                      <h3 className="font-semibold mb-3">Order Items ({order.items?.length || 0})</h3>
                      <div className="space-y-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex gap-4 items-center border-b pb-3 last:border-0">
                            <img
                              src={item.thumbnail || item.product?.thumbnail || 'https://via.placeholder.com/80'}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold">{item.title || item.product?.title}</h4>
                              <p className="text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                            </div>
                            <div className="font-bold">₹{(item.price || 0) * (item.quantity || 0)}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    {order.shippingAddress && (
                      <div className="bg-gray-50 p-4">
                        <h4 className="font-semibold mb-2">Delivery Address</h4>
                        <p className="text-gray-600">
                          {order.shippingAddress.name}<br />
                          {order.shippingAddress.street}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                        </p>
                      </div>
                    )}

                    {/* Order Timeline */}
                    <div className="p-4 border-t">
                      <h4 className="font-semibold mb-3">Order Timeline</h4>
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'].map((status, idx) => {
                          const orderStatusIndex = ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'].indexOf(order.orderStatus)
                          const isCompleted = idx <= orderStatusIndex
                          const isCurrent = idx === orderStatusIndex
                          
                          return (
                            <div key={status} className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                                {idx + 1}
                              </div>
                              <div className={`ml-2 text-sm whitespace-nowrap ${isCurrent ? 'font-bold text-blue-500' : isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
                                {status.replace('_', ' ')}
                              </div>
                              {idx < 5 && (
                                <div className={`w-8 h-1 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-500">Name</label>
                <p className="font-semibold">{user.displayName || 'Not set'}</p>
              </div>
              <div>
                <label className="text-gray-500">Email</label>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div>
                <label className="text-gray-500">Phone</label>
                <p className="font-semibold">{user.phoneNumber || 'Not set'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <ToastContainer />
    </div>
  )
}
