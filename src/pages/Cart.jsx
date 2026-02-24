import React, { useContext, useEffect, useState } from 'react'
import Header from '../common/Header'
import { userContext } from '../MainContext'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../api';
import { useNavigate } from 'react-router';
  
export default function Cart() {
    const navigate = useNavigate();
    let { cart, setcart, user } = useContext(userContext)
    const [discountApplied, setDiscountApplied] = useState(false)
    const [cartData, setCartData] = useState(null)
    
    const refreshCart = () => {
        let userId = user?._id || localStorage.getItem("USER_ID");
        if (!userId) {
            userId = localStorage.getItem("GUEST_ID") || "guest";
        }
        API.get(`/cart?userId=${userId}`).then(res => {
            setCartData(res.data);
            setcart(res.data.products || []);
        }).catch(err => console.log(err));
    };

    useEffect(() => {
        refreshCart();
    }, []);

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

    const handleProceedToCheckout = () => {
        navigate('/Checkout');
    }

    return (
        <div>
            <Header />
            <ToastContainer />
            <div className="container mx-auto mt-10 p-4">
                <div className="flex flex-col lg:flex-row shadow-md my-10">
                    <div className="lg:w-3/4 bg-white px-10 py-10">
                        <div className="flex justify-between border-b pb-8">
                            <h1 className="font-semibold text-2xl">Shopping Cart</h1>
                            <h2 className="font-semibold text-2xl">{validCart.length} Items</h2>
                        </div>
                        <div className="flex mt-10 mb-5">
                            <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">Product Details</h3>
                            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Quantity</h3>
                            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Price</h3>
                            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Total</h3>
                        </div>
                        {validCart.length >= 1 ? (
                            validCart.map((item, index) => (
                                <CartRow key={index} data={item} discountApplied={discountApplied} discountPercentage={discountPercentage} refreshCart={refreshCart} />
                            ))
                        ) : (
                            <div className="cart text-center py-8 text-gray-500">No items in cart</div>
                        )}
                        {validCart.length >= 1 && (
                            <div className="text-right mt-6 text-xl font-bold">
                                Total Amount: ₹ {getTotal()}
                            </div>
                        )}
                    </div>

                    <div id="summary" className="lg:w-1/4 px-8 py-10 bg-gray-50">
                        <h1 className="font-semibold text-2xl border-b pb-8">Order Summary</h1>
                        <div className="flex justify-between mt-10 mb-5">
                            <span className="font-semibold text-sm uppercase">Items ({validCart.length})</span>
                            <span className="font-semibold text-sm">Rs. {totalPrice}</span>
                        </div>

                        {discountApplied && discountAmount > 0 && (
                            <div className="flex justify-between mb-5 text-green-600">
                                <span className="font-semibold text-sm uppercase">Discount ({discountPercentage}%)</span>
                                <span className="font-semibold text-sm">-Rs. {discountAmount.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="py-10">
                            <label htmlFor="promo" className="font-semibold inline-block mb-3 text-sm uppercase">Promo Code</label>
                            <input type="text" id="promo" placeholder="Enter your code" className="p-2 text-sm w-full border rounded" />
                        </div>

                        <button
                            onClick={handleApplyDiscount}
                            className="bg-red-500 hover:bg-red-600 px-5 py-2 text-sm text-white uppercase mb-4 w-full rounded"
                        >
                            Apply Discount
                        </button>

                        <div className="border-t mt-6 pt-4">
                            <div className="flex justify-between py-4 text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold">Rs. {totalPrice}</span>
                            </div>
                            <div className="flex justify-between py-4 text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-semibold">{shippingCost === 0 ? <span className="text-green-600">FREE</span> : `Rs. ${shippingCost}`}</span>
                            </div>
                            {discountApplied && discountAmount > 0 && (
                                <div className="flex justify-between py-4 text-sm text-green-600">
                                    <span>Discount</span>
                                    <span>-Rs. {discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        <div className="border-t mt-4 pt-4">
                            <div className="flex font-semibold justify-between py-4 text-lg">
                                <span>Total</span>
                                <span>Rs. {finalTotal.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleProceedToCheckout}
                                disabled={validCart.length === 0}
                                className="bg-blue-600 font-semibold hover:bg-blue-700 py-3 text-sm text-white uppercase w-full rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function CartRow({ data, discountApplied, discountPercentage, refreshCart }) {
    let { setcart, user } = useContext(userContext)
    let { quantity } = data
    let [myqty, setqty] = useState(quantity)

    const getUserId = () => {
        let userId = user?._id || localStorage.getItem("USER_ID");
        if (!userId) {
            userId = localStorage.getItem("GUEST_ID") || "guest";
        }
        return userId;
    };

    const removeFromCart = async () => {
        try {
            const userId = getUserId();
            await API.delete(`/cart/${data.product._id}?userId=${userId}`);
            refreshCart();
            toast.success("Item removed from cart");
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    const updateQuantity = async (newQty) => {
        try {
            const userId = getUserId();
            await API.put(`/cart/${data.product._id}?userId=${userId}`, { quantity: newQty });
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
        <div className="grid grid-cols-6 hover:bg-gray-50 p-3 border-b">
            <div className="col-span-3 flex gap-3">
                <figure className="w-20">
                    <img src={product.thumbnail} alt="" className="w-full object-cover" />
                </figure>
                <div className="flex flex-col gap-1">
                    <p className="font-bold text-sm">{product.title}</p>
                    {discountApplied && discountPercentage > 0 && (
                        <span className="text-green-600 text-xs font-semibold">
                            {discountPercentage}% OFF
                        </span>
                    )}
                    <button onClick={removeFromCart} className="text-red-500 text-xs text-left">Remove</button>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <button onClick={() => setqty(myqty > 1 ? myqty - 1 : 1)} className="border p-1 rounded">-</button>
                    <span className="px-2">{myqty}</span>
                    <button onClick={() => setqty(myqty < 10 ? myqty + 1 : myqty)} className="border p-1 rounded">+</button>
                </div>
            </div>
            <div className="text-center flex items-center justify-center">
                {discountApplied && discountPercentage > 0 ? (
                    <div>
                        <p className="line-through text-gray-400 text-sm">Rs.{product.price}</p>
                        <p className="text-green-600 font-semibold">Rs.{discountedPrice.toFixed(2)}</p>
                    </div>
                ) : (
                    <p>Rs.{product.price}</p>
                )}
            </div>
            <div className="text-center flex items-center justify-center font-semibold">
                Rs.{totalPrice.toFixed(2)}
            </div>
        </div>
    )
}
