import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { OtpInput } from "@/components/ui/OtpInput";
import { Button } from "@/components/ui/Button";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "../../constants/colors";
import { ChevronLeft } from "lucide-react-native";

export default function VerifyScreen() {
  const router = useRouter();
  const { verifyOtp, isLoading, error, phoneNumber } = useAuthStore();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleResendOtp = () => {
    setTimer(30);
    Alert.alert("OTP Sent", "A new OTP has been sent to your phone number.");
  };

  const handleVerify = async () => {
    if (otp.length !== 4) {
      setOtpError("Please enter a valid 4-digit OTP");
      return;
    }

    try {
      await verifyOtp(phoneNumber, otp);
      router.replace("/(dashboard)");
    } catch (error) {
      Alert.alert("Error", "Invalid OTP. Please try again." + error);
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
            <View style={styles.content}>
              <Text style={styles.title}>Verify OTP</Text>
              <Text style={styles.subtitle}>
                Enter the 4-digit code sent to {phoneNumber}
              </Text>

              <View style={styles.otpContainer}>
                <OtpInput
                  length={4}
                  value={otp}
                  onChange={(value) => {
                    setOtp(value);
                    if (otpError) setOtpError("");
                  }}
                  error={!!otpError}
                />
                {otpError ? (
                  <Text style={styles.errorText}>{otpError}</Text>
                ) : null}
              </View>

              <Button
                title="Verify"
                onPress={handleVerify}
                isLoading={isLoading}
                style={styles.button}
              />

              <View style={styles.resendContainer}>
                {timer > 0 ? (
                  <Text style={styles.timerText}>
                    Resend OTP in {timer} seconds
                  </Text>
                ) : (
                  <TouchableWithoutFeedback onPress={handleResendOtp}>
                    <Text style={styles.resendText}>Resend OTP</Text>
                  </TouchableWithoutFeedback>
                )}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <LoadingOverlay visible={isLoading} message="Verifying OTP..." />
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
  content: {
    width: "100%",
    alignItems: "center",
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
    textAlign: "center",
  },
  otpContainer: {
    width: "100%",
    marginBottom: 32,
  },
  button: {
    width: "100%",
    marginBottom: 16,
  },
  resendContainer: {
    marginTop: 16,
  },
  timerText: {
    fontSize: 14,
    color: colors.textLight,
  },
  resendText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
});
