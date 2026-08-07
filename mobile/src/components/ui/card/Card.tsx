import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import {
  Colors,
  Shadows,
  spacing,
} from "../../../theme";

type Props = {
  children: ReactNode;
};

export default function Card({
  children,
}: Props) {
  return (
    <View style={styles.card}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,

    borderRadius: 24,

    padding: spacing.lg,

    marginBottom: spacing.lg,

    ...Shadows.card,
  },
});