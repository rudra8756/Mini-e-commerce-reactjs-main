import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckoutProgress from './CheckoutProgress';
import { useCheckout } from '../CheckoutContext';
import API from '../api';

export default function AddressPage() {
    const navigate = useNavigate();
    const { shippingAddress, setShippingAddress, savedAddresses, setSavedAddresses, validCart, totalPrice, discountApplied, discountPercentage, discountAmount, shippingCost, finalTotal, refreshCart } = useCheckout();
    
    const [showAddForm, setShowAddForm] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    
    // Calculate totals
    const getDiscountPercentage = (total) => {
        if (total >= 1000) return 15;
        if (total >= 500) return 10;
        if (total >= 200) return 5;
        return 0;
    };
    
    const discountPerc = getDiscountPercentage(totalPrice);
    const discountAmt = discountApplied ? (totalPrice * discountPerc / 100) : 0;
    const shipCost = totalPrice > 500 ? 0 : 100;
    const total = totalPrice - discountAmt + shipCost;

    useEffect(() => {
        // Load saved addresses from localStorage (mock for now)
        const saved = localStorage.getItem('savedAddresses');
        if (saved) {
            setSavedAddresses(JSON.parse(saved));
        }
        // Load cart data
        refreshCart();
    }, []);

    const handleSelectAddress = (address) => {
        setSelectedAddressId(address.id);
        setShippingAddress(address);
        setShowAddForm(false);
    };

    const handleSubmitAddress = (e) => {
        e.preventDefault();
        
        if (!shippingAddress.name || !shippingAddress.address || !shippingAddress.city || !shippingAddress.pincode || !shippingAddress.phone) {
            toast.error("Please fill in all required fields");
            return;
        }
        
        if (!/^\d{10}$/.test(shippingAddress.phone)) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }
        
        // Save address
        const newAddress = { ...shippingAddress, id: Date.now().toString() };
        const updatedAddresses = [...savedAddresses, newAddress];
        setSavedAddresses(updatedAddresses);
        localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
        
        toast.success("Address saved successfully!");
        navigate('/checkout/summary');
    };

    const handleContinue = () => {
        if (!selectedAddressId && !shippingAddress.name) {
            toast.error("Please select or add an address");
            return;
        }
        navigate('/checkout/summary');
    };

    return (
        <div>
            <Header />
            <ToastContainer />
            <div className="container mx-auto mt-4 p-4">
                <CheckoutProgress currentStep={2} />
                
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Side - Address Selection */}
                    <div className="lg:w-2/3">
                        {/* Saved Addresses */}
                        {savedAddresses.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border p-6 mb-4">
                                <h2 className="text-xl font-semibold mb-4">Select Delivery Address</h2>
                                <div className="space-y-3">
                                    {savedAddresses.map((addr) => (
                                        <div 
                                            key={addr.id}
                                            onClick={() => handleSelectAddress(addr)}
                                            className={`p-4 border rounded-lg cursor-pointer hover:border-blue-500 ${selectedAddressId === addr.id ? 'border-blue-500 bg-blue-50' : ''}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <input 
                                                    type="radio" 
                                                    name="address" 
                                                    checked={selectedAddressId === addr.id}
                                                    onChange={() => handleSelectAddress(addr)}
                                                    className="mt-1"
                                                />
                                                <div>
                                                    <p className="font-semibold">{addr.name} {addr.isDefault && <span className="text-xs bg-yellow-100 px-2 py-0.5 rounded ml-2">DEFAULT</span>}</p>
                                                    <p className="text-sm text-gray-600">{addr.address}</p>
                                                    <p className="text-sm text-gray-600">{addr.city} - {addr.pincode}</p>
                                                    <p className="text-sm text-gray-500">Phone: {addr.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => { setShowAddForm(true); setSelectedAddressId(null); }}
                                    className="mt-4 text-blue-600 font-medium hover:underline"
                                >
                                    + Add New Address
                                </button>
                            </div>
                        )}

                        {/* Add New Address Form */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                {savedAddresses.length > 0 && !showAddForm ? 'Saved Address Selected' : 'Add Delivery Address'}
                            </h2>
                            
                            {(showAddForm || savedAddresses.length === 0) && (
                                <form onSubmit={handleSubmitAddress} className="space-y-4">
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
                                    
                                    <button 
                                        type="submit"
                                        className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
                                    >
                                        Save & Continue
                                    </button>
                                </form>
                            )}
                            
                            {savedAddresses.length > 0 && !showAddForm && selectedAddressId && (
                                <button 
                                    onClick={handleContinue}
                                    className="w-full bg-blue-600 text-white py-3 rounded font-semibold mt-4 hover:bg-blue-700"
                                >
                                    Continue to Order Summary
                                </button>
                            )}
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
                                
                                {discountApplied && discountAmt > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount ({discountPerc}%)</span>
                                        <span>-₹{discountAmt.toFixed(2)}</span>
                                    </div>
                                )}
                                
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span>{shipCost === 0 ? <span className="text-green-600">FREE</span> : `₹${shipCost}`}</span>
                                </div>
                                
                                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
