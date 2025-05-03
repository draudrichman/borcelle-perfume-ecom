'use client';

import { Product } from '@/payload-types';
import ProductCard from '@/components/ProductCard';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface FeaturedProductGridProps {
    products: Product[];
}

const FeaturedProductGrid: React.FC<FeaturedProductGridProps> = ({ products }) => {
    return (
        <section className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-2">
                <h2 className="text-4xl font-bold text-center pt-10 uppercase font-poiret-one">Featured</h2>
                <p className="text-muted-foreground max-w-[600px]">Our most popular items, handpicked for you</p>
            </div>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                    slidesToScroll: 1,
                }}
                className="w-full relative"
            >
                <CarouselContent>
                    {products.map((product) => (
                        <CarouselItem key={product.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                            <ProductCard product={product} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 lg:-left-10 top-1/2 transform -translate-y-1/2 z-10" />
                <CarouselNext className="absolute right-2 lg:-right-10 top-1/2 transform -translate-y-1/2 z-10" />
            </Carousel>
        </section>
    );
};

export default FeaturedProductGrid;