import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import type { AppLanguage } from '../src/context/preferences';
import { PreferencesContext } from '../src/context/preferences';
import { DEFAULT_SOCIAL_IMAGE_ALT, DEFAULT_SOCIAL_IMAGE_URL, getPrerenderPaths, getSitemapEntries, getStaticSeo, SITE_NAME, SITE_URL } from '../src/config/seo';
import { seoLandingPagesByPath } from '../src/content/seoLandingPages';
import CityDirectory from '../src/pages/CityDirectory';
import SeoLandingPage from '../src/pages/SeoLandingPage';

const DEFAULT_LANGUAGE: AppLanguage = 'tr';
const DEFAULT_THEME = 'light';
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const distDirectory = path.resolve(currentDirectory, '..', 'dist');
const rootIndexPath = path.join(distDirectory, 'index.html');
const STATIC_SITEMAP_FILENAME = 'sitemap-static.xml';
const ROOT_PLACEHOLDER = '<div id="root"></div>';

const escapeHtml = (value: string) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const upsertTitle = (html: string, title: string) => {
    const titleTag = `<title>${escapeHtml(title)}</title>`;
    return /<title>.*<\/title>/s.test(html)
        ? html.replace(/<title>.*<\/title>/s, titleTag)
        : html.replace('</head>', `  ${titleTag}\n</head>`);
};

const upsertMetaTag = (html: string, attribute: 'name' | 'property', key: string, content: string) => {
    const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
    const pattern = new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`, 'i');

    return pattern.test(html)
        ? html.replace(pattern, tag)
        : html.replace('</head>', `  ${tag}\n</head>`);
};

const upsertCanonical = (html: string, canonicalUrl: string) => {
    const tag = `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`;
    const pattern = /<link\s+rel="canonical"[^>]*>/i;

    return pattern.test(html)
        ? html.replace(pattern, tag)
        : html.replace('</head>', `  ${tag}\n</head>`);
};

const upsertSchema = (html: string, schema: unknown) => {
    const tag = `<script type="application/ld+json" data-seo-schema="route">${JSON.stringify(schema)}</script>`;
    const pattern = /<script[^>]+data-seo-schema="route"[^>]*>[\s\S]*?<\/script>/i;

    return pattern.test(html)
        ? html.replace(pattern, tag)
        : html.replace('</head>', `  ${tag}\n</head>`);
};

const renderStaticMarkupForRoute = (routePath: string) => {
    const seoLandingPage = seoLandingPagesByPath.get(routePath);
    const pageElement = seoLandingPage
        ? createElement(SeoLandingPage, { page: seoLandingPage })
        : (routePath === '/drone-cekimi-sehirleri' ? createElement(CityDirectory) : null);

    if (!pageElement) {
        return null;
    }

    return renderToStaticMarkup(
        createElement(
            PreferencesContext.Provider,
            {
                value: {
                    language: DEFAULT_LANGUAGE,
                    theme: DEFAULT_THEME,
                    setLanguage: () => undefined,
                    setTheme: () => undefined,
                    toggleTheme: () => undefined,
                },
            },
            createElement(StaticRouter, { location: routePath }, pageElement)
        )
    );
};

const injectStaticMarkup = (html: string, routePath: string) => {
    const staticMarkup = renderStaticMarkupForRoute(routePath);

    if (!staticMarkup || !html.includes(ROOT_PLACEHOLDER)) {
        return html;
    }

    return html.replace(ROOT_PLACEHOLDER, `<div id="root">${staticMarkup}</div>`);
};

const applySeoToHtml = (html: string, routePath: string) => {
    const seo = getStaticSeo(routePath, DEFAULT_LANGUAGE);

    if (!seo) {
        throw new Error(`No static SEO configuration found for route: ${routePath}`);
    }

    const canonicalUrl = new URL(seo.path ?? routePath, SITE_URL).toString();
    const fullTitle = seo.title.includes(SITE_NAME) ? seo.title : `${seo.title} | ${SITE_NAME}`;
    const robots = seo.noindex ? 'noindex, nofollow' : 'index, follow';

    let result = html.replace(/<html lang="[^"]*">/i, '<html lang="tr">');
    result = upsertTitle(result, fullTitle);
    result = upsertMetaTag(result, 'name', 'description', seo.description);
    result = upsertMetaTag(result, 'name', 'robots', robots);
    result = upsertMetaTag(result, 'property', 'og:site_name', SITE_NAME);
    result = upsertMetaTag(result, 'property', 'og:title', fullTitle);
    result = upsertMetaTag(result, 'property', 'og:description', seo.description);
    result = upsertMetaTag(result, 'property', 'og:type', seo.type ?? 'website');
    result = upsertMetaTag(result, 'property', 'og:url', canonicalUrl);
    result = upsertMetaTag(result, 'property', 'og:image', seo.image ?? DEFAULT_SOCIAL_IMAGE_URL);
    result = upsertMetaTag(result, 'property', 'og:image:secure_url', seo.image ?? DEFAULT_SOCIAL_IMAGE_URL);
    result = upsertMetaTag(result, 'property', 'og:image:alt', seo.imageAlt ?? DEFAULT_SOCIAL_IMAGE_ALT);
    result = upsertMetaTag(result, 'name', 'twitter:card', 'summary_large_image');
    result = upsertMetaTag(result, 'name', 'twitter:title', fullTitle);
    result = upsertMetaTag(result, 'name', 'twitter:description', seo.description);
    result = upsertMetaTag(result, 'name', 'twitter:image', seo.image ?? DEFAULT_SOCIAL_IMAGE_URL);
    result = upsertMetaTag(result, 'name', 'twitter:image:alt', seo.imageAlt ?? DEFAULT_SOCIAL_IMAGE_ALT);
    result = upsertCanonical(result, canonicalUrl);

    if (seo.schema) {
        result = upsertSchema(result, seo.schema);
    }

    return injectStaticMarkup(result, routePath);
};

const createStaticSitemapXml = () => {
    const urls = getSitemapEntries().map((entry) => `  <url>
    <loc>${new URL(entry.path, SITE_URL).toString()}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`);

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
};

const createSitemapIndexXml = () => {
    const sitemapUrls = [
        new URL(`/${STATIC_SITEMAP_FILENAME}`, SITE_URL).toString(),
        new URL('/api/seo/sitemaps/listings.xml', SITE_URL).toString(),
        new URL('/api/seo/sitemaps/pilots.xml', SITE_URL).toString(),
    ];

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((sitemapUrl) => `  <sitemap>
    <loc>${sitemapUrl}</loc>
  </sitemap>`).join('\n')}
</sitemapindex>
`;
};

const getOutputFilePath = (routePath: string) => (
    routePath === '/'
        ? rootIndexPath
        : path.join(distDirectory, routePath.replace(/^\//, ''), 'index.html')
);

const main = async () => {
    const baseHtml = await readFile(rootIndexPath, 'utf8');
    const prerenderPaths = getPrerenderPaths();

    for (const routePath of prerenderPaths) {
        const outputFilePath = getOutputFilePath(routePath);
        await mkdir(path.dirname(outputFilePath), { recursive: true });
        await writeFile(outputFilePath, applySeoToHtml(baseHtml, routePath), 'utf8');
    }

    await writeFile(path.join(distDirectory, STATIC_SITEMAP_FILENAME), createStaticSitemapXml(), 'utf8');
    await writeFile(path.join(distDirectory, 'sitemap.xml'), createSitemapIndexXml(), 'utf8');
};

main().catch((error) => {
    console.error('SEO postbuild failed.');
    console.error(error);
    process.exitCode = 1;
});
