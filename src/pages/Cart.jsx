 import React, { useContext, useEffect, useState } from 'react'
import Header from '../common/Header'
import { userContext } from '../MainContext'
import { IoAdd } from "react-icons/io5";
import { FiMinus } from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../api';
  
export default function Cart() {
    let { cart, setcart } = useContext(userContext)
    const [discountApplied, setDiscountApplied] = useState(false)
    const [cartData, setCartData] = useState(null)
    
    // Address form state
    const [shippingAddress, setShippingAddress] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        phone: ""
    })
    
    // Payment method state
    const [paymentMethod, setPaymentMethod] = useState("cod")

    const refreshCart = () => {
        API.get("/cart").then(res => {
            setCartData(res.data);
            setcart(res.data.products || []);
        }).catch(err => console.log(err));
    };

    useEffect(() => {
        refreshCart();
    }, []);

    console.log("CART DATA 👉", cartData);

    const validCart = (cartData?.products || []).filter(item => item.product);

    const getTotal = () => {
        return validCart.reduce(
            (total, item) => total + (item.product?.price || 0) * (item.quantity || 0),
            0
        );
    };

    const getDiscountPercentage = (totalPrice) => {
        if (totalPrice >= 1000) return 15
        if (totalPrice >= 500) return 10
        if (totalPrice >= 200) return 5
        return 0
    }

    const totalPrice = validCart.reduce((total, item) => total + (Number(item.quantity || 1) * Number(item.product?.price || 0)), 0)
    const discountPercentage = getDiscountPercentage(totalPrice)
    const discountAmount = discountApplied ? (totalPrice * discountPercentage / 100) : 0
    const shippingCost = totalPrice > 500 ? 0 : 100
    const finalTotal = totalPrice - discountAmount + shippingCost

    const handleApplyDiscount = () => {
        if (discountPercentage > 0) {
            setDiscountApplied(true)
            toast.success(`${discountPercentage}% discount applied!`)
        } else {
            toast.info('No discount available for this order amount')
        }
    }

    const handleCheckout = async () => {
        // Validate address
        if (!shippingAddress.name || !shippingAddress.address || !shippingAddress.city || !shippingAddress.pincode || !shippingAddress.phone) {
            toast.error("Please fill in all address fields");
            return;
        }
        
        // Validate phone (10 digits)
        if (!/^\d{10}$/.test(shippingAddress.phone)) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }

        try {
            const orderData = {
                shippingAddress: {
                    name: shippingAddress.name,
                    phone: shippingAddress.phone,
                    street: shippingAddress.address,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    zipCode: shippingAddress.pincode,
                    country: "India"
                },
                paymentMethod: paymentMethod
            };

            const response = await API.post("/orders", orderData);
            toast.success("Order placed successfully!");
            
            // Clear form after successful order
            setShippingAddress({
                name: "",
                address: "",
                city: "",
                state: "",
                pincode: "",
                phone: ""
            });
            setPaymentMethod("cod");
            
            refreshCart();
        } catch (error) {
            toast.error("Failed to place order: " + (error.response?.data?.message || error.message));
        }
    }

    return (

        <div>
            <Header />
            <ToastContainer />
            <div className="container justify-end mx-auto mt-10">
                <div className="flex shadow-md my-10">
                    <div className="w-3/4 bg-white px-10 py-10">
                        <div className="flex justify-between border-b pb-8">
                            <h1 className="font-semibold text-2xl">Shopping Cart</h1>
                            <h2 className="font-semibold text-2xl">{validCart.length} Items</h2>
                        </div>
                        <div className="flex mt-10 mb-5">
                            <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">Product Details</h3>
                            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 ">Quantity</h3>
                            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 ">Price</h3>
                            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 ">Total</h3>
                        </div>
                        {validCart.length >= 1 ?
                            validCart.map((item, index) => {
                                return (
                                    <CartRow key={index} data={item} discountApplied={discountApplied} discountPercentage={discountPercentage} refreshCart={refreshCart} />
                                )
                            })
                            :
                            <div className='cart text-center py-8 text-gray-500'>No items in cart</div>
                        }
                        {validCart.length >= 1 && (
                            <div className="text-right mt-6 text-xl font-bold">
                                Total Amount: ₹ {getTotal()}
                            </div>
                        )}
                    </div>

                    <div id="summary" className="w-1/4 px-8 py-10">
                        <h1 className="font-semibold text-2xl border-b pb-8">Order Summary</h1>
                        <div className="flex justify-between mt-10 mb-5">
                            <span className="font-semibold text-sm uppercase">
                                Items ({validCart.length})
                            </span>
                            <span className="font-semibold text-sm">Rs. {totalPrice}</span>
                        </div>

                        {discountApplied && discountAmount > 0 && (
                            <div className="flex justify-between mb-5 text-green-600">
                                <span className="font-semibold text-sm uppercase">Discount ({discountPercentage}%)</span>
                                <span className="font-semibold text-sm">-Rs. {discountAmount.toFixed(2)}</span>
                            </div>
                        )}

                        <div>
                            <label className="font-medium inline-block mb-3 text-sm uppercase">Shipping</label>
                            <select className="block p-2 text-gray-600 w-full text-sm">
                                <option>{shippingCost === 0 ? 'Free shipping' : `Standard shipping - Rs. ${shippingCost}`}</option>
                            </select>
                        </div>

                        <div className="py-10">
                            <label htmlFor="promo" className="font-semibold inline-block mb-3 text-sm uppercase">Promo Code</label>
                            <input type="text" id="promo" placeholder="Enter your code" className="p-2 text-sm w-full" />
                        </div>

                        <button
                            onClick={handleApplyDiscount}
                            className="bg-red-500 hover:bg-red-600 px-5 py-2 text-sm text-white uppercase mb-4"
                        >
                            Apply Discount
                        </button>

                        {/* Shipping Address Section */}
                        <div className="border-t mt-6 pt-4">
                            <h3 className="font-semibold text-lg mb-4">Shipping Address</h3>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs uppercase font-semibold">Full Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter your full name"
                                        className="w-full p-2 border text-sm"
                                        value={shippingAddress.name}
                                        onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-xs uppercase font-semibold">Address</label>
                                    <textarea 
                                        placeholder="Enter your full address"
                                        className="w-full p-2 border text-sm"
                                        rows="2"
                                        value={shippingAddress.address}
                                        onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs uppercase font-semibold">City</label>
                                        <input 
                                            type="text" 
                                            placeholder="City"
                                            className="w-full p-2 border text-sm"
                                            value={shippingAddress.city}
                                            onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase font-semibold">State</label>
                                        <input 
                                            type="text" 
                                            placeholder="State"
                                            className="w-full p-2 border text-sm"
                                            value={shippingAddress.state}
                                            onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs uppercase font-semibold">Pincode</label>
                                        <input 
                                            type="text" 
                                            placeholder="6-digit pincode"
                                            className="w-full p-2 border text-sm"
                                            value={shippingAddress.pincode}
                                            onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase font-semibold">Phone</label>
                                        <input 
                                            type="tel" 
                                            placeholder="10-digit phone"
                                            className="w-full p-2 border text-sm"
                                            value={shippingAddress.phone}
                                            onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Section */}
                        <div className="border-t mt-6 pt-4">
                            <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
                            
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="cod"
                                        checked={paymentMethod === "cod"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm">Cash on Delivery (COD)</span>
                                </label>
                                
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="card"
                                        checked={paymentMethod === "card"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm">Credit/Debit Card</span>
                                </label>
                                
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="upi"
                                        checked={paymentMethod === "upi"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm">UPI</span>
                                </label>
                            </div>
                            
                            {paymentMethod !== "cod" && (
                                <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
                                    <p>Payment will be processed securely. You will receive payment details after placing the order.</p>
                                </div>
                            )}
                        </div>

                        <div className="border-t mt-8">
                            <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                                <span>Total cost</span>
                                <span>Rs. {finalTotal.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full cursor-pointer"
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function CartRow({ data, discountApplied, discountPercentage, refreshCart }) {
    let { cart, setcart } = useContext(userContext)
    let { quantity } = data
    let [myqty, setqty] = useState(quantity)

    const removeFromCart = async () => {
        try {
            await API.delete(`/cart/${data.product._id}`);
            refreshCart();
            toast.success("Item removed from cart");
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    const updateQuantity = async (newQty) => {
        try {
            await API.put(`/cart/${data.product._id}`, { quantity: newQty });
            refreshCart();
        } catch (error) {
            toast.error("Failed to update quantity");
        }
    };

    useEffect(() => {
        if (myqty !== quantity) {
            updateQuantity(myqty);
        }
    }, [myqty])

    const product = data.product;
    const discountedPrice = discountApplied ? product.price * (1 - discountPercentage / 100) : product.price
    const totalPrice = myqty * discountedPrice

    return (
        <div className='grid grid-cols-6 hover:bg-[#0000001d] p-3'>
            <div className='col-span-3 flex-col gap-3 lg:flex-row' >
                    <figure className='w-[20%]'>
                        <img src={product.thumbnail} alt="" className='w-full' />
                    </figure>
                <div className='flex flex-col gap-3'>
                    <p className='font-bold text-[14px]'>{product.title}</p>
                    {discountApplied && discountPercentage > 0 && (
                        <span className='text-green-600 text-xs font-semibold'>
                            {discountPercentage}% OFF
                        </span>
                    )}
                </div>
            </div>
            <div>
                <div className='flex items-center gap-2'>
                    <span className='minus'><FiMinus onClick={() => setqty(myqty > 1 ? myqty - 1 : 1)} /></span>
                    <div className='px-2 py-1 bg-[white] border-1 border-[#0000006d]'>
                        <span>{myqty}</span>
                    </div>
                    <span className='plus'><IoAdd onClick={() => setqty(myqty < 10 ? myqty + 1 : myqty)} /></span>
                </div>
            </div>
            <div>
                <div className='text-center lg:text-start'>
                    {discountApplied && discountPercentage > 0 ? (
                        <div>
                            <p className='line-through text-gray-400 text-sm'>Rs.{data.product.price}</p>
                            <p className='text-green-600 font-semibold'>Rs.{discountedPrice.toFixed(2)}</p>
                        </div>
                    ) : (
                        <p>Rs.{data.product.price}</p>
                    )}
                </div>
            </div>
            <div>
                <p className='text-center lg:text-start font-semibold'>Rs.{totalPrice.toFixed(2)}</p>
            </div>
        </div>
    )
}
