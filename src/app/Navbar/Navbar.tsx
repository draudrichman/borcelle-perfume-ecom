import { getPayload } from 'payload';
import config from '@/payload.config';
import Link from 'next/link';
import Container from '@/components/Container';
import SearchBar from './SearchBar';
import { LucideOctagon, ShoppingCart } from 'lucide-react';
import Categories from './Categories';
import { Navbar as NavbarType } from '@/payload-types';
import Image from 'next/image';

async function Navbar() {
    // Fetch Navbar global data from Payload
    const payload = await getPayload({ config });
    const navbarData: NavbarType = await payload.findGlobal({
        slug: 'navbar',
    });

    // Limit to maximum 7 categories
    const displayedCategories = navbarData.categories.slice(0, 7);

    return (
        <div className="w-full bg-white z-10 shadow-sm">
            <div className="py-4">
                <Container>
                    <div className="flex flex-row items-center justify-between gap-3 md:gap-6 py-4">
                        {/* Search Bar Icon (Left) */}
                        <div className="flex-shrink-0">
                            <SearchBar />
                        </div>

                        {/* Logo (Center) */}
                        <div className="absolute left-1/2 transform -translate-x-1/2">
                            <Link href="/">
                                <Image src="/logo.svg" alt="Logo" width={80} height={80} />
                            </Link>
                        </div>

                        {/* Shopping Cart (Right) */}
                        <div className="flex-shrink-0">
                            <Link href="/cart">
                                <ShoppingCart className="text-black w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
            <Categories categories={displayedCategories} />
        </div>
    );
}

export default Navbar;