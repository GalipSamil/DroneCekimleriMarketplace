import type { CustomRequest } from '../types';

const STORAGE_KEY = 'skyMarket.customRequests';

const readRequests = (): CustomRequest[] => {
    if (typeof window === 'undefined') return [];

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const writeRequests = (requests: CustomRequest[]) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
};

export const customRequestStore = {
    list: () => readRequests().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    create: (payload: Omit<CustomRequest, 'id' | 'createdAt'>) => {
        const nextRequest: CustomRequest = {
            ...payload,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };

        const current = readRequests();
        writeRequests([nextRequest, ...current]);
        return nextRequest;
    },
};
