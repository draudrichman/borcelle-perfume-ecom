'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Product } from '@/payload-types';

interface FilterSortProps {
    products: Product[];
    fullMinPrice: number;
    fullMaxPrice: number;
}

const getFilterValues = (products: Product[]) => {
    const brands = [...new Set(products.map((product) => product.brand))];
    return { brands };
};

export default function FilterSort({ products, fullMinPrice, fullMaxPrice }: FilterSortProps) {
    const { brands } = getFilterValues(products);
    const searchParams = useSearchParams();
    const router = useRouter();

    // Initialize filter states from search params
    const [selectedBrand, setSelectedBrand] = useState<string | null>(searchParams.get('brand') || null);
    const [priceRange, setPriceRange] = useState([
        Number(searchParams.get('minPrice')) || fullMinPrice,
        Number(searchParams.get('maxPrice')) || fullMaxPrice,
    ]);
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recommended');

    // State for dropdown visibility
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // State for price input values
    const [minPriceInput, setMinPriceInput] = useState(priceRange[0].toString());
    const [maxPriceInput, setMaxPriceInput] = useState(priceRange[1].toString());

    // Toggle dropdown
    const toggleDropdown = (dropdown: string) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    // Update search params whenever filters or sorting changes
    const updateSearchParams = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('minPrice', priceRange[0].toString());
        params.set('maxPrice', priceRange[1].toString());
        if (selectedBrand) params.set('brand', selectedBrand);
        else params.delete('brand');
        params.set('sort', sortBy);
        router.push(`/search?${params.toString()}`);
    };

    // Sync search params on filter/sort change
    useEffect(() => {
        updateSearchParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBrand, priceRange, sortBy]);

    // Handle price input changes
    const handleMinPriceChange = (value: string) => {
        setMinPriceInput(value);
        const numValue = Number.parseFloat(value) || fullMinPrice;
        setPriceRange([numValue, priceRange[1]]);
    };

    const handleMaxPriceChange = (value: string) => {
        setMaxPriceInput(value);
        const numValue = Number.parseFloat(value) || fullMaxPrice;
        setPriceRange([priceRange[0], numValue]);
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-6">
                <div className="flex items-center">
                    <span className="mr-2 font-medium">Filter</span>
                </div>

                {/* Brand Filter */}
                <DropdownMenu open={openDropdown === 'brand'} onOpenChange={() => toggleDropdown('brand')}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="rounded-full px-4 py-2 border flex items-center gap-1">
                            Brand
                            {openDropdown === 'brand' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 p-2">
                        <DropdownMenuRadioGroup value={selectedBrand || ''} onValueChange={setSelectedBrand}>
                            <DropdownMenuRadioItem value="">All Brands</DropdownMenuRadioItem>
                            {brands.map((brand) => (
                                <DropdownMenuRadioItem key={brand} value={brand}>
                                    {brand}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Price Filter */}
                <DropdownMenu open={openDropdown === 'price'} onOpenChange={() => toggleDropdown('price')}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className={`rounded-full px-4 py-2 border flex items-center gap-1 ${openDropdown === 'price' ? 'border-blue-500 text-blue-500' : ''}`}
                        >
                            Price
                            {openDropdown === 'price' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-72 p-4">
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <div className="space-y-1">
                                    <Label>Minimum</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2">৳</span>
                                        <Input
                                            value={minPriceInput}
                                            onChange={(e) => handleMinPriceChange(e.target.value)}
                                            className="pl-7"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label>Maximum</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2">৳</span>
                                        <Input
                                            value={maxPriceInput}
                                            onChange={(e) => handleMaxPriceChange(e.target.value)}
                                            className="pl-7"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 pb-2">
                                <Slider
                                    value={priceRange}
                                    min={fullMinPrice}
                                    max={fullMaxPrice}
                                    step={1}
                                    onValueChange={(value) => {
                                        setPriceRange(value as [number, number]);
                                        setMinPriceInput(value[0].toString());
                                        setMaxPriceInput(value[1].toString());
                                    }}
                                />
                                <div className="flex justify-between mt-2">
                                    <span>৳{priceRange[0]}</span>
                                    <span>৳{priceRange[1]}</span>
                                </div>
                            </div>
                            <Button
                                className="w-full bg-black text-white hover:bg-gray-800"
                                onClick={() => setOpenDropdown(null)}
                            >
                                Apply
                            </Button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort Dropdown */}
                <div className="ml-auto">
                    <DropdownMenu open={openDropdown === 'sort'} onOpenChange={() => toggleDropdown('sort')}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded-full px-4 py-2 border flex items-center gap-1">
                                Sort by:{' '}
                                {sortBy === 'recommended'
                                    ? 'Recommended'
                                    : sortBy === 'price-low-high'
                                        ? 'Price: Low to High'
                                        : sortBy === 'price-high-low'
                                            ? 'Price: High to Low'
                                            : sortBy === 'recently-added'
                                                ? 'Recently Added'
                                                : 'Most Popular'}
                                {openDropdown === 'sort' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 p-2">
                            <RadioGroup value={sortBy} onValueChange={setSortBy} className="space-y-2">
                                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                                    <RadioGroupItem value="recommended" id="recommended" />
                                    <Label htmlFor="recommended" className="flex-grow cursor-pointer">
                                        Recommended
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                                    <RadioGroupItem value="price-low-high" id="price-low-high" />
                                    <Label htmlFor="price-low-high" className="flex-grow cursor-pointer">
                                        Price: Low to High
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                                    <RadioGroupItem value="price-high-low" id="price-high-low" />
                                    <Label htmlFor="price-high-low" className="flex-grow cursor-pointer">
                                        Price: High to Low
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                                    <RadioGroupItem value="recently-added" id="recently-added" />
                                    <Label htmlFor="recently-added" className="flex-grow cursor-pointer">
                                        Recently Added
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                                    <RadioGroupItem value="most-popular" id="most-popular" />
                                    <Label htmlFor="most-popular" className="flex-grow cursor-pointer">
                                        Most Popular
                                    </Label>
                                </div>
                            </RadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}