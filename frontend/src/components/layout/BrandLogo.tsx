import React from 'react';
import logoUrl from '../../assets/dronepazar-mark.svg';

interface BrandLogoProps {
    className?: string;
    imageClassName?: string;
    alt?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({
    className = '',
    imageClassName = '',
    alt = 'DronePazar',
}) => (
    <span className={`inline-flex items-center ${className}`.trim()}>
        <img
            src={logoUrl}
            alt={alt}
            className={`block h-auto w-auto max-w-full object-contain ${imageClassName}`.trim()}
            draggable={false}
        />
    </span>
);

export default BrandLogo;
