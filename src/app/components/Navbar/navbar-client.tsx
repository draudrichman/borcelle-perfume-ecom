'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, User, X } from 'lucide-react';
import { useCart } from '../Cart/cart-context';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const NavbarClient = () => {
    const { openCart, cartItems } = useCart();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const accountRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;

        if (name) {
            router.push(`/search?query=${name}`);
        }
        setIsSearchOpen(false);
    };

    const handleAccountMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsAccountOpen(true);
    };

    const handleAccountMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsAccountOpen(false);
        }, 300);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="flex items-center justify-between gap-3 md:gap-6 py-4 relative">
            {/* Logo (Center) */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
                <Link href="/">
                    <Image src="/logo.svg" alt="Logo" width={80} height={80} />
                </Link>
            </div>

            {/* Right Side: Search, User, Cart */}
            <div className="ml-auto flex items-center gap-2">
                {/* Search Icon/Button */}
                {isSearchOpen ? (
                    <div className="relative flex items-center">
                        <form onSubmit={handleSearch}>
                            <Input
                                type="search"
                                name="name"
                                placeholder="Search products..."
                                className="w-[200px] md:w-[300px]"
                                autoFocus
                            />
                            {/* <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0"
                                onClick={() => setIsSearchOpen(false)}
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close search</span>
                            </Button> */}
                        </form>
                    </div>
                ) : (
                    <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className='cursor-pointer'>
                        <Search className="text-gray-900 w-6 h-6" />
                        <span className="sr-only">Search</span>
                    </Button>
                )}

                {/* User Account Icon with Dropdown */}
                <div
                    className="relative"
                    ref={accountRef}
                    onMouseEnter={handleAccountMouseEnter}
                    onMouseLeave={handleAccountMouseLeave}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsAccountOpen(!isAccountOpen)}
                        className="cursor-pointer"
                    >
                        <User className="text-gray-900 w-6 h-6" />
                        <span className="sr-only">Account</span>
                    </Button>
                    {isAccountOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                            <Link
                                href="/account"
                                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                            >
                                My Account
                            </Link>
                            <Link
                                href="/orders"
                                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                            >
                                My Orders
                            </Link>
                            <Link
                                href="/logout"
                                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                            >
                                Logout
                            </Link>
                        </div>
                    )}
                </div>

                {/* Shopping Cart (Unchanged) */}
                <div className="flex-shrink-0 relative">
                    <Button variant="ghost" size="icon" onClick={openCart} className="relative cursor-pointer">
                        <ShoppingCart className="text-gray-900 w-6 h-6" />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NavbarClient;