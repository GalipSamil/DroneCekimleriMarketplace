type ServiceRouteInput = {
    id: string;
    title: string;
};

type PilotRouteInput = {
    userId: string;
    fullName: string;
};

const transliterateForSlug = (value: string) => value
    .replace(/[cç]/gi, 'c')
    .replace(/[gğ]/gi, 'g')
    .replace(/[iıİI]/g, 'i')
    .replace(/[oö]/gi, 'o')
    .replace(/[sş]/gi, 's')
    .replace(/[uü]/gi, 'u');

export const slugifySegment = (value: string) => {
    const normalized = transliterateForSlug(value)
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');

    return normalized || 'detay';
};

export const buildServicePath = ({ id, title }: ServiceRouteInput) => (
    `/service/${encodeURIComponent(id)}/${slugifySegment(title)}`
);

export const buildServiceIdPath = (id: string) => `/service/${encodeURIComponent(id)}`;

export const buildPilotProfilePath = ({ userId, fullName }: PilotRouteInput) => (
    `/pilot/${encodeURIComponent(userId)}/${slugifySegment(fullName)}`
);

export const buildPilotProfileIdPath = (userId: string) => `/pilot/${encodeURIComponent(userId)}`;

export const buildPilotServicesPath = (pilot: PilotRouteInput) => (
    `${buildPilotProfilePath(pilot)}/services`
);

export const buildPilotServicesIdPath = (userId: string) => `/pilot/${encodeURIComponent(userId)}/services`;

export const isExpectedSlug = (slug: string | undefined, expectedValue: string) => (
    slug === slugifySegment(expectedValue)
);
