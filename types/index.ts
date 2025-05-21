export type UserType = "tourist" | "labour" | null;

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  userType: UserType;
  isNewUser: boolean;
}

export interface IdProofImages {
  front: string | null;
  back: string | null;
}

export interface TouristProfile {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  nationality?: string;
  passportNumber?: string;
  profileImage?: string | null;
  idProofImages?: IdProofImages;
  members: TouristMember[];
}

export interface TouristMember {
  id: string;
  name: string;
  age: number;
  relation: string;
  idProof?: string;
  profileImage?: string | null;
  idProofImages?: IdProofImages;
}

export interface LabourProfile {
  id: string;
  name: string;
  phone: string;
  address?: string;
  idProof?: string;
  profileImage?: string | null;
  idProofImages?: IdProofImages;
  cardNumber?: string;
  cardStatus?: "active" | "expired" | "pending";
  cardExpiryDate?: string;
  skills?: string;
}

export interface HotelBooking {
  id: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: "confirmed" | "pending" | "cancelled";
}

export interface CabBooking {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: number;
  status: "confirmed" | "pending" | "cancelled";
}
