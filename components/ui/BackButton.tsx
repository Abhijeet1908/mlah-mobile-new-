import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { colors } from "@/constants/colors";

interface BackButtonProps {
  style?: ViewStyle;
  showText?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({
  style,
  showText = true,
}) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => router.back()}
      activeOpacity={0.7}
    >
      <ChevronLeft size={24} color={colors.primary} />
      {showText && <Text style={styles.text}>Back</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  text: {
    fontSize: 16,
    color: colors.primary,
    marginLeft: 4,
  },
});
