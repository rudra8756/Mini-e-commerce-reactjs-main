import React, { useContext } from 'react'
import { Link } from 'react-router'
import { cartContext } from '../MainContext'

export default function Header() {
   let { cart } = useContext(cartContext)
   let { token, settoken, user, setuser } = useContext(cartContext)
   // console.log(obj)
   return (
      <div className=" sticky top-0 z-[999] shadow-lg ">
         <nav className="bg-white border-white-200 dark:bg-white-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 bg-white ">
               <div className='align-left flex gap-3 '>
                  <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo"></img><span className="self-center text-2xl  font-bold whitespace-nowrap dark:text-black">KadriBazar</span>
               </div>
               <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                  <span className="sr-only">Open main menu</span>
                  <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"></path>
                  </svg>
               </button>
               <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                  <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-white-100 rounded-lg bg-white-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-white-800 md:white:bg-white-900 dark:border-white-700">
                     <li className='text-[black]'><Link to={'/Cart'}>Cart ({cart.length})</Link></li>
                     <li className='text-[black]'><Link to={'/Product'}>Product</Link></li>
                     {user ? <li className='cursor-pointer' onClick={() => {
                        settoken('')
                        setuser(null)
                     }}>LogOut</li>
                        :
                        <>
                           <li className='text-[black]'> <Link to={'/Register'}>Register</Link></li>
                           <li className='text-[black]'><Link to={'/Login'}>Login</Link></li>
                        </>}

                  </ul>
               </div>
            </div>
         </nav>
      </div>
   )
}
