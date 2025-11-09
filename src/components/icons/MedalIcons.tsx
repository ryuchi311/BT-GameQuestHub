
import React from 'react';

export const GoldMedalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FFD700' }} />
                <stop offset="100%" style={{ stopColor: '#FFA500' }} />
            </linearGradient>
        </defs>
        <path d="M12 15.5L15.5 18L14.5 14L17.5 11.5H13.5L12 7.5L10.5 11.5H6.5L9.5 14L8.5 18L12 15.5Z" fill="url(#gold-gradient)" stroke="#B8860B" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="10" stroke="#B8860B" strokeWidth="1.5"/>
    </svg>
);

export const SilverMedalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id="silver-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#C0C0C0' }} />
                <stop offset="100%" style={{ stopColor: '#A9A9A9' }} />
            </linearGradient>
        </defs>
        <path d="M12 15.5L15.5 18L14.5 14L17.5 11.5H13.5L12 7.5L10.5 11.5H6.5L9.5 14L8.5 18L12 15.5Z" fill="url(#silver-gradient)" stroke="#808080" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="10" stroke="#808080" strokeWidth="1.5"/>
    </svg>
);

export const BronzeMedalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id="bronze-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#CD7F32' }} />
                <stop offset="100%" style={{ stopColor: '#A0522D' }} />
            </linearGradient>
        </defs>
        <path d="M12 15.5L15.5 18L14.5 14L17.5 11.5H13.5L12 7.5L10.5 11.5H6.5L9.5 14L8.5 18L12 15.5Z" fill="url(#bronze-gradient)" stroke="#8B4513" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="10" stroke="#8B4513" strokeWidth="1.5"/>
    </svg>
);
