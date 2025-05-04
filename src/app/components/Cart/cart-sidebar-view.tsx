'use client';

import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import CartItem from './cart-item';
import { useCart } from './cart-context';
import { formatBDTNumber } from '@/lib/utils';


const CartSidebarView = () => {
    const { isCartOpen, closeCart, cartItems, updateQuantity, removeItem, subtotal } = useCart();

    return (
        <Sheet open={isCartOpen} onOpenChange={closeCart}>
            <SheetContent
                side="right"
                className="w-full sm:w-[400px] bg-white p-0 flex flex-col h-full"
            >
                <SheetHeader className="border-b p-4">
                    <SheetTitle>My Cart</SheetTitle>
                </SheetHeader>

                {cartItems.length === 0 ? (
                    <div className="flex-1 px-4 flex flex-col justify-center items-center">
                        <h2 className="pt-6 text-2xl font-bold text-center">Your cart is empty</h2>
                        <p className="text-gray-500 text-center pt-2">
                            Add some items to your cart to get started.
                        </p>
                    </div>
                ) : (
                    <>
                        <ul className="flex-1 overflow-y-auto">
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    updateQuantity={updateQuantity}
                                    removeItem={removeItem}
                                />
                            ))}
                        </ul>
                        <div className="p-6 border-t">
                            <ul className="pb-2 text-sm">
                                <li className="flex justify-between py-1">
                                    <span>Subtotal</span>
                                    <span>৳ {formatBDTNumber(subtotal)} BDT</span>
                                </li>
                                <li className="flex justify-between py-1">
                                    <span>Taxes</span>
                                    <span>৳ 0.00 BDT</span>
                                </li>
                                <li className="flex justify-between py-1">
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </li>
                            </ul>
                            <div className="flex justify-between border-t py-3 font-bold text-lg">
                                <span>Total</span>
                                <span>৳ {formatBDTNumber(subtotal)} BDT</span>
                            </div>
                            <Link href="/cart" onClick={closeCart}>
                                <button className="w-full bg-gray-900 text-white py-3 rounded-sm mt-2 cursor-pointer">
                                    Proceed to Checkout
                                </button>
                            </Link>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default CartSidebarView;