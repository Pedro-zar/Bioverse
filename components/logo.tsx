import React from 'react';
import Image from 'next/image'

const Logo: React.FC = () => {
  return (
    <div style={{ padding: '1rem', display: 'flex', alignItems: 'center' }}>
        <Image src="/images/bioverse-logo.svg" alt="Logo da Empresa" style={{ height: '33px' }} />
    </div>
  );
};

export default Logo;
