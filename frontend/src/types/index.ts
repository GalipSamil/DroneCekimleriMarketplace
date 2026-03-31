// API Response Types
export * from './apiResponse';
export interface User {
  id: string;
  email: string;
  fullName: string;
  isPilot: boolean;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  isPilot: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
}

export interface PilotProfile {
  id: string;
  userId: string;
  bio?: string;
  equipmentList?: string;
  shgmLicenseNumber?: string;
  latitude?: number;
  longitude?: number;
  isVerified?: boolean;
}

// Listing Types
export interface Listing {
  id: string;
  pilotId: string;
  title: string;
  description: string;
  category: ServiceCategory;
  hourlyRate: number;
  dailyRate: number;
  projectRate: number;
  coverImageUrl?: string;
  isActive: boolean;
  maxDistance: number;
  requiredEquipment?: string;
  deliverableFormat?: string;
  pilotUserId: string;
  pilotName: string;
  pilotLocation?: string;
  pilotIsVerified: boolean;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}

export interface CreateListingDto {
  title: string;
  description: string;
  category: ServiceCategory;
  hourlyRate: number;
  dailyRate: number;
  projectRate: number;
  coverImageUrl?: string;
  maxDistance: number;
  requiredEquipment?: string;
  deliverableFormat?: string;
}

export interface UpdateListingDto {
  title: string;
  description: string;
  hourlyRate: number;
  dailyRate: number;
  projectRate: number;
  coverImageUrl?: string;
  category: ServiceCategory;
  isActive: boolean;
  maxDistance: number;
  requiredEquipment?: string;
  deliverableFormat?: string;
}

export const ServiceCategory = {
  RealEstate: 0,
  Wedding: 1,
  Inspection: 2,
  Commercial: 3,
  Mapping: 4,
  Agriculture: 5,
  Construction: 6,
  Events: 7,
  Cinematography: 8
} as const;

export type ServiceCategory = typeof ServiceCategory[keyof typeof ServiceCategory];

// Drone Types
export interface Drone {
  id: string;
  pilotId: string;
  pilotName: string;
  model: string;
  brand: string;
  type: DroneType;
  specifications?: string;
  isAvailable: boolean;
  weight: number;
  maxFlightTime: number;
  imageUrl?: string;
  createdAt: string;
}

export interface CreateDroneDto {
  model: string;
  brand: string;
  type: DroneType;
  specifications?: string;
  weight: number;
  maxFlightTime: number;
  imageUrl?: string;
}

export const DroneType = {
  Photography: 0,
  Mapping: 1,
  Inspection: 2,
  Racing: 3,
  Commercial: 4,
  Agricultural: 5
} as const;

export type DroneType = typeof DroneType[keyof typeof DroneType];

// Booking Types
export interface Booking {
  id: string;
  listingId: string;
  title: string;
  customerId: string;
  customerName: string;
  pilotName: string;
  startDate: string;
  endDate: string;
  type: BookingType;
  location: string;
  latitude: number;
  longitude: number;
  totalPrice: number;
  hours: number;
  days: number;
  status: BookingStatus;
  bookingDate: string;
  customerNotes?: string;
  pilotNotes?: string;
  hasReview?: boolean;
}

export interface CreateBookingDto {
  listingId: string;
  startDate: string;
  endDate: string;
  type: BookingType;
  location: string;
  latitude: number;
  longitude: number;
  hours: number;
  days: number;
  customerNotes?: string;
}

export const BookingType = {
  Hourly: 0,
  Daily: 1,
  Project: 2
} as const;

export type BookingType = typeof BookingType[keyof typeof BookingType];

export const BookingStatus = {
  Pending: 0,
  Accepted: 1,
  InProgress: 2,
  Completed: 3,
  Cancelled: 4,
  Rejected: 5,
  Delivered: 6
} as const;

export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];



// Chat Types
export interface MessageDto {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  isRead: boolean;
  sentAt: string;
}

export interface CreateMessageDto {
  receiverId: string;
  content: string;
}

export interface Review {
  id: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
  customerName: string;
  customerProfilePictureUrl?: string;
}

export interface CreateReviewDto {
  bookingId: string;
  rating: number;
  comment: string;
}

// Admin Types
export interface AdminOverviewDto {
  totalRevenue: number;
  totalUsers: number;
  activePilots: number;
  newRequests: number;
  recentActivities: RecentActivityDto[];
}

export interface RecentActivityDto {
  text: string;
  time: string;
  createdAt: string;
}

export interface AdminUserDto {
  id: string;
  pilotProfileId?: string;
  name: string;
  email: string;
  role: string;
  status: string;
  verified: boolean;
}

export interface AdminBookingDto {
  id: string;
  customer: string;
  pilot: string;
  date: string;
  amount: number;
  status: number;
}
