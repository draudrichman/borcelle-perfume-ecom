import { getPayload } from 'payload';
import config from '@/payload.config';
import ProductGrid from '@/components/ProductGrid';
import FilterSort from '@/components/FilterSort';
import SearchBar from '@/components/SearchBar'; // Import the new SearchBar component
import { Product } from '@/payload-types';
import Container from '@/components/Container';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
    searchParams: Promise<{ query?: string; brand?: string; minPrice?: string; maxPrice?: string; sort?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { query = '', brand, minPrice, maxPrice, sort } = await searchParams;
    const payload = await getPayload({ config });

    // Fetch filtered products based on search params
    const productsResult = await payload.find({
        collection: 'products',
        where: {
            ...(query && { name: { contains: query } }),
            ...(brand && { brand: { equals: brand } }),
            ...(minPrice && maxPrice && {
                or: [
                    { offer_price: { greater_than_equal: Number(minPrice), less_than_equal: Number(maxPrice) } },
                    { price: { greater_than_equal: Number(minPrice), less_than_equal: Number(maxPrice) } },
                ],
            }),
        },
        sort: sort === 'price-low-high' ? 'price' : sort === 'price-high-low' ? '-price' : sort === 'recently-added' ? '-createdAt' : undefined,
    });

    // Fetch the full price range from all products
    const allProductsForPriceRange = await payload.find({
        collection: 'products',
        limit: 1,
        sort: 'price', // Get the lowest price
    });
    const allProductsForMaxPrice = await payload.find({
        collection: 'products',
        limit: 1,
        sort: '-price', // Get the highest price
    });

    const fullMinPrice = allProductsForPriceRange.docs[0]
        ? (allProductsForPriceRange.docs[0].offer_price || allProductsForPriceRange.docs[0].price)
        : 0;
    const fullMaxPrice = allProductsForMaxPrice.docs[0]
        ? (allProductsForMaxPrice.docs[0].offer_price || allProductsForMaxPrice.docs[0].price)
        : 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <Container>
                <h1 className="text-2xl font-semibold mb-4">
                    Search Results for &quot;{query || 'All Products'}&quot;
                </h1>
                <SearchBar />
                <FilterSort
                    products={productsResult.docs as Product[]}
                    fullMinPrice={Math.floor(fullMinPrice)}
                    fullMaxPrice={Math.ceil(fullMaxPrice)}
                />
                <ProductGrid products={productsResult.docs as Product[]} />
            </Container>
        </div>
    );
}