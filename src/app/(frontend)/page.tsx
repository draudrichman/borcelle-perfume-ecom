import { getPayload } from 'payload';
import config from '@/payload.config';
import Hero from '@/components/Hero';
import { HeroImage } from '@/payload-types';

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
      url: doc.url || '',
      alt: doc.title,
    },
  }));

  return (
    <div>
      <Hero images={heroImages} />
      {/* Other page content */}
    </div>
  );
}