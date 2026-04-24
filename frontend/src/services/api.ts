import axios from 'axios';
import type {
    RegisterDto,
    LoginDto,
    PilotProfile,
    UpdatePilotProfileDto,
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
    ContactMessageDto,
    CreateCustomRequestDto,
    ForgotPasswordDto,
    ResetPasswordDto,
    Review,
    CreateReviewDto,
    AdminOverviewDto,
    AdminUserDto,
    AdminBookingDto,
    CustomRequest
} from '../types';
import { API_BASE_URL } from '../config/runtime';
import type { AppLanguage } from '../context/preferences';

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
    Errors?: unknown;
};

type ValidationErrors = Record<string, string[]>;
const LANGUAGE_STORAGE_KEY = 'app-language';

const getCurrentLanguage = (): AppLanguage => (
    localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'en' ? 'en' : 'tr'
);

type LocalizedErrorPattern = {
    matches: string[];
    tr: string;
    en: string;
};

const LOCALIZED_ERROR_PATTERNS: LocalizedErrorPattern[] = [
    {
        matches: ['one or more validation errors occurred'],
        tr: 'Gönderilen bilgiler doğrulanamadı. Lütfen alanları kontrol edin.',
        en: 'Submitted data could not be validated. Please check the fields.'
    },
    {
        matches: ['email already exists', 'email is already taken', 'duplicate email', 'duplicateusername', 'user already exists', 'bu email zaten kullaniliyor', 'bu email zaten kayıtlı', 'bu email zaten kayitli'],
        tr: 'Bu e-posta adresi zaten kayıtlı.',
        en: 'This email address is already registered.'
    },
    {
        matches: ['invalid email or password', 'invalid credentials', 'geçersiz email veya şifre', 'gecersiz email veya sifre'],
        tr: 'E-posta veya şifre hatalı.',
        en: 'Incorrect email or password.'
    },
    {
        matches: ['unauthorized', 'yetkisiz'],
        tr: 'Bu işlem için giriş yapmanız gerekiyor.',
        en: 'You need to sign in to perform this action.'
    },
    {
        matches: ['forbidden', 'yasak', 'bu işlemi gerçekleştirme yetkiniz yok', 'bu islemi gerceklestirme yetkiniz yok'],
        tr: 'Bu işlem için yetkiniz yok.',
        en: 'You do not have permission to perform this action.'
    },
    {
        matches: ['not found', 'bulunamadı', 'bulunamadi'],
        tr: 'İstenen kayıt bulunamadı.',
        en: 'The requested record was not found.'
    },
    {
        matches: ['description must be between 20 and 2000 characters', 'description must be at least 20 characters', 'açıklama en az 20 karakter', 'aciklama en az 20 karakter', 'açıklama 20-2000 karakter arasında', 'aciklama 20-2000 karakter arasinda'],
        tr: 'Açıklama en az 20 karakter olmalıdır.',
        en: 'Description must be at least 20 characters.'
    },
    {
        matches: ['title must be between 5 and 200 characters', 'title must be at least 5 characters', 'başlık en az 5 karakter', 'baslik en az 5 karakter', 'başlık 5-200 karakter arasında', 'baslik 5-200 karakter arasinda'],
        tr: 'Hizmet başlığı en az 5 karakter olmalıdır.',
        en: 'Service title must be at least 5 characters.'
    },
    {
        matches: ['password must be at least 6 characters', 'şifre en az 6 karakter', 'sifre en az 6 karakter'],
        tr: 'Şifre en az 6 karakter olmalıdır.',
        en: 'Password must be at least 6 characters.'
    },
    {
        matches: ['passwords must have at least one uppercase', 'at least one uppercase', 'en az bir büyük harf'],
        tr: 'Şifre en az 1 büyük harf içermelidir.',
        en: 'Password must contain at least 1 uppercase letter.'
    },
    {
        matches: ['passwords must have at least one lowercase', 'at least one lowercase', 'en az bir küçük harf', 'en az bir kucuk harf'],
        tr: 'Şifre en az 1 küçük harf içermelidir.',
        en: 'Password must contain at least 1 lowercase letter.'
    },
    {
        matches: ['passwords must have at least one digit', 'at least one digit', 'en az bir rakam'],
        tr: 'Şifre en az 1 rakam içermelidir.',
        en: 'Password must contain at least 1 number.'
    },
    {
        matches: ['description is required', 'açıklama gereklidir', 'aciklama gereklidir', 'açıklama zorunludur', 'aciklama zorunludur'],
        tr: 'Açıklama zorunludur.',
        en: 'Description is required.'
    },
    {
        matches: ['title is required', 'başlık gereklidir', 'baslik gereklidir', 'başlık zorunludur', 'baslik zorunludur'],
        tr: 'Başlık zorunludur.',
        en: 'Title is required.'
    },
    {
        matches: ['hourly rate must be greater than 0', 'saatlik ücret 0\'dan büyük olmalıdır', 'saatlik ucret 0\'dan buyuk olmalidir'],
        tr: 'Saatlik ücret 0\'dan büyük olmalıdır.',
        en: 'Hourly rate must be greater than 0.'
    },
    {
        matches: ['hourly rate cannot exceed daily rate', 'saatlik ücret, günlük ücretten fazla olamaz', 'saatlik ucret, gunluk ucretten fazla olamaz'],
        tr: 'Saatlik ücret, günlük ücretten fazla olamaz.',
        en: 'Hourly rate cannot be higher than daily rate.'
    },
    {
        matches: ['distance must be between 1 and 1000 km', 'maksimum mesafe 1-1000 km arası olmalıdır', 'maksimum mesafe 1-1000 km arasi olmalidir', 'mesafe 1 ile 1000 km arasında olmalıdır', 'mesafe 1 ile 1000 km arasinda olmalidir'],
        tr: 'Maksimum hizmet mesafesi 1 ile 1000 km arasında olmalıdır.',
        en: 'Maximum service distance must be between 1 and 1000 km.'
    }
];

