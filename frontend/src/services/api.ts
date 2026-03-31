import axios from 'axios';
import type {
    RegisterDto,
    LoginDto,
    PilotProfile,
    Listing,
    CreateListingDto,
    UpdateListingDto,
    ServiceCategory,
    Drone,
    CreateDroneDto,
    DroneType,
    Booking,
    CreateBookingDto,
    BookingStatus,
    ApiResponse,
    MessageDto,
    ForgotPasswordDto,
    ResetPasswordDto,
    Review,
    CreateReviewDto,
    AdminOverviewDto,
    AdminUserDto,
    AdminBookingDto
} from '../types';

interface LoginResponseDto {
    userId: string;
    isPilot: boolean;
    token: string;
}

type LoginApiResponse = ApiResponse<LoginResponseDto> & Partial<LoginResponseDto>;
type RegisterApiResponse = ApiResponse<string> & {
    UserId?: string;
    userId?: string;
};

type ApiEnvelope<T> = Partial<ApiResponse<T>> & {
    Succeeded?: boolean;
    Message?: string;
    Data?: T;
    Errors?: string[];
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5025/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const isApiEnvelope = (value: unknown): value is ApiEnvelope<unknown> => {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const candidate = value as Record<string, unknown>;
    return 'Succeeded' in candidate
        || 'Message' in candidate
        || 'Data' in candidate
        || 'Errors' in candidate
        || 'succeeded' in candidate
        || 'message' in candidate
        || 'data' in candidate
        || 'errors' in candidate;
};

const normalizeApiResponse = <T>(value: ApiEnvelope<T>): ApiResponse<T> => ({
    succeeded: value.succeeded ?? value.Succeeded ?? false,
    message: value.message ?? value.Message ?? '',
    data: value.data ?? value.Data as T,
    errors: value.errors ?? value.Errors ?? [],
});

api.interceptors.request.use((config) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (userId) {
        config.headers['X-User-Id'] = userId;
    }

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use((response) => {
    if (isApiEnvelope(response.data)) {
        response.data = normalizeApiResponse(response.data);
    }

    return response;
});

export const extractApiErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError(error)) {
        const payload = error.response?.data as ApiEnvelope<unknown> | string | undefined;

        if (typeof payload === 'string' && payload.trim()) {
            return payload;
        }

        if (payload && typeof payload === 'object') {
            const normalized = normalizeApiResponse(payload);
            const firstError = normalized.errors?.find(Boolean);
            return normalized.message || firstError || fallback;
        }
    }

    if (error instanceof Error && error.message.trim()) {
        return error.message;
    }

    return fallback;
};

// Auth API
export const authAPI = {
    register: async (data: RegisterDto) => {
        const response = await api.post<ApiResponse<string>>('/Auth/register', data);
        return {
            ...response.data,
            UserId: response.data.data,
            userId: response.data.data
        } satisfies RegisterApiResponse;
    },

    login: async (data: LoginDto) => {
        const response = await api.post<ApiResponse<LoginResponseDto>>('/Auth/login', data);
        return {
            ...response.data,
            userId: response.data.data?.userId,
            isPilot: response.data.data?.isPilot,
            token: response.data.data?.token
        } satisfies LoginApiResponse;
    },

    forgotPassword: async (data: ForgotPasswordDto) => {
        const response = await api.post<ApiResponse<string>>('/Auth/forgot-password', data);
        return response.data;
    },

    resetPassword: async (data: ResetPasswordDto) => {
        const response = await api.post<ApiResponse<string>>('/Auth/reset-password', data);
        return response.data;
    },
};

// Pilot API
export const pilotAPI = {
    createOrUpdateProfile: async (userId: string, profile: Partial<PilotProfile>) => {
        const response = await api.put<ApiResponse<PilotProfile>>(`/Pilots/profile/${userId}`, profile);
        return response.data.data;
    },

    getProfile: async (userId: string) => {
        const response = await api.get<ApiResponse<PilotProfile>>(`/Pilots/profile/${userId}`);
        return response.data.data;
    },

    getMyProfile: async () => {
        const response = await api.get<ApiResponse<PilotProfile>>(`/Pilots/profile/me`);
        return response.data.data;
    },

    searchPilots: async (latitude?: number, longitude?: number, radius?: number) => {
        const params = new URLSearchParams();
        if (latitude !== undefined) params.append('latitude', latitude.toString());
        if (longitude !== undefined) params.append('longitude', longitude.toString());
        if (radius !== undefined) params.append('radiusKm', radius.toString());

        const response = await api.get<ApiResponse<PilotProfile[]>>(`/Pilots/search?${params}`);
        return response.data.data;
    },
};



