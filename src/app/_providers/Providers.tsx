'use client'

import React from 'react'

import { AuthProvider } from './AuthProvider'
import { CartProvider } from '../components/Cart/cart-context'


export const Providers: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    return (
        <AuthProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </AuthProvider>
    )
}