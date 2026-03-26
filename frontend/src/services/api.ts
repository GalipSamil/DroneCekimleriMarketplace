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
    CreateReviewDto
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5025/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
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

// Auth API
export const authAPI = {
    register: async (data: RegisterDto) => {
        const response = await api.post('/Auth/register', data);
        return response.data;
    },

    login: async (data: LoginDto) => {
        const response = await api.post('/Auth/login', data);
        return response.data;
    },

    forgotPassword: async (data: ForgotPasswordDto) => {
        const response = await api.post('/Auth/forgot-password', data);
        return response.data;
    },

    resetPassword: async (data: ResetPasswordDto) => {
        const response = await api.post('/Auth/reset-password', data);
        return response.data;
    },
};

// Pilot API
export const pilotAPI = {
    createOrUpdateProfile: async (profile: Partial<PilotProfile>) => {
        const response = await api.post(`/Pilots/profile`, profile);
        return response.data;
    },

    getProfile: async (userId: string) => {
        const response = await api.get<PilotProfile>(`/Pilots/profile/${userId}`);
        return response.data;
    },

    searchPilots: async (latitude?: number, longitude?: number, radius?: number) => {
        const params = new URLSearchParams();
        if (latitude) params.append('latitude', latitude.toString());
        if (longitude) params.append('longitude', longitude.toString());
        if (radius) params.append('radiusKm', radius.toString());

        const response = await api.get<PilotProfile[]>(`/Pilots/search?${params}`);
        return response.data;
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
        const response = await api.post('/Bookings', bookingData);
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Booking>(`/Bookings/${id}`);
        return response.data;
    },

    getCustomerBookings: async (customerId: string) => {
        const response = await api.get<Booking[]>(`/Bookings/customer/${customerId}`);
        return response.data;
    },

    getPilotBookings: async (pilotUserId: string) => {
        const response = await api.get<Booking[]>(`/Bookings/pilot/${pilotUserId}`);
        return response.data;
    },

    updateStatus: async (id: string, status: BookingStatus, notes?: string) => {
        const response = await api.put(`/Bookings/${id}/status`, { status, notes });
        return response.data;
    },

    cancel: async (id: string, reason: string) => {
        const response = await api.put(`/Bookings/${id}/cancel`, { reason });
        return response.data;
    },

    calculatePrice: async (serviceId: string, type: number, startDate: string, endDate: string) => {
        const params = new URLSearchParams({
            serviceId,
            type: type.toString(),
            startDate,
            endDate
        });

        const response = await api.get<{ price: number }>(`/Bookings/calculate-price?${params}`);
        return response.data;
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
    create: async (data: CreateReviewDto): Promise<Review> => {
        const response = await api.post('/Reviews', data);
        return response.data;
    },
    getByPilot: async (pilotId: string): Promise<Review[]> => {
        const response = await api.get(`/Reviews/pilot/${pilotId}`);
        return response.data;
    },
    getByBooking: async (bookingId: string): Promise<Review> => {
        const response = await api.get(`/Reviews/booking/${bookingId}`);
        return response.data;
    }
};




