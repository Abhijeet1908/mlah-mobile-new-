import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import { ButtonProps } from "../types/type";

const getBgVariantStyle = (variant: ButtonProps["bgVariant"]): ViewStyle => {
  switch (variant) {
    case "secondary":
      return { backgroundColor: "#6B7280" }; // gray-500
    case "danger":
      return { backgroundColor: "#EF4444" }; // red-500
    case "success":
      return { backgroundColor: "#22C55E" }; // green-500
    case "outline":
      return {
        backgroundColor: "transparent",
        borderColor: "#D1D5DB", // neutral-300
        borderWidth: 0.5,
      };
    default:
      return { backgroundColor: "#0286FF" }; // primary
  }
};

const getTextVariantStyle = (
  variant: ButtonProps["textVariant"]
): TextStyle => {
  switch (variant) {
    case "primary":
      return { color: "#000000" }; // black
    case "secondary":
      return { color: "#F3F4F6" }; // gray-100
    case "danger":
      return { color: "#FECACA" }; // red-100
    case "success":
      return { color: "#BBF7D0" }; // green-100
    default:
      return { color: "#FFFFFF" }; // white
  }
};

const CustomButton = ({
  onPress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  style,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.buttonBase, getBgVariantStyle(bgVariant), style]}
      {...props}
    >
      {IconLeft && <View style={styles.iconWrapper}>{<IconLeft />}</View>}
      <Text style={[styles.text, getTextVariantStyle(textVariant)]}>
        {title}
      </Text>
      {IconRight && <View style={styles.iconWrapper}>{<IconRight />}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 9999,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#a3a3a3", // neutral-400
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  iconWrapper: {
    marginHorizontal: 4,
  },
});

export default CustomButton;
