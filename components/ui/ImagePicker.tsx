import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import * as ExpoImagePicker from "expo-image-picker";
import { colors } from "../../constants/colors";
import { Camera, Upload } from "lucide-react-native";

interface ImagePickerProps {
  label: string;
  value: string | null;
  onChange: (uri: string | null) => void;
  error?: string;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  label,
  value,
  onChange,
  error,
}) => {
  const [loading, setLoading] = useState(false);

  const requestPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Sorry, we need camera roll permissions to make this work!"
        );
        return false;
      }
      return true;
    }
    return true;
  };

  const requestCameraPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ExpoImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Sorry, we need camera permissions to make this work!"
        );
        return false;
      }
      return true;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const result = await ExpoImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    onChange(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {value ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: value }} style={styles.image} />
          <View style={styles.imageActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.removeButton]}
              onPress={removeImage}
            >
              <Text style={styles.actionButtonText}>Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
              <Text style={styles.actionButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.pickerContainer}>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={takePhoto}
            disabled={loading}
          >
            <Camera size={24} color={colors.primary} />
            <Text style={styles.pickerButtonText}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pickerButton}
            onPress={pickImage}
            disabled={loading}
          >
            <Upload size={24} color={colors.primary} />
            <Text style={styles.pickerButtonText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: colors.text,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  pickerButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 8,
  },
  pickerButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  imageContainer: {
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  imageActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  removeButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});
