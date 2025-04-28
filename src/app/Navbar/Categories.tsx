'use client';

import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
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
    // const params = useSearchParams();
    // const category = params?.get('category');
    // const pathname = usePathname();
    // const isMainPage = pathname === '/';

    // if (!isMainPage) {
    //     return null;
    // }

    return (
        <Container>
            <div className="pt-6 pb-8 flex flex-row items-center justify-between">
                {categories.map((item) => (
                    <Link
                        key={item.id}
                        href={item.slug}
                        className={`text-sm uppercase font-medium text-gray-700 hover:text-teal-600`}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </Container>
    );
};

export default Categories;