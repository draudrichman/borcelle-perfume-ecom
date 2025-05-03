import Link from 'next/link';
import Image from 'next/image';
import { Product, Media } from '@/payload-types';
import { formatBDTNumber } from '@/lib/utils';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <svg
                    key={i}
                    className={`block h-3 w-3 align-middle sm:h-4 sm:w-4 ${i <= rating ? 'text-teal-600' : 'text-gray-400'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            );
        }
        return stars;
    };

    const isOnSale = !!product.offer_price;
    const imageSrc = product.media && product.media.length > 0
        ? typeof product.media[0].image === 'object'
            ? product.media[0].image.url || ''
            : ''
        : '';
    const imageAlt = product.media && product.media.length > 0
        ? typeof product.media[0].image === 'object'
            ? product.media[0].image.alt || product.name
            : product.name
        : product.name;

    return (
        <Link href={`/${product.slug}`} className="relative group test-border block">
            <article>
                <div className="aspect-square overflow-hidden">
                    {imageSrc ? (
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            width={300}
                            height={300}
                            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-125"
                        />
                    ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                        </div>
                    )}
                </div>
                {isOnSale && (
                    <div className="absolute top-0 m-1 rounded-full bg-white">
                        <p className="rounded-full bg-black p-1 text-[10px] font-bold uppercase tracking-wide text-white sm:py-1 sm:px-3">
                            Sale
                        </p>
                    </div>
                )}
                <div className="mt-4 text-center">
                    <p className="text-xs font-medium text-gray-600 sm:text-sm md:text-base uppercase">
                        {product.brand}
                    </p>
                    <h3 className="text-xs font-semibold sm:text-sm md:text-base mt-1">
                        {product.name}
                    </h3>
                    <div className="mt-1">
                        {isOnSale && (
                            <del className="text-xs font-semibold text-gray-600 sm:text-sm mr-2">
                                ৳ {formatBDTNumber(product.price)}
                            </del>
                        )}
                        <span>
                            <div>
                                <span className='font-normal'>৳ </span>
                                <span className="text-xs font-normal sm:text-sm md:text-base">
                                    {isOnSale ? formatBDTNumber(product.offer_price!) : formatBDTNumber(product.price)}
                                </span>
                            </div>
                        </span>
                    </div>
                    <div className="mt-1 mb-2 flex justify-center items-center">
                        {renderStars(4)} {/* Static rating - add to schema if needed */}
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default ProductCard;