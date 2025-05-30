
import React from 'react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="p-3 bg-gray-900 text-center shadow-lg sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-emerald-400 tracking-wider">{title}</h1>
    </header>
  );
};