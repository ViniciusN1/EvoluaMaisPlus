import { StyleSheet } from "react-native";
import { colors, radius, spacing, typography } from "../../../theme";

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
    fontSize: typography.body,
    fontWeight: "600",
  },

  primary: {
    backgroundColor: colors.primary,
  },

  secondary: {
    backgroundColor: colors.success,
  },

  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },

  danger: {
    backgroundColor: colors.danger,
  },

  outlineText: {
    color: colors.primary,
  },

  disabled: {
    opacity: 0.5,
  },
});