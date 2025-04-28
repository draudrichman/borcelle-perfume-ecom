import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { Product, Media } from '@/payload-types';
import Image from 'next/image';

// Define the RichText type based on the Product interface
interface RichTextNode {
    type: string;
    children: {
        type: string;
        version: number;
        [k: string]: unknown;
    }[];
    direction: 'ltr' | 'rtl' | null;
    format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
    indent: number;
    version: number;
}

// Utility function to extract plain text from richText JSON
const extractTextFromRichText = (richText: { root: RichTextNode }): string => {
    if (!richText || !richText.root) return '';

    let text = '';
    for (const node of richText.root.children) {
        if (typeof node === 'object' && 'text' in node && typeof node.text === 'string') {
            text += node.text + ' ';
        }
    }
    return text.trim();
};

interface ProductPageProps {
    params: { slug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = params;

    // Fetch the product by slug
    const payload = await getPayload({ config });
    const productResult = await payload.find({
        collection: 'products',
        where: { slug: { equals: slug } },
        limit: 1,
    });

    // If no product is found, return 404
    if (!productResult.docs || productResult.docs.length === 0) {
        notFound();
    }

    const product: Product = productResult.docs[0];

    // Extract plain text from the richText description
    const descriptionText = extractTextFromRichText(product.description);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {product.media && product.media.length > 0 ? (
                            <div className="relative h-[400px] w-full">
                                <Image
                                    src={typeof product.media[0].image === 'object' ? product.media[0].image.url || '' : ''}
                                    alt={typeof product.media[0].image === 'object' ? product.media[0].image.alt || product.name : product.name}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    className="rounded-lg shadow-md"
                                />
                            </div>
                        ) : (
                            <div className="h-[400px] w-full bg-gray-200 flex items-center justify-center rounded-lg shadow-md">
                                <span className="text-gray-500">No image available</span>
                            </div>
                        )}
                        {/* Thumbnail Gallery (if multiple images) */}
                        {product.media && product.media.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto">
                                {product.media.map((mediaItem, index) => {
                                    const image = typeof mediaItem.image === 'object' ? mediaItem.image as Media : null;
                                    return (
                                        <div key={index} className="relative h-20 w-20 flex-shrink-0">
                                            <Image
                                                src={image?.url || ''}
                                                alt={image?.alt || `${product.name} thumbnail ${index + 1}`}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                className="rounded-md border border-gray-200"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        {/* Badges */}
                        <div className="flex space-x-2">
                            {product.top_pick && (
                                <span className="inline-block bg-teal-100 text-teal-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    Top Pick
                                </span>
                            )}
                            {product.new_arrival && (
                                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    New Arrival
                                </span>
                            )}
                        </div>

                        {/* Product Name and Brand */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                            <p className="text-lg text-gray-600">{product.brand}</p>
                        </div>

                        {/* Product Title */}
                        <h2 className="text-xl text-gray-700">{product.title}</h2>

                        {/* Price and Offer Price */}
                        <div className="flex items-center space-x-3">
                            {product.offer_price ? (
                                <>
                                    <span className="text-2xl font-semibold text-teal-600">
                                        ${product.offer_price.toFixed(2)}
                                    </span>
                                    <span className="text-lg text-gray-500 line-through">
                                        ${product.price.toFixed(2)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-2xl font-semibold text-gray-900">
                                    ${product.price.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <p className={`text-sm ${product.is_in_stock ? 'text-green-600' : 'text-red-600'}`}>
                            {product.is_in_stock ? 'In Stock' : 'Out of Stock'}
                        </p>

                        {/* Description */}
                        <div className="prose prose-sm text-gray-700">
                            <p>{descriptionText || 'No description available'}</p>
                        </div>

                        {/* SKU */}
                        <p className="text-sm text-gray-600">SKU: {product.sku}</p>

                        {/* Add to Cart Button */}
                        <button
                            disabled={!product.is_in_stock}
                            className={`w-full py-3 rounded-lg text-white font-semibold ${product.is_in_stock
                                ? 'bg-teal-600 hover:bg-teal-700'
                                : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {product.is_in_stock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}