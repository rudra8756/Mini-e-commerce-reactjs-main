import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home.jsx'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import { BrowserRouter, Route, Routes } from 'react-router'
import Register from './pages/Register.jsx'
import Product from './pages/Product.jsx'
import Dashboard from './pages/Dashboard.jsx'
import MainContext from './MainContext.jsx'
import { CheckoutProvider } from './CheckoutContext.jsx'
import AddressPage from './pages/AddressPage.jsx'
import OrderSummaryPage from './pages/OrderSummaryPage.jsx'
import PaymentPage from './pages/PaymentPage.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'

createRoot(document.getElementById('root')).render(

  <MainContext>
    <CheckoutProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Cart' element={<Cart />} />
          <Route path='/Checkout' element={<Checkout />} />
          <Route path='/checkout/address' element={<AddressPage />} />
          <Route path='/checkout/summary' element={<OrderSummaryPage />} />
          <Route path='/checkout/payment' element={<PaymentPage />} />
          <Route path='/order-success' element={<OrderSuccess />} />
          <Route path='/Product' element={<Product />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Dashboard' element={<Dashboard />} />
        </Routes>

      </BrowserRouter>
    </CheckoutProvider>

  </MainContext>

)
