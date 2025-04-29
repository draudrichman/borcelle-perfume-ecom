import { getPayload } from 'payload';
import config from '@/payload.config';
import Container from '@/components/Container';
import Categories from './Categories';
import NavbarClient from './navbar-client';

async function Navbar() {
    // Fetch Navbar global data from Payload
    const payload = await getPayload({ config });
    const navbarData = await payload.findGlobal({
        slug: 'navbar',
    });

    // Limit to maximum 7 categories
    const displayedCategories = navbarData.categories.slice(0, 7);

    return (
        <div className="w-full bg-white z-10 shadow-sm">
            <div className="py-4">
                <Container>
                    <NavbarClient />
                </Container>
            </div>
            <div className="hidden sm:block">
                <Categories categories={displayedCategories} />
            </div>
        </div>
    );
}

export default Navbar;