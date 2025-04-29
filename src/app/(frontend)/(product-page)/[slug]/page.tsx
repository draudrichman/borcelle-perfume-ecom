import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { Product } from '@/payload-types';
import ProductDetails from '../product-details';
import { JSX, CSSProperties, ReactNode } from 'react';

// Define Lexical node interfaces with strict typing
interface LexicalTextNode {
    mode?: string;
    text?: string;
    type: string;
    style?: string;
    detail?: number;
    format?: number; // Lexical uses numbers for text format (e.g., 1 for bold)
    version: number;
    [k: string]: unknown;
}

interface LexicalLinebreakNode {
    type: string;
    version: number;
    [k: string]: unknown;
}

interface LexicalParagraphNode {
    type: string;
    format?: string; // e.g., 'center', 'right'
    indent?: number;
    version: number;
    children?: LexicalNode[];
    direction?: 'ltr' | 'rtl' | null;
    textStyle?: string;
    textFormat?: number;
    [k: string]: unknown;
}

type LexicalNode = LexicalTextNode | LexicalLinebreakNode | LexicalParagraphNode | { type: string; version: number;[k: string]: unknown };

interface LexicalJSON {
    root: {
        type: string;
        children: LexicalNode[];
        direction?: 'ltr' | 'rtl' | null;
        format: string;
        indent: number;
        version: number;
    };
    [k: string]: unknown;
}

// Function to render individual Lexical nodes
const renderNode = (node: LexicalNode, index: number): JSX.Element | null => {
    switch (node.type) {
        case 'paragraph': {
            const paragraphNode = node as LexicalParagraphNode;
            let className = '';
            if (paragraphNode.format === 'center') className = 'text-center';
            else if (paragraphNode.format === 'end' || paragraphNode.format === 'right') className = 'text-right';

            return (
                <p key={index} className={`mb-4 ${className}`}>
                    {paragraphNode.children?.map((child, childIndex) => renderNode(child, childIndex))}
                </p>
            );
        }
        case 'text': {
            const textNode = node as LexicalTextNode;
            const style: CSSProperties = {};

            // Apply formatting (e.g., bold for format: 1)
            if (textNode.format === 1) {
                style.fontWeight = 'bold';
            }

            return (
                <span key={index} style={style}>
                    {textNode.text ?? ''}
                </span>
            );
        }
        case 'linebreak': {
            return <br key={index} />;
        }
        default:
            return null;
    }
};

// Function to render Lexical JSON content
const renderLexicalContent = (jsonContent: string | LexicalJSON | undefined): JSX.Element => {
    try {
        // Handle JSONField which could be string, object, or undefined
        if (!jsonContent) {
            return <p>No description available</p>;
        }

        const content: LexicalJSON = typeof jsonContent === 'string'
            ? JSON.parse(jsonContent)
            : jsonContent;

        if (!content?.root?.children?.length) {
            return <p>No description available</p>;
        }

        return (
            <div className="lexical-content">
                {content.root.children.map((node, index) => renderNode(node, index))}
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
    if (!productResult.docs?.length) {
        notFound();
    }

    const product: Product = productResult.docs[0];

    // Ensure description is passed correctly
    const descriptionContent = renderLexicalContent(product.description);

    return <ProductDetails product={product} descriptionContent={descriptionContent} loading={false} />;
}

