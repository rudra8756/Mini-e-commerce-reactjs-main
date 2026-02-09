import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home.jsx'
import Cart from './pages/Cart'
import Login from './pages/Login'
import { BrowserRouter, Route, Routes } from 'react-router'
import Register from './pages/Register.jsx'
import Product from './pages/Product.jsx'
import MainContext from './MainContext.jsx'

createRoot(document.getElementById('root')).render(

  <MainContext>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Cart' element={<Cart />} />
        <Route path='/Product' element={<Product />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Register' element={<Register />} />
      </Routes>

    </BrowserRouter>



  </MainContext>

)
