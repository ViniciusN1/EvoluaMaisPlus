import {
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

type StepsCardProps = {
  steps: number;
  targetSteps: number;
};

function calcularProgresso(
  passos: number,
  meta: number,
) {
  if (meta <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, (passos / meta) * 100),
  );
}

export default function StepsCard({
  steps,
  targetSteps,
}: StepsCardProps) {
  const progresso = calcularProgresso(
    steps,
    targetSteps,
  );

  const larguraBarra: DimensionValue =
    `${progresso}%`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>👟</Text>
        </View>

        <Text style={styles.percentage}>
          {progresso.toFixed(0)}%
        </Text>
      </View>

      <Text style={styles.label}>
        Passos
      </Text>

      <Text style={styles.value}>
        {steps.toLocaleString("pt-BR")}
      </Text>

      <Text style={styles.goal}>
        Meta:{" "}
        {targetSteps.toLocaleString("pt-BR")}
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

      <Text style={styles.message}>
        {progresso >= 100
          ? "Meta concluída 🎉"
          : "Continue se movimentando"}
      </Text>
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
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 22,
  },

  percentage: {
    color: Colors.success,
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
    backgroundColor: Colors.success,
  },

  message: {
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 14,
  },
});