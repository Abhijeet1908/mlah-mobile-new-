import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";
import { ChevronLeft } from "lucide-react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, verifyOtp, error } = useAuthStore();
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validatePhone = (value: string) => {
    if (!value.trim()) {
      return "Phone number is required";
    }
    if (!/^\d{10}$/.test(value.trim())) {
      return "Please enter a valid 10-digit phone number";
    }
    return "";
  };

  const handleLogin = async () => {
    const error = validatePhone(phone);
    setPhoneError(error);

    if (!error) {
      try {
        await login(phone);

        router.push("/(auth)/verify");
      } catch (error) {
        Alert.alert("Error", "Failed to send OTP. Please try again.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ChevronLeft size={24} color={colors.primary} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.logoContainer}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?q=80&w=2080&auto=format&fit=crop",
                }}
                style={styles.logo}
              />
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>

              <View style={styles.form}>
                <Input
                  label="Phone Number"
                  placeholder="Enter your 10-digit phone number"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    if (phoneError) setPhoneError("");
                  }}
                  error={phoneError}
                  maxLength={10}
                />

                <Button
                  title="Send OTP"
                  onPress={handleLogin}
                  isLoading={isLoading}
                  style={styles.button}
                />
              </View>

              <Text style={styles.termsText}>
                By continuing, you agree to our Terms of Service and Privacy
                Policy
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <LoadingOverlay visible={isLoading} message="Sending OTP..." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backButton: {
    padding: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  formContainer: {
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 32,
  },
  form: {
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
  termsText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: "center",
  },
});
