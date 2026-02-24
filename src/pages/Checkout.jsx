import React, { useContext, useEffect, useState } from 'react'
import Header from '../common/Header'
import { userContext } from '../MainContext'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../api';
import { useNavigate } from 'react-router';

// Progress Step Component
function ProgressStep({ step, currentStep, title, icon }) {
    const isCompleted = currentStep > step;
    const isCurrent = currentStep === step;
    
    return (
        <div className="flex items-center">
            <div className={`flex items-center ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isCompleted ? 'bg-green-600 text-white' : 
                    isCurrent ? 'bg-blue-600 text-white' : 
                    'bg-gray-200'
                }`}>
                    {isCompleted ? '✓' : icon}
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:inline">{title}</span>
            </div>
            {step < 4 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`}></div>
            )}
        </div>
    )
}

// Step 1: Cart Summary
function CartStep({ cartData, refreshCart, discountApplied, setDiscountApplied, discountPercentage, onContinue, getTotal, validCart, totalPrice, discountAmount, shippingCost, finalTotal }) {
    const getUserId = () => {
        let userId = localStorage.getItem("USER_ID") || localStorage.getItem("GUEST_ID") || "guest";
        return userId;
    };

    const removeFromCart = async (productId) => {
        try {
            const userId = getUserId();
            await API.delete(`/cart/${productId}?userId=${userId}`);
            refreshCart();
            toast.success("Item removed from cart");
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    const updateQuantity = async (productId, newQty) => {
        try {
            const userId = getUserId();
            await API.put(`/cart/${productId}?userId=${userId}`, { quantity: newQty });
            refreshCart();
        } catch (error) {
            toast.error("Failed to update quantity");
        }
    };

    const handleApplyDiscount = () => {
        if (discountPercentage > 0) {
            setDiscountApplied(true)
            toast.success(`${discountPercentage}% discount applied!`)
        } else {
            toast.info('No discount available for this order amount')
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Side - Cart Items */}
            <div className="lg:w-2/3">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h2 className="text-xl font-semibold mb-4">Shopping Cart ({validCart.length} items)</h2>
                    
                    {validCart.length >= 1 ? (
                        validCart.map((item, index) => {
                            const product = item.product;
                            const discountedPrice = discountApplied ? product.price * (1 - discountPercentage / 100) : product.price;
                            return (
                                <div key={index} className="flex gap-4 py-4 border-b last:border-b-0">
                                    <div className="w-20 h-20 flex-shrink-0">
                                        <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover rounded" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-sm">{product.title}</h3>
                                        <p className="text-gray-500 text-sm">₹{discountedPrice.toFixed(2)}</p>
                                        {discountApplied && discountPercentage > 0 && (
                                            <span className="text-green-600 text-xs font-semibold">{discountPercentage}% OFF</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => updateQuantity(product._id, item.quantity > 1 ? item.quantity - 1 : 1)}
                                            className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-50"
                                        >-</button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(product._id, item.quantity < 10 ? item.quantity + 1 : item.quantity)}
                                            className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-50"
                                        >+</button>
                                    </div>
                                    <div className="text-right min-w-[80px]">
                                        <p className="font-semibold">₹{(discountedPrice * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(product._id)}
                                        className="text-red-500 text-sm hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )
                        })
                    ) : (
                        <div className="text-center py-8 text-gray-500">Your cart is empty</div>
                    )}
                </div>
            </div>

            {/* Right Side - Order Summary */}
            <div className="lg:w-1/3">
                <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-4">
                    <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                    
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal ({validCart.length} items)</span>
                            <span>₹{totalPrice.toFixed(2)}</span>
                        </div>
                        
                        {discountApplied && discountAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount ({discountPercentage}%)</span>
                                <span>-₹{discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span>{shippingCost === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingCost}`}</span>
                        </div>
                        
                        <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span>₹{finalTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    {!discountApplied && (
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Enter promo code" 
                                    className="flex-1 border rounded px-3 py-2 text-sm"
                                />
                                <button 
                                    onClick={handleApplyDiscount}
                                    className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
                                >
                                    Apply
                                </button>
                            </div>
                            {discountPercentage > 0 && (
                                <p className="text-xs text-green-600 mt-2">
                                    🎉 Get {discountPercentage}% discount on orders above ₹{discountPercentage === 15 ? '1000' : discountPercentage === 10 ? '500' : '200'}!
                                </p>
                            )}
                        </div>
                    )}

                    <button 
                        onClick={onContinue}
                        disabled={validCart.length === 0}
                        className="w-full bg-blue-600 text-white py-3 rounded font-semibold mt-4 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Continue to Delivery Address
                    </button>
                </div>
            </div>
        </div>
    )
}

// Step 2: Delivery Address
function AddressStep({ shippingAddress, setShippingAddress, onContinue, onBack, getTotal, validCart, totalPrice, discountApplied, discountPercentage, discountAmount, shippingCost, finalTotal }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!shippingAddress.name || !shippingAddress.address || !shippingAddress.city || !shippingAddress.pincode || !shippingAddress.phone) {
            toast.error("Please fill in all address fields");
            return;
        }
        
        if (!/^\d{10}$/.test(shippingAddress.phone)) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }
        
        onContinue();
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Side - Address Form */}
            <div className="lg:w-2/3">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold mb-6">Delivery Address</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name *</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter your full name"
                                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={shippingAddress.name}
                                    onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                                <input 
                                    type="tel" 
                                    placeholder="10-digit mobile number"
                                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={shippingAddress.phone}
                                    onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                                    maxLength={10}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Address *</label>
                            <textarea 
                                placeholder="Flat No., Building Name, Street, Area"
                                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="2"
                                value={shippingAddress.address}
                                onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium mb-1">City *</label>
                                <input 
                                    type="text" 
                                    placeholder="City"
                                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={shippingAddress.city}
                                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium mb-1">State</label>
                                <input 
                                    type="text" 
                                    placeholder="State"
                                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={shippingAddress.state}
                                    onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium mb-1">Pincode *</label>
                                <input 
                                    type="text" 
                                    placeholder="6-digit pincode"
                                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={shippingAddress.pincode}
                                    onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium mb-1">Landmark</label>
                                <input 
                                    type="text" 
                                    placeholder="Nearby landmark"
                                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-4 pt-4">
                            <button 
                                type="button"
                                onClick={onBack}
                                className="px-6 py-2 border rounded font-medium hover:bg-gray-50"
                            >
                                ← Back to Cart
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
                            >
                                Continue to Payment
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side - Order Summary */}
            <div className="lg:w-1/3">
                <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-4">
                    <h3 className="font-semibold text-lg mb-4">Price Details</h3>
                    
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal ({validCart.length} items)</span>
                            <span>₹{totalPrice.toFixed(2)}</span>
                        </div>
                        
                        {discountApplied && discountAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount ({discountPercentage}%)</span>
                                <span>-₹{discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span>{shippingCost === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingCost}`}</span>
                        </div>
                        
                        <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span>₹{finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Step 3: Payment
function PaymentStep({ paymentMethod, setPaymentMethod, cardDetails, setCardDetails, upiId, setUpiId, selectedBank, setSelectedBank, onContinue, onBack, validCart, finalTotal, shippingAddress }) {
    const validatePaymentDetails = () => {
        if (paymentMethod === "card") {
            if (!cardDetails.cardNumber || cardDetails.cardNumber.length < 16) {
                toast.error("Please enter valid 16-digit card number");
                return false;
            }
            if (!cardDetails.expiry || cardDetails.expiry.length < 5) {
                toast.error("Please enter valid expiry date (MM/YY)");
                return false;
            }
            if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
                toast.error("Please enter valid CVV");
                return false;
            }
            if (!cardDetails.nameOnCard) {
                toast.error("Please enter name on card");
                return false;
            }
        } else if (paymentMethod === "upi") {
            if (!upiId || !upiId.includes('@')) {
                toast.error("Please enter valid UPI ID (e.g., mobile@upi)");
                return false;
            }
        } else if (paymentMethod === "netbanking") {
            if (!selectedBank) {
                toast.error("Please select your bank");
                return false;
            }
        }
        return true;
    };

    const handleContinue = (e) => {
        e.preventDefault();
        if (!validatePaymentDetails()) {
            return;
        }
        onContinue();
    };

    const banks = [
        { id: 'sbi', name: 'State Bank of India' },
        { id: 'hdfc', name: 'HDFC Bank' },
        { id: 'icici', name: 'ICICI Bank' },
        { id: 'axis', name: 'Axis Bank' },
        { id: 'kotak', name: 'Kotak Bank' },
        { id: 'yes', name: 'Yes Bank' },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Side - Payment Options */}
            <div className="lg:w-2/3">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                    
                    {/* Delivery Address Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-green-600">✓</span>
                            <span className="font-medium text-sm">Delivery Address</span>
                        </div>
                        <p className="text-sm text-gray-600">
                            {shippingAddress.name}, {shippingAddress.address}, {shippingAddress.city} - {shippingAddress.pincode}
                        </p>
                    </div>
                    
                    <form onSubmit={handleContinue} className="space-y-4">
                        {/* Payment Options */}
                        <div className="space-y-3">
                            <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-blue-500 ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="cod"
                                        checked={paymentMethod === "cod"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <span className="font-medium">💵 Cash on Delivery</span>
                                </div>
                                <span className="text-green-600 text-sm">No Extra Charges</span>
                            </label>
                            
                            <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-blue-500 ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="upi"
                                        checked={paymentMethod === "upi"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <span className="font-medium">📱 UPI</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-xs bg-blue-100 px-2 py-1 rounded">GPay</span>
                                    <span className="text-xs bg-purple-100 px-2 py-1 rounded">PhonePe</span>
                                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Paytm</span>
                                </div>
                            </label>
                            
                            <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-blue-500 ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="card"
                                        checked={paymentMethod === "card"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <span className="font-medium">💳 Credit / Debit Card</span>
                                </div>
                                <div className="flex gap-1">
                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">Visa</span>
                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">Master</span>
                                </div>
                            </label>
                            
                            <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-blue-500 ${paymentMethod === 'netbanking' ? 'border-blue-500 bg-blue-50' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="netbanking"
                                        checked={paymentMethod === "netbanking"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <span className="font-medium">🏦 Net Banking</span>
                                </div>
                            </label>
                        </div>
                        
                        {/* Payment Details Forms */}
                        {paymentMethod === "card" && (
                            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                                <h4 className="font-semibold">Card Details</h4>
                                <input 
                                    type="text" 
                                    placeholder="Card Number (16 digits)"
                                    className="w-full border rounded px-4 py-2 text-sm"
                                    maxLength={16}
                                    value={cardDetails.cardNumber}
                                    onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value.replace(/\D/g, '')})}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input 
                                        type="text" 
                                        placeholder="MM/YY"
                                        className="w-full border rounded px-4 py-2 text-sm"
                                        maxLength={5}
                                        value={cardDetails.expiry}
                                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                                    />
                                    <input 
                                        type="password" 
                                        placeholder="CVV"
                                        className="w-full border rounded px-4 py-2 text-sm"
                                        maxLength={3}
                                        value={cardDetails.cvv}
                                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                                    />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Name on Card"
                                    className="w-full border rounded px-4 py-2 text-sm"
                                    value={cardDetails.nameOnCard}
                                    onChange={(e) => setCardDetails({...cardDetails, nameOnCard: e.target.value})}
                                />
                                <p className="text-xs text-green-600">🔒 Your payment is secure</p>
                            </div>
                        )}
                        
                        {paymentMethod === "upi" && (
                            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                                <h4 className="font-semibold">UPI Payment</h4>
                                <input 
                                    type="text" 
                                    placeholder="UPI ID (e.g., mobile@upi)"
                                    className="w-full border rounded px-4 py-2 text-sm"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                />
                                <p className="text-xs text-gray-500">Pay using GPay, PhonePe, Paytm, etc.</p>
                            </div>
                        )}
                        
                        {paymentMethod === "netbanking" && (
                            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                                <h4 className="font-semibold">Select Your Bank</h4>
                                <select 
                                    className="w-full border rounded px-4 py-2 text-sm"
                                    value={selectedBank}
                                    onChange={(e) => setSelectedBank(e.target.value)}
                                >
                                    <option value="">Select Bank</option>
                                    {banks.map(bank => (
                                        <option key={bank.id} value={bank.id}>🏦 {bank.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        
                        {paymentMethod === "cod" && (
                            <div className="p-4 bg-green-50 rounded-lg">
                                <p className="text-green-700 text-sm">
                                    ✅ Pay ₹{finalTotal.toFixed(2)} in cash when your order is delivered to your doorstep.
                                </p>
                            </div>
                        )}
                        
                        <div className="flex gap-4 pt-4">
                            <button 
                                type="button"
                                onClick={onBack}
                                className="px-6 py-2 border rounded font-medium hover:bg-gray-50"
                            >
                                ← Back to Address
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
                            >
                                Place Order - ₹{finalTotal.toFixed(2)}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            {/* Right Side - Order Summary */}
            <div className="lg:w-1/3">
                <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-4">
                    <h3 className="font-semibold text-lg mb-4">Price Details</h3>
                    
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal ({validCart.length} items)</span>
                            <span>₹{finalTotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span>₹{finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                        <p>By placing this order, you agree to our Terms & Conditions.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Step 4: Order Success
function OrderSuccessStep({ orderId, onContinueShopping }) {
    return (
        <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl text-green-600">✓</span>
                </div>
                
                <h2 className="text-2xl font-semibold mb-2">Order Placed Successfully!</h2>
                <p className="text-gray-600 mb-6">Thank you for your order</p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="text-xl font-bold text-blue-600">{orderId || 'ORD-' + Date.now()}</p>
                </div>
                
                <div className="text-left space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                        <span className="text-green-600">✓</span>
                        <span className="text-sm">Payment {orderId ? 'received' : 'processing'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-green-600">✓</span>
                        <span className="text-sm">Order confirmed</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-green-600">✓</span>
                        <span className="text-sm">Estimated delivery: 5-7 business days</span>
                    </div>
                </div>
                
                <button 
                    onClick={onContinueShopping}
                    className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    )
}

// Main Checkout Component
export default function Checkout() {
    const navigate = useNavigate();
    let { user } = useContext(userContext)
    const [currentStep, setCurrentStep] = useState(1)
    const [cartData, setCartData] = useState(null)
    const [discountApplied, setDiscountApplied] = useState(false)
    const [processingPayment, setProcessingPayment] = useState(false)
    const [orderId, setOrderId] = useState('')
    
    const [shippingAddress, setShippingAddress] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        phone: ""
    })
    
    const [paymentMethod, setPaymentMethod] = useState("cod")
    const [cardDetails, setCardDetails] = useState({
        cardNumber: "",
        expiry: "",
        cvv: "",
        nameOnCard: ""
    })
    const [upiId, setUpiId] = useState("")
    const [selectedBank, setSelectedBank] = useState("")

    const refreshCart = () => {
        let userId = user?._id || localStorage.getItem("USER_ID");
        if (!userId) {
            userId = localStorage.getItem("GUEST_ID") || "guest";
        }
        API.get(`/cart?userId=${userId}`).then(res => {
            setCartData(res.data);
        }).catch(err => console.log(err));
    };

    useEffect(() => {
        refreshCart();
    }, []);

    const validCart = (cartData?.products || []).filter(item => item.product);

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

    const handlePlaceOrder = async () => {
        setProcessingPayment(true);
        
        let paymentMessage = "";
        if (paymentMethod === "card") {
            paymentMessage = "Processing card payment...";
        } else if (paymentMethod === "upi") {
            paymentMessage = "Redirecting to UPI payment...";
        } else if (paymentMethod === "netbanking") {
            paymentMessage = "Processing net banking...";
        } else {
            paymentMessage = "Processing order...";
        }
        
        toast.info(paymentMessage);

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const userId = user?._id || localStorage.getItem("USER_ID") || "guest";

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
            paymentMethod: paymentMethod,
            paymentDetails: {
                ...(paymentMethod === "card" && { last4: cardDetails.cardNumber.slice(-4) }),
                ...(paymentMethod === "upi" && { upiId: upiId }),
                ...(paymentMethod === "netbanking" && { bank: selectedBank })
            },
            userId: userId
        };

        try {
            const response = await API.post("/orders", orderData);
            const newOrderId = response.data?.order?._id || 'ORD-' + Date.now();
            setOrderId(newOrderId);
            setCurrentStep(4);
            toast.success("Order placed successfully!");
        } catch (error) {
            toast.error("Failed to place order: " + (error.response?.data?.message || error.message));
        } finally {
            setProcessingPayment(false);
        }
    };

    const handleContinueToPayment = () => {
        handlePlaceOrder();
    };

    const handleContinueShopping = () => {
        navigate('/');
    };

    return (
        <div>
            <Header />
            <ToastContainer />
            <div className="container mx-auto mt-6 p-4">
                {/* Progress Step Indicator */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    <div className="flex justify-center items-center flex-wrap gap-2 sm:gap-0">
                        <ProgressStep step={1} currentStep={currentStep} title="Cart" icon="1" />
                        <ProgressStep step={2} currentStep={currentStep} title="Address" icon="2" />
                        <ProgressStep step={3} currentStep={currentStep} title="Payment" icon="3" />
                        <ProgressStep step={4} currentStep={currentStep} title="Order" icon="4" />
                    </div>
                </div>

                {/* Step Content */}
                {currentStep === 1 && (
                    <CartStep 
                        cartData={cartData}
                        refreshCart={refreshCart}
                        discountApplied={discountApplied}
                        setDiscountApplied={setDiscountApplied}
                        discountPercentage={discountPercentage}
                        onContinue={() => setCurrentStep(2)}
                        validCart={validCart}
                        totalPrice={totalPrice}
                        discountAmount={discountAmount}
                        shippingCost={shippingCost}
                        finalTotal={finalTotal}
                    />
                )}
                
                {currentStep === 2 && (
                    <AddressStep 
                        shippingAddress={shippingAddress}
                        setShippingAddress={setShippingAddress}
                        onContinue={() => setCurrentStep(3)}
                        onBack={() => setCurrentStep(1)}
                        validCart={validCart}
                        totalPrice={totalPrice}
                        discountApplied={discountApplied}
                        discountPercentage={discountPercentage}
                        discountAmount={discountAmount}
                        shippingCost={shippingCost}
                        finalTotal={finalTotal}
                    />
                )}
                
                {currentStep === 3 && (
                    <PaymentStep 
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                        cardDetails={cardDetails}
                        setCardDetails={setCardDetails}
                        upiId={upiId}
                        setUpiId={setUpiId}
                        selectedBank={selectedBank}
                        setSelectedBank={setSelectedBank}
                        onContinue={handleContinueToPayment}
                        onBack={() => setCurrentStep(2)}
                        validCart={validCart}
                        finalTotal={finalTotal}
                        shippingAddress={shippingAddress}
                    />
                )}
                
                {currentStep === 4 && (
                    <OrderSuccessStep 
                        orderId={orderId}
                        onContinueShopping={handleContinueShopping}
                    />
                )}
            </div>
        </div>
    )
}
