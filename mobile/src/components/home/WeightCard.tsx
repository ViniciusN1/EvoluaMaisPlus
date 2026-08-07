import { StyleSheet, Text, View } from "react-native";

import Card from "../ui/card/Card";

import {
  Colors,
  spacing,
} from "../../theme";

type WeightCardProps = {
  currentWeight: number;
  initialWeight: number;
  weeklyDifference?: number;
};

export default function WeightCard({
  currentWeight,
  initialWeight,
  weeklyDifference = 0,
}: WeightCardProps) {
  const totalDifference =
    initialWeight - currentWeight;

  const lostWeight = totalDifference >= 0;

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⚖️</Text>
        </View>

        <View style={styles.headerText}>
          <Text style={styles.label}>
            Peso atual
          </Text>

          <Text style={styles.weight}>
            {currentWeight.toFixed(1)}
            <Text style={styles.unit}> kg</Text>
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>
            Desde o início
          </Text>

          <Text
            style={[
              styles.metricValue,
              lostWeight
                ? styles.positive
                : styles.warning,
            ]}
          >
            {lostWeight ? "↓" : "↑"}{" "}
            {Math.abs(totalDifference).toFixed(1)} kg
          </Text>
        </View>

        <View style={styles.metricRight}>
          <Text style={styles.metricLabel}>
            Última semana
          </Text>

          <Text
            style={[
              styles.metricValue,
              weeklyDifference <= 0
                ? styles.positive
                : styles.warning,
            ]}
          >
            {weeklyDifference <= 0 ? "↓" : "↑"}{" "}
            {Math.abs(weeklyDifference).toFixed(1)} kg
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 28,
  },

  headerText: {
    marginLeft: spacing.md,
  },

  label: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },

  weight: {
    color: Colors.text,
    fontSize: 34,
    fontWeight: "800",
    marginTop: 2,
  },

  unit: {
    color: Colors.textSecondary,
    fontSize: 17,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: spacing.lg,
  },

  metrics: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  metric: {
    flex: 1,
  },

  metricRight: {
    flex: 1,
    alignItems: "flex-end",
  },

  metricLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
  },

  metricValue: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 5,
  },

  positive: {
    color: Colors.success,
  },

  warning: {
    color: Colors.warning,
  },
});