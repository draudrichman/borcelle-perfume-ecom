'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

const BrandsSection = () => {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const scrollerInnerRef = useRef<HTMLDivElement>(null);

    const logoCount = 6;
    const logos = Array.from({ length: logoCount }, (_, index) => ({
        name: `Logo${index + 1}`,
        src: `/featured/${index + 1}.svg`,
    }));

    useEffect(() => {
        // Only apply animation if user hasn't opted for reduced motion
        if (typeof window !== 'undefined' &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            addAnimation();
        }
    }, []);

    const addAnimation = () => {
        const scroller = scrollerRef.current;
        const scrollerInner = scrollerInnerRef.current;

        if (!scroller || !scrollerInner) return;

        // Add data-animated attribute
        scroller.setAttribute("data-animated", "true");

        // Clone all items for seamless scrolling
        const scrollerContent = Array.from(scrollerInner.children) as HTMLElement[];

        scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true) as HTMLElement;
            duplicatedItem.setAttribute("aria-hidden", "true");
            scrollerInner.appendChild(duplicatedItem);
        });
    };

    return (
        <div
            ref={scrollerRef}
            className="w-full bg-gray-900 py-2 sm:py-4 md:py-6 lg:py-8 scroller"
            data-direction="left"
            data-speed="fast"
        >
            <div
                ref={scrollerInnerRef}
                className="scroller__inner flex whitespace-nowrap"
            >
                {logos.map((logo, index) => (
                    <Image
                        key={`${logo.name}-${index}`}
                        src={logo.src}
                        alt={logo.name}
                        width={0}
                        height={40}
                        className="h-8 sm:h-10 md:h-[60px] lg:h-20 w-auto mx-5 inline-flex items-center brightness-0 invert"
                        unoptimized
                    />
                ))}
            </div>
        </div>
    );
};

export default BrandsSection;