import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, UserType } from "@/types";
import axios from "axios";
import { Alert } from "react-native";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  phoneNumber: string;
  login: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  setUserType: (type: UserType) => void;
  completeRegistration: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      phoneNumber: "",

      login: async (phone: string) => {
        set({ isLoading: true, error: null, phoneNumber: phone });
        try {
          // Simulate API call
          // url =m-lhamobile.azurewebsites.net/api/Customer/SendOTP?mobileNumber=phone
          // methodtype =post
          // await new Promise((resolve) => setTimeout(resolve, 1000));

          const response = await axios.post(
            `https://m-lhamobile.azurewebsites.net/api/Customer/SendOTP`,
            null, // no body
            {
              params: {
                mobileNumber: phone,
              },
            }
          );

          // In a real app, this would be a server response
          set({ isLoading: false });

          // Alert.alert(response.data + "");
          return Promise.resolve();
        } catch (error) {
          set({ isLoading: false, error: "Failed to send OTP" });
          return Promise.reject(error);
        }
      },

      verifyOtp: async (phone: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log("phone number : ", phone, "otp is : ", otp);
          const phoneNumber = phone;
          // if (!phoneNumber) {
          //   throw new Error("Phone number not found in store.");
          // }

          const response = await axios.post(
            "https://m-lhamobile.azurewebsites.net/api/Customer/AuthenticateCustomer",
            {
              mobileNumber: phoneNumber,
              otp: otp,
              customerType: 1,
            }
          );
          console.log("response is : ", response.data.data);
          const user = response.data.data.username;
          const token = response.data.data.token;
          console.log("token is : ", token);

          // Alert.alert("token is " + token);

          // Save token securely.data.data
          await AsyncStorage.setItem("token", token);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          return Promise.resolve();
        } catch (error: any) {
          set({
            isLoading: false,
            error: error?.response?.data?.message ?? "Verification failed",
          });
          return Promise.reject(error);
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, phoneNumber: "" });
      },

      setUserType: (type: UserType) => {
        set((state) => ({
          user: state.user ? { ...state.user, userType: type } : null,
        }));
      },

      completeRegistration: () => {
        set((state) => ({
          user: state.user ? { ...state.user, isNewUser: false } : null,
        }));
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
