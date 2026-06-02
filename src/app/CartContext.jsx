import { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context
const CartContext = createContext();

// 2. Create the Provider Component
export function CartProvider({ children }) {
    // Try to load cart from localStorage so it survives page refreshes (Rule #9: Side effects)
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('eco_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save to localStorage whenever the cart changes
    useEffect(() => {
        localStorage.setItem('eco_cart', JSON.stringify(cart));
    }, [cart]);

    // Actions
    // const addToCart = (product) => {
    //     setCart((prevCart) => {
    //         const existingItem = prevCart.find(item => item.id === product.id);
    //         if (existingItem) {
    //             // If it exists, just increase quantity
    //             return prevCart.map(item => 
    //                 item.id === product.id 
    //                     ? { ...item, cartQuantity: item.cartQuantity + 1 } 
    //                     : item
    //             );
    //         }
    //         // If new, add it with quantity 1
    //         return [...prevCart, { ...product, cartQuantity: 1 }];
    //     });
    // };

    const addToCart = (product, quantity = 1) => {
        // التأكد من استلام الكمية المرسلة من الواجهة (سواء كبارامتر أو داخل الكائن)
        const qtyToAdd = product.cartQuantity || quantity || 1; 

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, cartQuantity: item.cartQuantity + qtyToAdd }
                        : item
                );
            }
            return [...prevCart, { ...product, cartQuantity: qtyToAdd }];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== productId));
    };

    // const updateQuantity = (productId, amount) => {
    //     setCart((prevCart) => prevCart.map(item => {
    //         if (item.id === productId) {
    //             const newQuantity = Math.max(1, item.cartQuantity + amount); 
    //             return { ...item, cartQuantity: newQuantity };
    //         }
    //         return item;
    //     }));
    // };

    const updateQuantity = (id, newQuantity) => {
        // Prevent quantity from going below 1
        if (newQuantity < 1) return;

        setCart(prevCart => 
            prevCart.map(item => 
                item.id === id 
                    ? { ...item, cartQuantity: Number(newQuantity) } 
                    : item
            )
        );
    };

    const clearCart = () => setCart([]);

    // Derived State: Total Price
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.cartQuantity), 0);

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart,
            cartTotal,
            cart
        }}>
            {children}
        </CartContext.Provider>
    );
}

// 3. Create a custom hook for easy access (Rule #3)
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}