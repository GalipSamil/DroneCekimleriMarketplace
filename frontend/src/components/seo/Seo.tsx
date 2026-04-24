import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { JsonLd } from '../../config/seo';
import { DEFAULT_SOCIAL_IMAGE_ALT, DEFAULT_SOCIAL_IMAGE_URL, SITE_NAME, toAbsoluteAssetUrl, toAbsoluteUrl } from '../../config/seo';
import { trackPageView } from '../../utils/analytics';

type SeoProps = {
    title: string;
    description: string;
    path?: string;
    noindex?: boolean;
    type?: 'website' | 'article' | 'profile';
    image?: string;
    imageAlt?: string;
    schema?: JsonLd | JsonLd[];
};

const upsertMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
    let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
    }

    tag.setAttribute('content', content);
};

const upsertCanonical = (href: string) => {
    let tag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!tag) {
        tag = document.createElement('link');
        tag.setAttribute('rel', 'canonical');
        document.head.appendChild(tag);
    }

    tag.setAttribute('href', href);
};

const upsertSchema = (schema?: JsonLd | JsonLd[]) => {
    const existing = document.head.querySelector<HTMLScriptElement>('script[data-seo-schema="route"]');

    if (!schema) {
        existing?.remove();
        return;
    }

    const tag = existing ?? document.createElement('script');

    if (!existing) {
        tag.type = 'application/ld+json';
        tag.setAttribute('data-seo-schema', 'route');
        document.head.appendChild(tag);
    }

    tag.textContent = JSON.stringify(schema);
};

export default function Seo({ title, description, path, noindex = false, type = 'website', image, imageAlt, schema }: SeoProps) {
    const location = useLocation();

    useEffect(() => {
        const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
        const canonicalUrl = toAbsoluteUrl(path ?? location.pathname);
        const robots = noindex ? 'noindex, nofollow' : 'index, follow';
        const socialImageUrl = toAbsoluteAssetUrl(image) ?? DEFAULT_SOCIAL_IMAGE_URL;
        const socialImageAlt = imageAlt?.trim() || DEFAULT_SOCIAL_IMAGE_ALT;

        document.title = fullTitle;

        upsertMetaTag('name', 'description', description);
        upsertMetaTag('name', 'robots', robots);
        upsertMetaTag('property', 'og:site_name', SITE_NAME);
        upsertMetaTag('property', 'og:title', fullTitle);
        upsertMetaTag('property', 'og:description', description);
        upsertMetaTag('property', 'og:type', type);
        upsertMetaTag('property', 'og:url', canonicalUrl);
        upsertMetaTag('property', 'og:image', socialImageUrl);
        upsertMetaTag('property', 'og:image:secure_url', socialImageUrl);
        upsertMetaTag('property', 'og:image:alt', socialImageAlt);
        upsertMetaTag('name', 'twitter:card', 'summary_large_image');
        upsertMetaTag('name', 'twitter:title', fullTitle);
        upsertMetaTag('name', 'twitter:description', description);
        upsertMetaTag('name', 'twitter:image', socialImageUrl);
        upsertMetaTag('name', 'twitter:image:alt', socialImageAlt);
        upsertCanonical(canonicalUrl);
        upsertSchema(schema);
        trackPageView(canonicalUrl, fullTitle);
    }, [description, image, imageAlt, location.pathname, noindex, path, schema, title, type]);

    return null;
}
