import { StyleSheet } from "react-native";
import { colors, radius, spacing, typography } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },

  label: {
    marginBottom: spacing.sm,
    fontSize: typography.caption,
    color: colors.text,
    fontWeight: "600",
  },

  inputContainer: {
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },

  input: {
    flex: 1,
    fontSize: typography.body,
    color: colors.text,
  },

  error: {
    marginTop: spacing.xs,
    color: colors.danger,
    fontSize: typography.small,
  },

  icon: {
    marginHorizontal: 6,
  },
});