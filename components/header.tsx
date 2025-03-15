import React, { ReactNode } from 'react';
import Logo from './logo';
import Link from 'next/link';

interface HeaderProps {
  children: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <div
      style={{
        width: '100%',
        background: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem', 
        boxSizing: 'border-box',
      }}
    >
      <div style={{
          fontFamily: "'Georgia', serif",  
          fontWeight: 'bold',
          fontSize: '1.5rem',
          color: '#000',
          marginRight: '1rem',
        }}>{children}</div>
      <Link href="/login">
        <Logo />
      </Link>
    </div>
  );
};

export default Header;
