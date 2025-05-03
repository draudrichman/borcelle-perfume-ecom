'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '@/payload-types';

// Cart Item Interface
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    options?: { name: string; value: string }[];
    path: string;
}

// Combined Context Type
interface CartContextType {
    // UI State
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;

    // Cart Data
    cartItems: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
    subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    // UI State
    const [isCartOpen, setIsCartOpen] = useState(false);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    // Cart Data - Initialize as empty array
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Load cart from localStorage after mounting
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart) as CartItem[];
                setCartItems(parsedCart);
            } catch (error) {
                console.error('Error parsing cart from localStorage:', error);
                setCartItems([]);
            }
        }
    }, []); // Empty dependency array to run only on mount

    // Save cart to localStorage whenever cartItems changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product: Product, quantity: number) => {
        setCartItems((prevItems) => {
            // Check if product already exists in cart
            const existingItemIndex = prevItems.findIndex(item => item.id === product.id);

            if (existingItemIndex >= 0) {
                // Update quantity if product exists
                return prevItems.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Add new item if product doesn't exist
                const imageUrl = product.media && product.media.length > 0
                    ? typeof product.media[0].image === 'object'
                        ? product.media[0].image.url || ''
                        : ''
                    : '/product-img-placeholder.svg';

                const newItem: CartItem = {
                    id: product.id,
                    name: product.name,
                    price: product.offer_price || product.price,
                    quantity,
                    image: imageUrl,
                    path: product.slug,
                };

                return [...prevItems, newItem];
            }
        });
    };

    const updateQuantity = (id: number, quantity: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
            )
        );
    };

    const removeItem = (id: number) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            // UI State
            isCartOpen,
            openCart,
            closeCart,

            // Cart Data
            cartItems,
            addToCart,
            updateQuantity,
            removeItem,
            clearCart,
            subtotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};