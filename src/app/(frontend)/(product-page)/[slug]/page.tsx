import { notFound } from 'next/navigation';
import { getPayload, JsonObject } from 'payload';
import config from '@/payload.config';
import { Product } from '@/payload-types';
import ProductDetails from '../product-details';
import { JSX } from 'react';

// export const revalidate = 60;

// Interface for the Lexical JSON structure
interface LexicalTextNode {
    mode?: string;
    text?: string;
    type: string;
    style?: string;
    detail?: number;
    format?: number | string;
    version: number;
    children?: LexicalNode[];
    direction?: string | null;
    textStyle?: string;
    textFormat?: number;
}

interface LexicalNode {
    type: string;
    format?: string | number;
    indent?: number;
    version: number;
    children?: LexicalNode[];
    direction?: string | null;
    textStyle?: string;
    textFormat?: number;
}

interface LexicalJSON {
    root: {
        type: string;
        children: LexicalNode[];
        direction: 'ltr' | 'rtl' | null;
        format: string;
        indent: number;
        version: number;
    };
}

// Function to render Lexical JSON content
const renderLexicalContent = (jsonContent: JsonObject): JSX.Element => {
    try {
        // Parse the content if it's a string
        const content: LexicalJSON = typeof jsonContent === 'string'
            ? JSON.parse(jsonContent)
            : jsonContent;

        if (!content || !content.root || !content.root.children) {
            return <p>No description available</p>;
        }

        return (
            <div className="lexical-content">
                {content.root.children.map((node, index) => {
                    if (node.type === 'paragraph') {
                        const textContent = node.children
                            ?.filter((child) => child.type === 'text')
                            .map((textNode: LexicalTextNode) => textNode.text)
                            .join(' ');

                        if (!textContent) return null;

                        // Apply different formatting based on node format
                        let className = '';
                        if (node.format === 'center') className = 'text-center';
                        else if (node.format === 'end' || node.format === 'right') className = 'text-right';

                        return (
                            <p key={index} className={`mb-4 ${className}`}>
                                {textContent}
                            </p>
                        );
                    }
                    return null;
                })}
            </div>
        );
    } catch (error) {
        console.error('Error rendering Lexical content:', error);
        return <p>Error displaying product description</p>;
    }
};

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;

    // Fetch the product by slug
    const payload = await getPayload({ config });
    const productResult = await payload.find({
        collection: 'products',
        where: { slug: { equals: slug } },
        limit: 1,
    });

    // If no product is found, return 404
    if (!productResult.docs || productResult.docs.length === 0) {
        notFound();
    }

    const product: Product = productResult.docs[0];
    const descriptionContent = renderLexicalContent(product.description);

    return <ProductDetails product={product} descriptionContent={descriptionContent} />;
}