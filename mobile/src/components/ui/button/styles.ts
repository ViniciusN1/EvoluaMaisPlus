import { StyleSheet } from "react-native";
import { Colors, radius, spacing, Typography } from "../../../theme";

export const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
  },

  title: {
    color: "#FFFFFF",
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
  },

  primary: {
    backgroundColor: Colors.primary,
  },

  secondary: {
    backgroundColor: Colors.success,
  },

  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },

  danger: {
    backgroundColor: Colors.danger,
  },

  outlineText: {
    color: Colors.primary,
  },

  disabled: {
    opacity: 0.5,
  },
});