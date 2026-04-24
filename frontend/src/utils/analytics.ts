declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
const GTAG_SCRIPT_ID = 'ga4-gtag-script';
let lastTrackedSignature = '';

export const isAnalyticsEnabled = Boolean(GA_MEASUREMENT_ID);

export const ensureAnalytics = () => {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || typeof document === 'undefined') {
        return;
    }

    if (!window.dataLayer) {
        window.dataLayer = [];
    }

    if (!window.gtag) {
        window.gtag = function gtag(...args: unknown[]) {
            window.dataLayer?.push(args);
        };
        window.gtag('js', new Date());
        window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
    }

    if (!document.getElementById(GTAG_SCRIPT_ID)) {
        const script = document.createElement('script');
        script.id = GTAG_SCRIPT_ID;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);
    }
};

export const trackPageView = (pageLocation: string, pageTitle: string) => {
    if (!GA_MEASUREMENT_ID) {
        return;
    }

    ensureAnalytics();

    const signature = `${pageLocation}::${pageTitle}`;

    if (signature === lastTrackedSignature) {
        return;
    }

    lastTrackedSignature = signature;

    window.gtag?.('event', 'page_view', {
        page_title: pageTitle,
        page_location: pageLocation,
        page_path: new URL(pageLocation).pathname,
        send_to: GA_MEASUREMENT_ID,
    });
};
