import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LabourProfile, IdProofImages } from "@/types";

interface LabourState {
  profile: LabourProfile | null;
  isLoading: boolean;
  error: string | null;

  createProfile: (
    profile: Omit<
      LabourProfile,
      "id" | "cardNumber" | "cardStatus" | "cardExpiryDate"
    >
  ) => Promise<void>;
  updateProfile: (profile: Partial<LabourProfile>) => Promise<void>;
  applyNewCard: () => Promise<void>;
  renewCard: () => Promise<void>;
  downloadCard: () => Promise<void>;
}

export const useLabourStore = create<LabourState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,

      createProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Generate a mock card number
          const cardNumber =
            "LC-" + Math.floor(100000 + Math.random() * 900000);

          // Set expiry date to 1 year from now
          const expiryDate = new Date();
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);

          const newProfile: LabourProfile = {
            id: "labour-" + Date.now(),
            ...profileData,
            cardNumber,
            cardStatus: "active",
            cardExpiryDate: expiryDate.toISOString().split("T")[0],
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

      applyNewCard: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const currentProfile = get().profile;
          if (!currentProfile) {
            throw new Error("No profile exists");
          }

          // Generate a new card number
          const cardNumber =
            "LC-" + Math.floor(100000 + Math.random() * 900000);

          // Set expiry date to 1 year from now
          const expiryDate = new Date();
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);

          set({
            profile: {
              ...currentProfile,
              cardNumber,
              cardStatus: "active",
              cardExpiryDate: expiryDate.toISOString().split("T")[0],
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
                : "Failed to apply for new card",
          });
          return Promise.reject(error);
        }
      },

      renewCard: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const currentProfile = get().profile;
          if (!currentProfile) {
            throw new Error("No profile exists");
          }

          // Set expiry date to 1 year from now
          const expiryDate = new Date();
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);

          set({
            profile: {
              ...currentProfile,
              cardStatus: "active",
              cardExpiryDate: expiryDate.toISOString().split("T")[0],
            },
            isLoading: false,
          });

          return Promise.resolve();
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Failed to renew card",
          });
          return Promise.reject(error);
        }
      },

      downloadCard: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // In a real app, this would trigger a download
          console.log("Card download initiated");

          set({ isLoading: false });
          return Promise.resolve();
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to download card",
          });
          return Promise.reject(error);
        }
      },
    }),
    {
      name: "labour-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
