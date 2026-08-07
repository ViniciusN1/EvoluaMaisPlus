import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type DimensionValue,
} from "react-native";

import {
  Colors,
  Shadows,
  spacing,
} from "../../theme";

type WaterCardProps = {
  currentLiters: number;
  targetLiters: number;
  onAddWater?: () => void;
};

function calcularProgresso(
  atual: number,
  meta: number,
) {
  if (meta <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, (atual / meta) * 100),
  );
}

export default function WaterCard({
  currentLiters,
  targetLiters,
  onAddWater,
}: WaterCardProps) {
  const progresso = calcularProgresso(
    currentLiters,
    targetLiters,
  );

  const larguraBarra: DimensionValue =
    `${progresso}%`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>💧</Text>
        </View>

        <Text style={styles.percentage}>
          {progresso.toFixed(0)}%
        </Text>
      </View>

      <Text style={styles.label}>
        Água
      </Text>

      <Text style={styles.value}>
        {currentLiters.toFixed(1)}
        <Text style={styles.unit}> L</Text>
      </Text>

      <Text style={styles.goal}>
        Meta: {targetLiters.toFixed(1)} L
      </Text>

      <View style={styles.track}>
        <View
          style={[
            styles.bar,
            {
              width: larguraBarra,
            },
          ]}
        />
      </View>

      {onAddWater && (
        <Pressable
          onPress={onAddWater}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.buttonText}>
            + Adicionar
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 225,
    borderRadius: 22,
    backgroundColor: Colors.white,
    padding: spacing.md,
    ...Shadows.card,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 22,
  },

  percentage: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },

  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 16,
  },

  value: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 3,
  },

  unit: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },

  goal: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 3,
  },

  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.gray200,
    overflow: "hidden",
    marginTop: 14,
  },

  bar: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#38BDF8",
  },

  button: {
    height: 34,
    borderRadius: 11,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },

  buttonText: {
    color: Colors.primaryDark,
    fontSize: 12,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.75,
  },
});