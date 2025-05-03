'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product, Media } from '@/payload-types';
import Container from '@/components/Container';
import { JSX, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/app/components/Cart/cart-context';

interface ProductDetailsProps {
    product: Product;
    descriptionContent: JSX.Element;
    loading?: boolean;
}

const ProductDetails = ({ product, descriptionContent, loading }: ProductDetailsProps) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { addToCart, openCart } = useCart();

    // Simulate brief loading delay for skeletons
    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => setIsLoading(false), 500);
            return () => clearTimeout(timer);
        }
    }, [loading]);

    const handleAddToBag = () => {
        addToCart(product, quantity);
        openCart(); // Open the cart sidebar after adding item
    };
    return (
        <Container>
            <section className="py-12 sm:py-10 test-border">
                <div className="container mx-auto lg:px-20 xl:px-35 test-border">
                    {/* Breadcrumbs */}
                    <nav className="flex test-border">
                        <ol role="list" className="flex items-center">
                            <li className="text-left">
                                <div className="-m-1">
                                    <Link
                                        href="/"
                                        className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                                    >
                                        Home
                                    </Link>
                                </div>
                            </li>
                            <li className="text-left">
                                <div className="flex items-center">
                                    <span className="mx-2 text-gray-400">/</span>
                                    <div className="-m-1">
                                        <Link
                                            href="/products"
                                            className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                                        >
                                            Products
                                        </Link>
                                    </div>
                                </div>
                            </li>
                            <li className="text-left">
                                <div className="flex items-center">
                                    <span className="mx-2 text-gray-400">/</span>
                                    <div className="-m-1">
                                        <Link
                                            href={`/${product.slug}`}
                                            className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                                            aria-current="page"
                                        >
                                            {product.name}
                                        </Link>
                                    </div>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    <div className="lg:col-gap-12 xl:col-gap-16 mt-0 grid grid-cols-1 gap-18 lg:mt-8 lg:grid-cols-6 lg:gap-16 test-border">
                        {/* Product Images */}
                        <div className="lg:col-span-3 lg:row-end-1 test-border">
                            <div className="lg:flex lg:flex-col lg:items-center">
                                {/* Main Image */}
                                <div className="w-full overflow-hidden rounded-sm test-border">
                                    {isLoading ? (
                                        <Skeleton className="w-full aspect-square h-[400px] rounded-sm" />
                                    ) : product.media && product.media.length > 0 ? (
                                        <div className="relative w-full aspect-square">
                                            <Image
                                                className="absolute inset-0 h-full w-full object-cover"
                                                src={
                                                    typeof product.media[selectedImageIndex].image === 'object'
                                                        ? product.media[selectedImageIndex].image.url || ''
                                                        : ''
                                                }
                                                alt={
                                                    typeof product.media[selectedImageIndex].image === 'object'
                                                        ? product.media[selectedImageIndex].image.alt || product.name
                                                        : product.name
                                                }
                                                fill
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full aspect-square bg-gray-200 flex items-center justify-center rounded-lg">
                                            <span className="text-gray-500">No image available</span>
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail Buttons (Scrollable) */}
                                {isLoading ? (
                                    <div className="mt-2 w-full flex flex-row space-x-3 scrollbar-hide">
                                        {[...Array(4)].map((_, index) => (
                                            <Skeleton key={index} className="h-20 w-20 rounded-sm flex-shrink-0" />
                                        ))}
                                    </div>
                                ) : product.media && product.media.length > 0 ? (
                                    <div className="mt-2 w-full overflow-x-auto flex flex-row space-x-3 scrollbar-hide">
                                        {product.media.map((mediaItem, index) => {
                                            const image = typeof mediaItem.image === 'object' ? mediaItem.image : null;
                                            return (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => setSelectedImageIndex(index)}
                                                    className={`cursor-pointer flex-shrink-0 aspect-square h-20 overflow-hidden rounded-sm border-2 text-center ${index === selectedImageIndex ? 'border-gray-900' : 'border-transparent'
                                                        }`}
                                                >
                                                    <Image
                                                        className="h-full w-full object-cover"
                                                        src={image?.url || ''}
                                                        alt={image?.alt || `${product.name} thumbnail ${index + 1}`}
                                                        width={80}
                                                        height={80}
                                                    />
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="lg:col-span-3 lg:row-span-2 lg:row-end-2 test-border">
                            <h2 className="mt-0 text-2xl font-bold text-rose-900 uppercase">{product.brand}</h2>
                            <h1 className="sm:text-3xl font-bold text-gray-900">
                                {product.name}
                            </h1>


                            {/* Static Ratings and Reviews */}
                            <div className="mt-1 flex items-center">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, index) => (
                                        <svg
                                            key={index}
                                            className="block h-4 w-4 align-middle text-yellow-500"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                            />
                                        </svg>
                                    ))}
                                </div>
                                <p className="ml-2 text-sm font-medium text-gray-500">
                                    129 Reviews
                                </p>
                            </div>

                            {/* Price and Add to Cart */}
                            <div className="mt-10 flex flex-col items-start justify-between space-y-4 py-4 sm:flex-col sm:space-y-0">
                                <div className="flex items-end mb-5">
                                    <h1 className="text-xl">
                                        ৳ {product.offer_price ? product.offer_price.toFixed(0) : product.price.toFixed(0)}
                                    </h1>
                                </div>

                                <div className="flex items-center space-x-4 w-full">
                                    {/* Quantity Selector */}
                                    <div className="flex items-center border border-gray-300 rounded-md w-2/5 h-12">
                                        <button
                                            type="button"
                                            className="px-3 py-2 text-gray-700 hover:bg-gray-100 h-full cursor-pointer"
                                            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} // Decrease quantity, minimum 1
                                            disabled={!product.is_in_stock}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                                            </svg>
                                        </button>
                                        <span className="px-4 py-2 text-center flex-1">{quantity}</span>
                                        <button
                                            type="button"
                                            className="px-3 py-2 text-gray-700 hover:bg-gray-100 h-full cursor-pointer"
                                            onClick={() => setQuantity((prev) => prev + 1)} // Increase quantity
                                            disabled={!product.is_in_stock}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Add to Bag Button */}
                                    <button
                                        type="button"
                                        disabled={!product.is_in_stock}
                                        onClick={handleAddToBag}
                                        className={`cursor-pointer inline-flex items-center justify-center rounded-md border-2 border-transparent text-center text-base text-white transition-all duration-200 ease-in-out focus:shadow w-3/5 h-12 ${product.is_in_stock ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {product.is_in_stock ? 'Add to Bag' : 'Out of Stock'}
                                    </button>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <ul className="mt-8 space-y-2">
                                <li className="flex items-center text-left text-sm font-medium text-gray-600">
                                    <svg
                                        className="mr-2 block h-5 w-5 align-middle text-gray-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Free shipping worldwide
                                </li>
                                <li className="flex items-center text-left text-sm font-medium text-gray-600">
                                    <svg
                                        className="mr-2 block h-5 w-5 align-middle text-gray-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                        />
                                    </svg>
                                    Cancel Anytime
                                </li>
                            </ul>

                            {/* Description and Reviews Section */}
                            <div className="mt-8 border-t border-gray-300 pt-8">
                                <nav className="flex gap-4">
                                    <a
                                        href="#"
                                        className="border-b-2 border-gray-900 py-4 text-sm font-medium text-gray-900 hover:border-gray-400 hover:text-gray-800"
                                    >
                                        Description
                                    </a>
                                    <a
                                        href="#"
                                        className="inline-flex items-center border-b-2 border-transparent py-4 text-sm font-medium text-gray-600"
                                    >
                                        Reviews
                                        <span className="ml-2 block rounded-full bg-gray-500 px-2 py-px text-xs font-bold text-gray-100">
                                            129
                                        </span>
                                    </a>
                                </nav>

                                <div className="mt-8 flow-root">
                                    <h1 className="text-2xl">Product Details</h1>
                                    <div className="mt-4">{descriptionContent}</div>
                                    {/* <p className="mt-4">
                                        SKU: {product.sku}
                                    </p> */}
                                    {/* {product.top_pick && (
                                        <p className="mt-4">This product is a Top Pick!</p>
                                    )}
                                    {product.new_arrival && (
                                        <p className="mt-4">This is a New Arrival!</p>
                                    )} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Container>
    );
};

export default ProductDetails;