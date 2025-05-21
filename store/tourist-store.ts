import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  TouristProfile,
  TouristMember,
  HotelBooking,
  CabBooking,
  IdProofImages,
} from "@/types";

interface TouristState {
  profile: TouristProfile | null;
  hotels: HotelBooking[];
  cabs: CabBooking[];
  isLoading: boolean;
  error: string | null;

  createProfile: (
    profile: Omit<TouristProfile, "id" | "members">
  ) => Promise<void>;
  updateProfile: (profile: Partial<TouristProfile>) => Promise<void>;
  addMember: (member: Omit<TouristMember, "id">) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  bookHotel: (booking: Omit<HotelBooking, "id" | "status">) => Promise<void>;
  bookCab: (booking: Omit<CabBooking, "id" | "status">) => Promise<void>;
  cancelHotelBooking: (bookingId: string) => Promise<void>;
  cancelCabBooking: (bookingId: string) => Promise<void>;
}

export const useTouristStore = create<TouristState>()(
  persist(
    (set, get) => ({
      profile: null,
      hotels: [],
      cabs: [],
      isLoading: false,
      error: null,

      createProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const newProfile: TouristProfile = {
            id: "tourist-" + Date.now(),
            ...profileData,
            members: [],
          };

          set({ profile: newProfile, isLoading: false });
          return Promise.resolve();
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to create profile",
          });
          return Promise.reject(error);
        }
      },

      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const currentProfile = get().profile;
          if (!currentProfile) {
            throw new Error("No profile exists");
          }

          set({
            profile: { ...currentProfile, ...profileData },
            isLoading: false,
          });

          return Promise.resolve();
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to update profile",
          });
          return Promise.reject(error);
        }
      },

      addMember: async (memberData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const currentProfile = get().profile;
          if (!currentProfile) {
            throw new Error("No profile exists");
          }

          const newMember: TouristMember = {
            id: "member-" + Date.now(),
            ...memberData,
          };

          set({
            profile: {
              ...currentProfile,
              members: [...currentProfile.members, newMember],
            },
            isLoading: false,
          });

          return Promise.resolve();
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Failed to add member",
          });
          return Promise.reject(error);
        }
      },

      removeMember: async (memberId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const currentProfile = get().profile;
          if (!currentProfile) {
            throw new Error("No profile exists");
          }

          set({
            profile: {
              ...currentProfile,
              members: currentProfile.members.filter((m) => m.id !== memberId),
            },
            isLoading: false,
          });

          return Promise.resolve();
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to remove member",
          });
          return Promise.reject(error);
        }
      },

      bookHotel: async (bookingData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const newBooking: HotelBooking = {
            id: "hotel-" + Date.now(),
            ...bookingData,
            status: "confirmed",
          };

          set((state) => ({
            hotels: [...state.hotels, newBooking],
            isLoading: false,
          }));

          return Promise.resolve();
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Failed to book hotel",
          });
          return Promise.reject(error);
        }
      },

      bookCab: async (bookingData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const newBooking: CabBooking = {
            id: "cab-" + Date.now(),
            ...bookingData,
            status: "confirmed",
          };

          set((state) => ({
            cabs: [...state.cabs, newBooking],
            isLoading: false,
          }));

          return Promise.resolve();
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Failed to book cab",
          });
          return Promise.reject(error);
        }
      },

      cancelHotelBooking: async (bookingId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          set((state) => ({
            hotels: state.hotels.map((booking) =>
              booking.id === bookingId
                ? { ...booking, status: "cancelled" }
                : booking
            ),
            isLoading: false,
          }));

          return Promise.resolve();
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to cancel hotel booking",
          });
          return Promise.reject(error);
        }
      },

      cancelCabBooking: async (bookingId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          set((state) => ({
            cabs: state.cabs.map((booking) =>
              booking.id === bookingId
                ? { ...booking, status: "cancelled" }
                : booking
            ),
            isLoading: false,
          }));

          return Promise.resolve();
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to cancel cab booking",
          });
          return Promise.reject(error);
        }
      },
    }),
    {
      name: "tourist-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
