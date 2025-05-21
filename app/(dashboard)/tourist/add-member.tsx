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
import { colors } from "@/constants/colors";

export default function AddMemberScreen() {
  const router = useRouter();
  const { addMember, isLoading, profile } = useTouristStore();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    relation: "",
    idProof: "",
    profileImage: null as string | null,
    idProofFront: null as string | null,
    idProofBack: null as string | null,
  });

  const [errors, setErrors] = useState({
    name: "",
    age: "",
    relation: "",
    profileImage: "",
  });

  // Redirect if no profile exists
  if (!profile) {
    router.replace("/(dashboard)/tourist/register");
    return null;
  }

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      age: "",
      relation: "",
      profileImage: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
      isValid = false;
    } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = "Please enter a valid age";
      isValid = false;
    }

    if (!formData.relation.trim()) {
      newErrors.relation = "Relation is required";
      isValid = false;
    }

    if (!formData.profileImage) {
      newErrors.profileImage = "Profile picture is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await addMember({
          name: formData.name,
          age: Number(formData.age),
          relation: formData.relation,
          idProof: formData.idProof,
          profileImage: formData.profileImage,
          idProofImages: {
            front: formData.idProofFront,
            back: formData.idProofBack,
          },
        });

        Alert.alert("Success", "Member added successfully", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } catch (error) {
        Alert.alert("Error", "Failed to add member. Please try again.");
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
            <Text style={styles.title}>Add Family Member</Text>
            <Text style={styles.subtitle}>
              Add details of your family member
            </Text>

            <Card style={styles.formCard}>
              <ImagePicker
                label="Profile Picture *"
                value={formData.profileImage}
                onChange={(uri) => handleInputChange("profileImage", uri)}
                error={errors.profileImage}
              />

              <Input
                label="Full Name *"
                placeholder="Enter member's full name"
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
                error={errors.name}
              />

              <Input
                label="Age *"
                placeholder="Enter member's age"
                keyboardType="number-pad"
                value={formData.age}
                onChangeText={(text) => handleInputChange("age", text)}
                error={errors.age}
              />

              <Input
                label="Relation *"
                placeholder="E.g. Spouse, Child, Parent"
                value={formData.relation}
                onChangeText={(text) => handleInputChange("relation", text)}
                error={errors.relation}
              />

              <Input
                label="ID Proof"
                placeholder="Enter ID proof details (if applicable)"
                value={formData.idProof}
                onChangeText={(text) => handleInputChange("idProof", text)}
              />

              <ImagePicker
                label="ID Proof Front"
                value={formData.idProofFront}
                onChange={(uri) => handleInputChange("idProofFront", uri)}
              />

              <ImagePicker
                label="ID Proof Back"
                value={formData.idProofBack}
                onChange={(uri) => handleInputChange("idProofBack", uri)}
              />

              <Button
                title="Add Member"
                onPress={handleSubmit}
                isLoading={isLoading}
                style={styles.submitButton}
              />
            </Card>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <LoadingOverlay visible={isLoading} message="Adding member..." />
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
