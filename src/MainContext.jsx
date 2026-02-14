import React, { createContext, useEffect, useState } from 'react'
export let userContext = createContext()

export default function MainContext({ children }) {
    let [user, setuser] = useState(localStorage.getItem("USER") ? JSON.parse(localStorage.getItem("USER")) : null)
    let [token, settoken] = useState(localStorage.getItem("TOKEN") ?? '')
    let [cart, setcart] = useState(() => {
        try {
            const stored = localStorage.getItem("CART");
            const parsed = stored ? JSON.parse(stored) : [];
            if (Array.isArray(parsed)) {
                // Filter out invalid cart items
                return parsed.filter(item => item && item.productId && item.productId._id && item.quantity);
            }
            return [];
        } catch {
            return [];
        }
    })
    let obj = {
        cart,
        setcart,
        user,
        setuser,
        token,
        settoken
    }
    useEffect(() => {
        localStorage.setItem("CART", JSON.stringify(cart))
    }, [cart])
    useEffect(() => {
        localStorage.setItem("TOKEN", token)
        localStorage.setItem("USER", JSON.stringify(user))
    }, [token])
    return (
        <userContext.Provider value={obj}>{children}</userContext.Provider>

    )
}
