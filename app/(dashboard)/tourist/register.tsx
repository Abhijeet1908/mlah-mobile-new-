import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImagePicker } from "@/components/ui/ImagePicker";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { useTouristStore } from "@/store/tourist-store";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function TouristRegistrationScreen() {
  const router = useRouter();
  const { createProfile, isLoading } = useTouristStore();
  const { completeRegistration, phoneNumber } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: phoneNumber,
    address: "",
    nationality: "",
    passportNumber: "",
    profilePicture: null as string | null,
    idProofFront: null as string | null,
    idProofBack: null as string | null,
    dob: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    profilePicture: "",
    idProofFront: "",
  });
  const convertToBase64 = async (uri: string): Promise<string> => {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      profilePicture: "",
      idProofFront: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    if (!formData.profilePicture) {
      newErrors.profilePicture = "Profile picture is required";
      isValid = false;
    }

    if (!formData.idProofFront) {
      newErrors.idProofFront = "ID proof front is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const token = await AsyncStorage.getItem("token");

        // Convert images to base64
        const profileImageBase64 = await convertToBase64(
          formData.profilePicture ?? ""
        );
        const idFrontBase64 = await convertToBase64(
          formData.idProofFront ?? ""
        );
        const idBackBase64 = await convertToBase64(formData.idProofBack ?? "");

        //         [
        //   {
        //     "parentCustomerId": 0,
        //     "firstName": "string",
        //     "lastName": "string",
        //     "email": "string",
        //     "contactNo": "string",
        //     "customerImages": "string",
        //     "documentFront": "string",
        //     "documentBack": "string",
        //     "gender": "string",
        //     "dob": "2025-05-21",
        //     "permanentAddress": "string"
        //   }
        // ]
        const randomTwoDigitNumber = () => {
          return Math.floor(Math.random() * 90) + 10;
        };

        const names = formData.name.split(" ");
        const payload = [
          {
            parentCustomerId: randomTwoDigitNumber(),
            firstName: names[0],
            lastName: names[1] ?? "",
            email: formData.email ?? "",
            contactNo: formData.phone ?? "",

            customerImages: profileImageBase64,

            documentFront: idFrontBase64,
            documentBack: idBackBase64,

            gender: "male",
            dob: "2025-05-21",
            permanentAddress: formData.address ?? "",
          },
        ];

        const response = await axios.post(
          "https://m-lhamobile.azurewebsites.net/api/Customer/CreateCustomer",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        completeRegistration();

        Alert.alert(
          "Registration Successful",
          "Your tourist profile has been created successfully.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(dashboard)/tourist"),
            },
          ]
        );
      } catch (error: any) {
        console.error("Save tourist failed:", error?.response ?? error);
        Alert.alert("Error", error + "");
      }
    }
  };

  const handleInputChange = (field: string, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Tourist Registration</Text>
            <Text style={styles.subtitle}>
              Please fill in your details to register as a tourist
            </Text>

            <Card style={styles.formCard}>
              <ImagePicker
                label="Profile Picture *"
                value={formData.profilePicture}
                onChange={(uri) => handleInputChange("profilePicture", uri)}
                error={errors.profilePicture}
              />

              <Input
                label="Full Name *"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
                error={errors.name}
              />

              <Input
                label="Email"
                placeholder="Enter your email address"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                error={errors.email}
              />

              <Input
                label="Phone Number *"
                placeholder="Enter your 10-digit phone number"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
                error={errors.phone}
                maxLength={10}
              />

              <Input
                label="Address"
                placeholder="Enter your address"
                multiline
                numberOfLines={3}
                value={formData.address}
                onChangeText={(text) => handleInputChange("address", text)}
              />

              <Input
                label="Nationality"
                placeholder="Enter your nationality"
                value={formData.nationality}
                onChangeText={(text) => handleInputChange("nationality", text)}
              />
              <Input
                label="dob"
                placeholder="Date Of birth"
                value={formData.dob}
                onChangeText={(text) => handleInputChange("dob", text)}
              />

              <Input
                label="Passport Number"
                placeholder="Enter your passport number (if applicable)"
                value={formData.passportNumber}
                onChangeText={(text) =>
                  handleInputChange("passportNumber", text)
                }
              />

              <Input
                label="Vehicle Number"
                placeholder="Entering Vehicle Number"
              />

              <ImagePicker
                label="ID Proof Front *"
                value={formData.idProofFront}
                onChange={(uri) => handleInputChange("idProofFront", uri)}
                error={errors.idProofFront}
              />

              <ImagePicker
                label="ID Proof Back"
                value={formData.idProofBack}
                onChange={(uri) => handleInputChange("idProofBack", uri)}
              />

              <Button
                title="Register"
                onPress={handleSubmit}
                isLoading={isLoading}
                style={styles.submitButton}
              />
            </Card>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <LoadingOverlay visible={isLoading} message="Creating profile..." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
  },
  formCard: {
    padding: 24,
  },
  submitButton: {
    marginTop: 24,
  },
});
