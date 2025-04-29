import { getPayload } from 'payload';
import config from '@/payload.config';
import Hero from '@/components/Hero';
import { HeroImage, Product } from '@/payload-types';
import ProductGrid from '@/components/ProductGrid';
import Container from '@/components/Container';

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
      <Container>
        {/* <h1 className="text-3xl font-bold mb-8">Our Products</h1> */}
        <ProductGrid products={products} />
      </Container>
    </div>
  );
}