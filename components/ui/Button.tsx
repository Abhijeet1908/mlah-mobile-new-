import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from "react-native";
import { colors } from "@/constants/colors";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "medium",
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  ...rest
}) => {
  const getButtonStyle = (): ViewStyle => {
    let buttonStyle: ViewStyle = {};

    // Base styles
    switch (variant) {
      case "primary":
        buttonStyle = {
          backgroundColor: colors.primary,
          borderWidth: 0,
        };
        break;
      case "secondary":
        buttonStyle = {
          backgroundColor: colors.secondary,
          borderWidth: 0,
        };
        break;
      case "outline":
        buttonStyle = {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colors.primary,
        };
        break;
      case "text":
        buttonStyle = {
          backgroundColor: "transparent",
          borderWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        };
        break;
    }

    // Size styles
    switch (size) {
      case "small":
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: 8,
          paddingHorizontal: 16,
        };
        break;
      case "medium":
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: 12,
          paddingHorizontal: 24,
        };
        break;
      case "large":
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: 16,
          paddingHorizontal: 32,
        };
        break;
    }

    // Disabled state
    if (disabled || isLoading) {
      buttonStyle = {
        ...buttonStyle,
        opacity: 0.6,
      };
    }

    return buttonStyle;
  };

  const getTextStyle = (): TextStyle => {
    let style: TextStyle = {
      fontWeight: "600",
    };

    switch (variant) {
      case "primary":
      case "secondary":
        style = {
          ...style,
          color: colors.white,
        };
        break;
      case "outline":
      case "text":
        style = {
          ...style,
          color: colors.primary,
        };
        break;
    }

    switch (size) {
      case "small":
        style = {
          ...style,
          fontSize: 14,
        };
        break;
      case "medium":
        style = {
          ...style,
          fontSize: 16,
        };
        break;
      case "large":
        style = {
          ...style,
          fontSize: 18,
        };
        break;
    }

    return style;
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "primary" || variant === "secondary"
              ? colors.white
              : colors.primary
          }
        />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    textAlign: "center",
  },
});
