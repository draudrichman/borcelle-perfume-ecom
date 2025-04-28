'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroImage {
    id: string;
    title: string;
    image: {
        url: string;
        alt?: string;
    };
}

interface HeroProps {
    images: HeroImage[];
}

export default function Hero({ images }: HeroProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-transition every 5 seconds
    useEffect(() => {
        if (images.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [images]);

    // Dynamic viewport height
    useEffect(() => {
        const updateVh = () => {
            try {
                const width = window.innerWidth;
                let vhValue;
                if (width >= 1024) {
                    vhValue = '70vh'; // Large screens
                } else if (width >= 640) {
                    vhValue = '60vh'; // Medium screens
                } else {
                    vhValue = '50vh'; // Small screens
                }
                document.documentElement.style.setProperty('--vh', vhValue);
            } catch (error) {
                console.error('Error setting --vh:', error);
                document.documentElement.style.setProperty('--vh', '80vh'); // Fallback
            }
        };

        updateVh(); // Set initial value
        window.addEventListener('resize', updateVh);

        return () => window.removeEventListener('resize', updateVh); // Cleanup
    }, []);

    if (images.length === 0) {
        return <div className="min-h-[0px] bg-gray-100 flex items-center justify-center">No images available</div>;
    }

    return (
        <section className="relative w-full overflow-hidden bg-gray-100">
            <div className="relative w-full flex items-center justify-center" style={{ height: 'var(--vh, 70vh)' }}>
                {images.map((img, index) => (
                    <div
                        key={img.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <Image
                            src={img.image.url}
                            alt={img.image.alt || img.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="max-h-full"
                            onError={() => console.error(`Failed to load image: ${img.image.url}`)}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}