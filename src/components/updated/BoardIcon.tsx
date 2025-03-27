import React from 'react';

const BoardIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 8h20" />
    <path d="M6 12h4" />
    <path d="M6 16h4" />
    <path d="M14 12h4" />
    <path d="M14 16h4" />
  </svg>
);

export default BoardIcon;
