import React, { useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import { Buffer } from "buffer";

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
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImagePicker } from "@/components/ui/ImagePicker";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { useLabourStore } from "@/store/labour-store";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function LabourRegistrationScreen() {
  const router = useRouter();
  const { createProfile, isLoading } = useLabourStore();
  const { completeRegistration, phoneNumber } = useAuthStore();
  const CustomPicker: any = RNPickerSelect;

  const [formData, setFormData] = useState({
    name: "",
    phone: phoneNumber,
    address: "",
    idProof: "",
    skills: "",
    vendorName: "",
    vendorContact: "",
    profilePicture: null as string | null,
    idProofFront: null as string | null,
    idProofBack: null as string | null,
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    profilePicture: "",
    idProofFront: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      phone: "",
      profilePicture: "",
      idProofFront: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
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
  // const convertToBase64 = async (uri: string): Promise<string> => {
  //   const base64 = await FileSystem.readAsStringAsync(uri, {
  //     encoding: FileSystem.EncodingType.Base64,
  //   });
  //   return base64;
  // };

  // const convertToBase64 = async (uri: string): Promise<string> => {
  //   const base64 = await FileSystem.readAsStringAsync(uri, {
  //     encoding: FileSystem.EncodingType.Base64,
  //   });

  //   const fileExtension = uri.split(".").pop()?.toLowerCase();

  //   let mimeType = "image/jpeg"; // default
  //   if (fileExtension === "png") mimeType = "image/png";
  //   if (fileExtension === "jpg" || fileExtension === "jpeg")
  //     mimeType = "image/jpeg";

  //   return `data:${mimeType};base64,${base64}`;
  // };

  // const convertToBase64 = async (uri: string): Promise<Blob> => {
  //   const response = await fetch(uri);
  //   const blob = await response.blob();
  //   return blob;
  // };
  const convertToBase64 = async (uri: string): Promise<string> => {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const buffer = Buffer.from(base64, "base64");
    return buffer.toString("binary");
  };

  // const handleSubmit = async () => {
  //   if (validateForm()) {
  //     try {
  //       const token = await AsyncStorage.getItem("token");

  //       // Convert images to base64
  //       const profileImageBase64 = await convertToBase64(
  //         formData.profilePicture ?? ""
  //       );
  //       const idFrontBase64 = await convertToBase64(
  //         formData.idProofFront ?? ""
  //       );
  //       const idBackBase64 = await convertToBase64(formData.idProofBack ?? "");

  //       const payload = {
  //         ...formData,
  //         profileImage: profileImageBase64,
  //         idProofImages: {
  //           front: idFrontBase64,
  //           back: idBackBase64,
  //         },
  //       };

  //       const response = await axios.post(
  //         "https://m-lhamobile.azurewebsites.net/api/Customer/CreateCustomer",
  //         payload,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       completeRegistration();

  //       Alert.alert(
  //         "Registration Successful",
  //         "Your tourist profile has been created successfully.",
  //         [
  //           {
  //             text: "OK",
  //             onPress: () => router.replace("/(dashboard)/tourist"),
  //           },
  //         ]
  //       );
  //     } catch (error: any) {
  //       console.error("Save tourist failed:", error?.response ?? error);
  //       Alert.alert(
  //         "Error",
  //         error?.response?.data?.message ??
  //           "Failed to create profile. Please try again."
  //       );
  //     }
  //   }
  // };
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const token = await AsyncStorage.getItem("token");
        await createProfile({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          idProof: formData.idProof,
          skills: formData.skills,
          profileImage: await convertToBase64(formData.profilePicture ?? ""),
          idProofImages: {
            front: await convertToBase64(formData.idProofFront ?? ""),
            back: await convertToBase64(formData.idProofBack ?? ""),
          },
        });
        // "firstName": "string",
        //   "middleName": "string",
        //   "lastName": "string",
        //   "gender": "string",
        //   "dob": "2025-05-21",
        //   "permanentAddress": "string",
        //   "currentAddress": "string",
        //   "contactNumber": "string",
        //   "photo": "string",
        //   "documentFront": "string",
        //   "documentBack": "string",
        //   "createdAt": "2025-05-21T12:09:34.451Z
        const names = formData.name.split(" ");
        const payload = {
          firstName: names[0],
          middleName: "",
          lastName: names[1] ?? "",
          gender: "male",
          dob: "2025-05-21",
          permanentAddress: formData.address ?? "",
          currentAddress: formData.address ?? "",
          contactNumber: formData.phone,

          // skills: formData.skills,
          photo: await convertToBase64(formData.profilePicture ?? ""),

          documentFront: await convertToBase64(formData.idProofFront ?? ""),
          documentBack: await convertToBase64(formData.idProofBack ?? ""),
          // photo: "",
          // documentFront: "",
          // documentBack: "",
          createdAt: new Date().toISOString(),
        };

        // console.log("payload is : ", payload);
        // Alert.alert(payload);
        const response = await axios.post(
          "https://m-lhamobile.azurewebsites.net/api/Labour/CreateLabour",
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
          "Your labour profile has been created successfully.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(dashboard)/labour"),
            },
          ]
        );
      } catch (error) {
        console.error("Save Labour failed:");
        Alert.alert(
          "Error",

          error + ""
        );
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
            <Text style={styles.title}>Labour Registration</Text>
            <Text style={styles.subtitle}>
              Please fill in your details to register as a labour
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
                label="Vehicle Number"
                placeholder="Entering Vehicle Number"
              />

              <Input
                label="ID Proof Details"
                placeholder="Enter your ID proof details"
                value={formData.idProof}
                onChangeText={(text) => handleInputChange("idProof", text)}
              />

              {/* <Input
                label="Skills"
                placeholder="Enter your skills (comma separated)"
                value={formData.skills}
                onChangeText={(text) => handleInputChange("skills", text)}
              /> */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ marginBottom: 4, color: colors.text }}>
                  Skills *
                </Text>
                <CustomPicker
                  onValueChange={(value: string) =>
                    handleInputChange("skills", value)
                  }
                  items={[
                    { label: "Un-skilled", value: "Un-skilled" },
                    { label: "Semi-skilled", value: "Semi-skilled" },
                    { label: "Skilled", value: "Skilled" },
                    { label: "Highly-skilled", value: "Highly-skilled" },
                  ]}
                  placeholder={{ label: "Select skill level", value: null }}
                  value={formData.skills}
                  style={{
                    inputIOS: {
                      padding: 12,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 8,
                      backgroundColor: colors.background,
                      color: colors.text,
                    },
                    inputAndroid: {
                      padding: 12,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 8,
                      backgroundColor: colors.background,
                      color: colors.text,
                    },
                  }}
                />
              </View>
              <Input
                label="Vendor Reference"
                placeholder="Vendor Name"
                value={formData.vendorName}
                onChangeText={(text) => handleInputChange("vendorName", text)}
              />
              <Input
                placeholder="Vendor Contact Number"
                keyboardType="phone-pad"
                value={formData.vendorContact}
                onChangeText={(text) =>
                  handleInputChange("vendorContact", text)
                }
                maxLength={10}
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
                variant="secondary"
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
