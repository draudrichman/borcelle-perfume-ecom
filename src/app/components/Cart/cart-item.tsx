import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './cart-context';
import { useState, ChangeEvent } from 'react';
import { X } from 'lucide-react';
import { formatBDTNumber } from '@/lib/utils';

interface CartItemProps {
    item: {
        id: number;
        name: string;
        price: number;
        quantity: number;
        image: string;
        options?: { name: string; value: string }[];
        path: string;
    };
    updateQuantity: (id: number, quantity: number) => void;
    removeItem: (id: number) => void;
}

const CartItem = ({ item, updateQuantity, removeItem }: CartItemProps) => {
    const { closeCart } = useCart();
    const [quantity, setQuantity] = useState(item.quantity);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newQuantity = Number(e.target.value);
        setQuantity(newQuantity);
        updateQuantity(item.id, newQuantity);
    };

    const increaseQuantity = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        updateQuantity(item.id, newQuantity);
    };

    const decreaseQuantity = () => {
        const newQuantity = quantity > 1 ? quantity - 1 : 1;
        setQuantity(newQuantity);
        updateQuantity(item.id, newQuantity);
    };

    const handleRemove = () => {
        removeItem(item.id);
    };

    return (
        <li className="flex flex-row space-x-4 py-4 px-4 border-b">
            <div className="w-16 h-16 relative">
                <Link href={`/${item.path}`}>
                    <Image
                        onClick={closeCart}
                        width={64}
                        height={64}
                        src={item.image || '/product-img-placeholder.svg'}
                        alt={item.name}
                        className="object-cover rounded"
                    />
                </Link>
                <button
                    onClick={handleRemove}
                    className="absolute top-[-0.5rem] left-[-0.5rem] z-10 bg-gray-50 text-black rounded-full p-1 hover:bg-rose-200 transition-colors"
                    aria-label="Remove item"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
            <div className="flex-1 flex flex-col text-base">
                <Link href={`/${item.path}`}>
                    <span onClick={closeCart} className="font-semibold">
                        {item.name}
                    </span>
                </Link>
                {item.options && item.options.length > 0 && (
                    <div className="text-sm text-gray-600">
                        {item.options.map((option, i) => (
                            <span key={`${item.id}-${option.name}`}>
                                {option.name}: {option.value}
                                {i < (item.options?.length ?? 0) - 1 && ', '}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-between items-end space-y-2 text-sm">
                <div className="flex flex-col justify-between items-end space-y-2 text-sm">
                    <span>৳ {formatBDTNumber(item.price * item.quantity)} BDT</span>
                    <div className="flex items-center border border-gray-300 rounded-md h-10">
                        <button
                            onClick={decreaseQuantity}
                            className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-l-md"
                        >
                            -
                        </button>
                        <span className="px-4 py-2 text-center flex-1">{quantity}</span>
                        <button
                            onClick={increaseQuantity}
                            className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-l-md"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default CartItem;