// Listing API
export const listingAPI = {
    create: async (serviceData: CreateListingDto) => {
        const response = await api.post<ApiResponse<string>>('/Listings', serviceData);
        return response.data.data;
    },

    getById: async (id: string) => {
        const response = await api.get<ApiResponse<Listing>>(`/Listings/${id}`);
        return response.data.data;
    },

    search: async (query?: string, category?: ServiceCategory) => {
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        if (category !== undefined) params.append('category', category.toString());

        const response = await api.get<ApiResponse<Listing[]>>(`/Listings/search?${params}`);
        return response.data.data;
    },

    getByPilot: async (userId: string) => {
        const response = await api.get<ApiResponse<Listing[]>>(`/Listings/pilot/${userId}`);
        return response.data.data;
    },

    getMine: async () => {
        const response = await api.get<ApiResponse<Listing[]>>('/Listings/my-listings');
        return response.data.data;
    },

    getByLocation: async (latitude: number, longitude: number, radiusKm: number = 50) => {
        const params = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            radiusKm: radiusKm.toString()
        });

        const response = await api.get<ApiResponse<Listing[]>>(`/Listings/location?${params}`);
        return response.data.data;
    },

    update: async (id: string, serviceData: UpdateListingDto) => {
        const response = await api.put<ApiResponse<boolean>>(`/Listings/${id}`, serviceData);
        return response.data.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<ApiResponse<boolean>>(`/Listings/${id}`);
        return response.data.data;
    },
};

// Drone Management API
export const droneAPI = {
    create: async (droneData: CreateDroneDto) => {
        const response = await api.post('/Drones', droneData);
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Drone>(`/Drones/${id}`);
        return response.data;
    },

    getByPilot: async (pilotUserId: string) => {
        const response = await api.get<Drone[]>(`/Drones/pilot/${pilotUserId}`);
        return response.data;
    },

    getAvailable: async (type?: DroneType) => {
        const params = type !== undefined ? `?type=${type}` : '';
        const response = await api.get<Drone[]>(`/Drones/available${params}`);
        return response.data;
    },

    update: async (id: string, droneData: Partial<CreateDroneDto>) => {
        const response = await api.put(`/Drones/${id}`, droneData);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/Drones/${id}`);
        return response.data;
    },

    setAvailability: async (id: string, isAvailable: boolean) => {
        const response = await api.put(`/Drones/${id}/availability`, { isAvailable });
        return response.data;
    },
};

// Booking API
export const bookingAPI = {
    create: async (bookingData: CreateBookingDto) => {
        const response = await api.post<ApiResponse<string>>('/Bookings', bookingData);
        return response.data.data;
    },

    getById: async (id: string) => {
        const response = await api.get<ApiResponse<Booking>>(`/Bookings/${id}`);
        return response.data.data;
    },

    getCustomerBookings: async (customerId: string) => {
        const response = await api.get<ApiResponse<Booking[]>>(`/Bookings/customer/${customerId}`);
        return response.data.data ?? [];
    },

    getPilotBookings: async (pilotUserId: string) => {
        const response = await api.get<ApiResponse<Booking[]>>(`/Bookings/pilot/${pilotUserId}`);
        return response.data.data ?? [];
    },

    updateStatus: async (id: string, status: BookingStatus, notes?: string) => {
        const response = await api.put<ApiResponse<boolean>>(`/Bookings/${id}/status`, { status, notes });
        return response.data.data;
    },

    cancel: async (id: string, reason: string) => {
        const response = await api.put<ApiResponse<boolean>>(`/Bookings/${id}/cancel`, { reason });
        return response.data.data;
    },

    calculatePrice: async (serviceId: string, type: number, startDate: string, endDate: string) => {
        const params = new URLSearchParams({
            serviceId,
            type: type.toString(),
            startDate,
            endDate
        });

        const response = await api.get<ApiResponse<number>>(`/Bookings/calculate-price?${params}`);
        return response.data.data ?? 0;
    },
};

// Chat API
export const chatAPI = {
    getConversation: async (userId: string) => {
        const response = await api.get<ApiResponse<MessageDto[]>>(`/Chat/conversation/${userId}`);
        return response.data.data;
    },

    getRecentMessages: async () => {
        const response = await api.get<ApiResponse<MessageDto[]>>('/Chat/recent');
        return response.data.data;
    },

    getUnreadCount: async () => {
        const response = await api.get<ApiResponse<number>>('/Chat/unread');
        return response.data.data;
    }
};

// Review API
export const reviewAPI = {
    create: async (data: CreateReviewDto): Promise<Review | undefined> => {
        const response = await api.post<ApiResponse<Review>>('/Reviews', data);
        return response.data.data;
    },
    getByPilot: async (pilotId: string): Promise<Review[]> => {
        const response = await api.get<ApiResponse<Review[]>>(`/Reviews/pilot/${pilotId}`);
        return response.data.data ?? [];
    },
    getByBooking: async (bookingId: string): Promise<Review | undefined> => {
        const response = await api.get<ApiResponse<Review>>(`/Reviews/booking/${bookingId}`);
        return response.data.data;
    }
};

// Admin API
export const adminAPI = {
    getOverview: async () => {
        const response = await api.get<ApiResponse<AdminOverviewDto>>('/Admin/overview');
        return response.data.data;
    },
    getUsers: async () => {
        const response = await api.get<ApiResponse<AdminUserDto[]>>('/Admin/users');
        return response.data.data;
    },
    getBookings: async () => {
        const response = await api.get<ApiResponse<AdminBookingDto[]>>('/Admin/bookings');
        return response.data.data;
    },
    approvePilot: async (pilotProfileId: string) => {
        const response = await api.put<ApiResponse<boolean>>(`/Pilots/${pilotProfileId}/verify`);
        return response.data;
    },
    deleteUser: async (userId: string) => {
        const response = await api.delete<ApiResponse<boolean>>(`/Admin/users/${userId}`);
        return response.data;
    }
};
