import React from 'react';

export const BathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 5.182a4.5 4.5 0 01.353 6.206l-4.173 4.173-1.06-1.06-4.174-4.173a4.5 4.5 0 116.364-6.364l.707.707.707-.707a4.5 4.5 0 016.053.353z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.364 17.636l1.06-1.06-4.173-4.173-1.06 1.06a4.5 4.5 0 006.173 6.173z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.243 16.243l-1.06-1.06-4.173 4.173 1.06 1.06a4.5 4.5 0 006.173-6.173z" />
    </svg>
);