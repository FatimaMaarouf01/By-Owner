
import React from 'react';

const LanguageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5h12M9 3v2m4.25 16h-6.5A2.25 2.25 0 013 18.75V10.5A2.25 2.25 0 015.25 8h1.5a2.25 2.25 0 012.25 2.25v.75m3 3v2m3-11h-3a2.25 2.25 0 00-2.25 2.25v7.5A2.25 2.25 0 0015 21h3a2.25 2.25 0 002.25-2.25v-7.5A2.25 2.25 0 0018 9h-3m-3-4v2"
    />
  </svg>
);

export default LanguageIcon;
