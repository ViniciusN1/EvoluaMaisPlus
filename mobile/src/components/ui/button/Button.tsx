import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
} from "react-native";

import { ButtonProps } from "./types";
import { styles } from "./styles";
import { Colors } from "../../../theme";

export function Button({
  title,
  variant = "primary",
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  ...rest
}: ButtonProps) {
  const buttonStyle = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
  ];

  const textStyle = [
    styles.title,
    variant === "outline" && styles.outlineText,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={buttonStyle}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? Colors.primary : "#FFF"}
        />
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          {leftIcon}

          <Text style={textStyle}>{title}</Text>

          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
}