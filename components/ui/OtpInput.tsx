import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import { colors } from "@/constants/colors";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 4,
  value,
  onChange,
  error = false,
}) => {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [localValue, setLocalValue] = useState<string[]>(
    value.split("").concat(Array(length - value.length).fill(""))
  );

  useEffect(() => {
    // Update local state when value prop changes
    setLocalValue(
      value.split("").concat(Array(length - value.length).fill(""))
    );
  }, [value, length]);

  const handleChange = (text: string, index: number) => {
    // Only allow one character
    const digit = text.slice(-1);

    // Update the local state
    const newValue = [...localValue];
    newValue[index] = digit;
    setLocalValue(newValue);

    // Call the onChange prop with the new value
    onChange(newValue.join(""));

    // Move to next input if we have a value
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace") {
      if (localValue[index] === "" && index > 0) {
        // If current input is empty and backspace is pressed, move to previous input
        inputRefs.current[index - 1]?.focus();

        // Clear the previous input
        const newValue = [...localValue];
        newValue[index - 1] = "";
        setLocalValue(newValue);
        onChange(newValue.join(""));
      }
    }
  };

  const handleFocus = (index: number) => {
    // When an input is focused, select all text
    inputRefs.current[index]?.setNativeProps({
      selection: { start: 0, end: 1 },
    });
  };

  return (
    <View style={styles.container}>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.input,
              error ? styles.inputError : {},
              localValue[index] ? styles.inputFilled : {},
            ]}
            value={localValue[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            selectionColor={colors.primary}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
});
