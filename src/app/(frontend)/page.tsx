import { getPayload } from 'payload';
import config from '@/payload.config';
import Hero from '@/components/Hero';
import { HeroImage, Product } from '@/payload-types';
import Container from '@/components/Container';
import FeaturedBrands from '@/components/FeaturedBrands';
import FeaturedProductGrid from '@/components/FeaturedProductGrid';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// export const revalidate = 60;


export default async function Home() {
  // Fetch Navbar and Hero data from Payload  
  const payload = await getPayload({ config });

  // Fetch Hero images
  const heroImagesResult = await payload.find({
    collection: 'heroImages',
    limit: 5,
  });

  // Extract hero images with proper typing
  const heroImages = heroImagesResult.docs.map((doc: HeroImage) => ({
    id: String(doc.id),
    title: doc.title,
    image: {
      url: typeof doc.image === 'object' ? doc.image.url || '' : '',
      alt: doc.title,
    },
  }));

  const productsResult = await payload.find({
    collection: 'products',
  });

  const products: Product[] = productsResult.docs;

  return (
    <div>
      <Hero images={heroImages} />
      {/* Other page content */}
      <div className='mb-10'>
          {/* <h2 className="text-5xl font-bold text-center pb-5 uppercase font-poiret-one">Top Brands</h2> */}
        <FeaturedBrands />
        <Container>
          {/* <h1 className="text-4xl font-bold text-center pt-10 uppercase font-poiret-one">Bestsellers</h1> */}
          <FeaturedProductGrid products={products} />
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-5xl font-bold tracking-tight font-poiret-one mt-20 uppercase">Feeling fabulous starts here</h2>
            <p className="max-w-[600px] text-muted-foreground">
              Discover our latest collections and find your perfect fit
            </p>
            <Button asChild size="lg" variant={'outlineblack'}>
              <Link href="/search?query=">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Shop Now
              </Link>
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
}