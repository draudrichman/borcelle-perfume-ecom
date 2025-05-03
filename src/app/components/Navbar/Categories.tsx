'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Container from '@/components/Container';

interface DropdownOption {
    name: string;
    slug: string;
    id?: string | null;
}

interface Category {
    name: string;
    slug: string;
    dropdownOptions?: DropdownOption[] | null;
    id?: string | null;
}

interface CategoriesProps {
    categories: Category[];
}

const Categories = ({ categories }: CategoriesProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const navRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = (categorySlug: string | null = null) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsOpen(true);
        setActiveCategory(categorySlug);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
            setActiveCategory(null);
        }, 300);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Placeholder product cards for "Recommended" section
    const placeholderProducts = [
        { id: 1, name: 'Miss Dior', price: 18000, image: '/placeholder/1.png', link: 'miss-dior' },
        { id: 2, name: 'Flora Gorgeous Gardenia', price: 13000, image: '/placeholder/2.png', link: 'gucci-flora-gorgeous-gardenia' },
        { id: 3, name: 'Princess', price: 4000, image: '/placeholder/3.png', link: 'vera-wang-princess' },
    ];

    return (
        <div className="relative" ref={navRef} onMouseLeave={handleMouseLeave}>
            <Container>
                {/* <div className="hidden sm:flex items-center space-x-4" onMouseEnter={() => handleMouseEnter(null)}> */}
                <div className="pt-6 pb-8 flex flex-row items-center justify-between" onMouseEnter={() => handleMouseEnter(null)}>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className="flex items-center gap-1 hover:text-gray-600 transition-colors"
                            onMouseEnter={() => handleMouseEnter(category.slug)}
                        >
                            {category.name}
                            {/* {category.dropdownOptions && category.dropdownOptions.length > 0 && (
                            <ChevronDown className={cn('h-4 w-4 transition-transform', (isOpen && activeCategory === category.slug) && 'rotate-180')} />
                            )} */}
                        </button>
                    ))}
                </div>
            </Container>

            {isOpen && activeCategory && (
                <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 text-gray-800 shadow-lg z-50" onMouseEnter={() => handleMouseEnter(activeCategory)}>
                    <div className="container mx-auto p-6 grid md:grid-cols-4 gap-8">
                        {/* Dropdown Options Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Categories</h3>
                            <div className="space-y-0">
                                {categories
                                    .find((cat) => cat.slug === activeCategory)
                                    ?.dropdownOptions?.map((option) => (
                                        <Link
                                            key={option.id || option.slug}
                                            href={`/category/${option.slug}`}
                                            className="flex items-center gap-3 py-1 rounded-lg transition-colors group"
                                        >
                                            <div className="flex-1">
                                                <h4 className="font-medium hover:font-semibold">{option.name}</h4>
                                            </div>
                                        </Link>
                                    )) || null}
                            </div>
                        </div>

                        {/* Recommended Section */}
                        <div className="md:col-span-3">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Recommended</h3>
                            <div className="grid grid-cols-3 gap-6 mt-4">
                                {placeholderProducts.map((product) => (
                                    <Link href={`/${product.link}`} key={product.id} onClick={() => handleMouseLeave()}>
                                        <div className="border rounded-lg p-4">
                                            <div className="relative h-48 mb-3 overflow-hidden rounded-lg">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <h4 className="font-medium">{product.name}</h4>
                                            <p className="font-bold mt-2">৳{product.price}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;