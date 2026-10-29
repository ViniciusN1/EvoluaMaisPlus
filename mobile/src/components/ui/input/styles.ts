import { StyleSheet } from "react-native";
import { Colors, radius, spacing, Typography } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },

  label: {
    marginBottom: spacing.sm,
    fontSize: Typography.caption.fontSize,
    color: Colors.text,
    fontWeight: "600",
  },

  inputContainer: {
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: radius.md,
    backgroundColor: Colors.card,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },

  input: {
    flex: 1,
    fontSize: Typography.body.fontSize,
    color: Colors.text,
  },

  error: {
    marginTop: spacing.xs,
    color: Colors.danger,
    fontSize: 12,
  },

  icon: {
    marginHorizontal: 6,
  },
});