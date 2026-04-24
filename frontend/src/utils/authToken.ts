type JwtPayload = Record<string, unknown>;

type AuthFlags = {
    isAdmin: boolean;
    isPilot: boolean;
};

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

const decodeBase64Url = (value: string) => {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), '=');
    return atob(padded);
};

const parseJwtPayload = (token: string): JwtPayload | null => {
    try {
        const [, payload] = token.split('.');

        if (!payload) {
            return null;
        }

        return JSON.parse(decodeBase64Url(payload)) as JwtPayload;
    } catch {
        return null;
    }
};

const readRoles = (payload: JwtPayload) => {
    const rawRoles = payload[ROLE_CLAIM] ?? payload.role ?? payload.roles;

    if (Array.isArray(rawRoles)) {
        return rawRoles
            .filter((role): role is string => typeof role === 'string')
            .map(role => role.toLowerCase());
    }

    if (typeof rawRoles === 'string') {
        return [rawRoles.toLowerCase()];
    }

    return [];
};

export const getAuthFlagsFromToken = (token: string | null | undefined): AuthFlags => {
    if (!token) {
        return { isAdmin: false, isPilot: false };
    }

    const payload = parseJwtPayload(token);

    if (!payload) {
        return { isAdmin: false, isPilot: false };
    }

    const roles = readRoles(payload);
    const isPilotClaim = payload.IsPilot === true || payload.IsPilot === 'true' || payload.IsPilot === 'True';

    return {
        isAdmin: roles.includes('admin'),
        isPilot: roles.includes('pilot') || isPilotClaim,
    };
};
