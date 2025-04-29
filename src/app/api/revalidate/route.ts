import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPayload } from 'payload';
import { Product } from '@/payload-types';
import config from '@/payload.config';


export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    // Revalidate homepage
    revalidatePath('/');

    // Fetch all products to revalidate their pages
    const payload = await getPayload({ config });
    const products = await payload.find({
      collection: 'products',
      limit: 0,
    });

    // Revalidate each product page
    products.docs.forEach((product: Product) => {
      revalidatePath(`/${product.slug}`);
    });

    return NextResponse.json({ revalidated: true });
  } catch (error) {
    return NextResponse.json({ message: 'Error revalidating', error }, { status: 500 });
  }
}