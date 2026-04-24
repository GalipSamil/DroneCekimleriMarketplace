const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const resolveApiBaseUrl = () => {
    const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();

    if (configuredBaseUrl) {
        return trimTrailingSlash(configuredBaseUrl);
    }

    if (import.meta.env.DEV) {
        return 'http://localhost:5025/api';
    }

    return `${trimTrailingSlash(window.location.origin)}/api`;
};

export const API_BASE_URL = resolveApiBaseUrl();
export const SIGNALR_HUB_URL = `${API_BASE_URL.replace(/\/api$/, '')}/chathub`;
export const PASSWORD_RESET_ENABLED = import.meta.env.VITE_ENABLE_PASSWORD_RESET === 'true';
