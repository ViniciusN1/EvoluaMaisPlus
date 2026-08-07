import React from "react";
import { View, Text, TextInput } from "react-native";

import { InputProps } from "./types";
import { styles } from "./styles";

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  ...rest
}: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}

        <TextInput
          style={styles.input}
          placeholderTextColor="#94A3B8"
          {...rest}
        />

        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </View>

      {!!error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}