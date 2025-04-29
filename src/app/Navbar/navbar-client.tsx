'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import SearchBar from './SearchBar';
import { useCart } from '../(frontend)/Cart/cart-context';

const NavbarClient = () => {
    const { openCart, cartItems } = useCart();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="flex flex-row items-center justify-between gap-3 md:gap-6 py-4">
            {/* Search Bar Icon (Left) */}
            <div className="flex-shrink-0">
                <SearchBar />
            </div>

            {/* Logo (Center) */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
                <Link href="/">
                    <Image src="/logo.svg" alt="Logo" width={80} height={80} />
                </Link>
            </div>

            {/* Shopping Cart (Right) */}
            <div className="flex-shrink-0 relative">
                <button onClick={openCart} className="relative">
                    <ShoppingCart className="text-black w-6 h-6" />
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {totalItems}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default NavbarClient;