const normalizeMessageKey = (message: string) => message
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const localizeKnownErrorMessage = (message: string, language: AppLanguage) => {
    const normalized = normalizeMessageKey(message);
    const matchedPattern = LOCALIZED_ERROR_PATTERNS.find((pattern) =>
        pattern.matches.some((candidate) => normalized.includes(normalizeMessageKey(candidate)))
    );

    if (!matchedPattern) {
        return message;
    }

    return language === 'tr' ? matchedPattern.tr : matchedPattern.en;
};

const normalizeErrors = (value: unknown): string[] => {
    if (Array.isArray(value)) {
        return value.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0);
    }

    if (typeof value === 'string' && value.trim()) {
        return [value];
    }

    if (value && typeof value === 'object') {
        return Object.values(value as ValidationErrors)
            .flatMap(entry => Array.isArray(entry) ? entry : [])
            .filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0);
    }

    return [];
};

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
    errors: normalizeErrors(value.errors ?? value.Errors),
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
    const language = getCurrentLanguage();

    if (axios.isAxiosError(error)) {
        const payload = error.response?.data as Record<string, unknown> | string | undefined;

        if (typeof payload === 'string' && payload.trim()) {
            return localizeKnownErrorMessage(payload, language);
        }

        if (payload && typeof payload === 'object') {
            const message =
                typeof payload.message === 'string' ? payload.message :
                typeof payload.Message === 'string' ? payload.Message :
                typeof payload.detail === 'string' ? payload.detail :
                typeof payload.title === 'string' ? payload.title :
                '';
            const errors = normalizeErrors(
                payload.errors
                ?? payload.Errors
                ?? payload['']
            ).map((entry) => localizeKnownErrorMessage(entry, language));

            return localizeKnownErrorMessage(message, language) || errors[0] || fallback;
        }
    }

    if (error instanceof Error && error.message.trim()) {
        return localizeKnownErrorMessage(error.message, language);
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
        const response = await api.post<ApiResponse<string | null>>('/Auth/forgot-password', data);
        return response.data;
    },

    resetPassword: async (data: ResetPasswordDto) => {
        const response = await api.post<ApiResponse<string>>('/Auth/reset-password', data);
        return response.data;
    },
};

export const contactAPI = {
    sendMessage: async (data: ContactMessageDto) => {
        const response = await api.post<ApiResponse<string | null>>('/Contact', data);
        return response.data;
    },
};

export const customRequestAPI = {
    create: async (data: CreateCustomRequestDto) => {
        const response = await api.post<ApiResponse<CustomRequest>>('/CustomRequests', data);
        return response.data.data;
    },
    list: async () => {
        const response = await api.get<ApiResponse<CustomRequest[]>>('/Admin/custom-requests');
        return response.data.data ?? [];
    },
};

// Pilot API
export const pilotAPI = {
    createOrUpdateProfile: async (userId: string, profile: UpdatePilotProfileDto) => {
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

    getManagedProfile: async (userId: string) => {
        const response = await api.get<ApiResponse<PilotProfile>>(`/Pilots/profile/${userId}/manage`);
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
    revokePilotVerification: async (pilotProfileId: string, reason: string) => {
        const response = await api.put<ApiResponse<boolean>>(`/Pilots/${pilotProfileId}/revoke-verification`, { reason });
        return response.data;
    },
    deleteUser: async (userId: string) => {
        const response = await api.delete<ApiResponse<boolean>>(`/Admin/users/${userId}`);
        return response.data;
    }
};
