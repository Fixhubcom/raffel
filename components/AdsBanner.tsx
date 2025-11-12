import React, { useState, useEffect } from 'react';
import type { Ad } from '../types';

interface AdsBannerProps {
    ads: Ad[];
}

export const AdsBanner: React.FC<AdsBannerProps> = ({ ads }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (ads.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % ads.length);
        }, 5000); // Change ad every 5 seconds

        return () => clearInterval(interval);
    }, [ads.length]);

    if (!ads || ads.length === 0) {
        return null;
    }

    const currentAd = ads[currentIndex];

    const themeClasses = {
        pink: { button: 'bg-cyber-pink shadow-glow-pink', border: 'border-cyber-pink' },
        yellow: { button: 'bg-star-yellow text-space-dark shadow-glow-yellow', border: 'border-star-yellow' },
        green: { button: 'bg-nova-green shadow-glow-green', border: 'border-nova-green' },
        blue: { button: 'bg-blue-500 shadow-glow-blue', border: 'border-blue-500' },
    };
    
    const config = themeClasses[currentAd.theme];

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    }

    return (
        <section
            key={currentAd.id} // Re-trigger animation on change
            className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-space-border shadow-lg bg-cover bg-center animate-ad-fade-in"
            style={{ backgroundImage: `url(${currentAd.imageUrl})` }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-space-dark/90 via-space-dark/70 to-transparent p-6 md:p-8 flex flex-col justify-center items-start">
                <div className="max-w-md">
                    <h2 className="text-2xl md:text-4xl font-bold text-white tracking-wider" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>
                        {currentAd.title}
                    </h2>
                    <p className="mt-2 text-sm md:text-base text-gray-300">
                        {currentAd.description}
                    </p>
                    <button className={`mt-6 font-bold py-2 px-6 rounded-lg transition-transform hover:scale-105 ${config.button}`}>
                        {currentAd.ctaText}
                    </button>
                </div>
            </div>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {ads.map((_, slideIndex) => (
                    <button
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
                        aria-label={`Go to slide ${slideIndex + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};