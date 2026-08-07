import { StyleSheet, Text, View } from "react-native";

import Card from "../ui/card/Card";

import {
  Colors,
  spacing,
} from "../../theme";

type ProgressCardProps = {
  initialWeight: number;
  currentWeight: number;
  targetWeight: number;
};

function calcularProgresso(
  initialWeight: number,
  currentWeight: number,
  targetWeight: number,
) {
  const total = initialWeight - targetWeight;
  const completed = initialWeight - currentWeight;

  if (total <= 0) {
    return 0;
  }

  const percentage = (completed / total) * 100;

  return Math.min(
    100,
    Math.max(0, percentage),
  );
}

export default function ProgressCard({
  initialWeight,
  currentWeight,
  targetWeight,
}: ProgressCardProps) {
  const progress = calcularProgresso(
    initialWeight,
    currentWeight,
    targetWeight,
  );

  const remainingWeight = Math.max(
    0,
    currentWeight - targetWeight,
  );

  return (
    <Card>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>
            Progresso da meta
          </Text>

          <Text style={styles.percentage}>
            {progress.toFixed(0)}%
          </Text>
        </View>

        <View style={styles.goalBadge}>
          <Text style={styles.goalBadgeText}>
            Meta: {targetWeight.toFixed(1)} kg
          </Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${progress}%`,
            },
          ]}
        />
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>
            Peso atual
          </Text>

          <Text style={styles.footerValue}>
            {currentWeight.toFixed(1)} kg
          </Text>
        </View>

        <View style={styles.footerRight}>
          <Text style={styles.footerLabel}>
            Restante
          </Text>

          <Text style={styles.footerValue}>
            {remainingWeight.toFixed(1)} kg
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  label: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },

  percentage: {
    color: Colors.primary,
    fontSize: 42,
    fontWeight: "800",
    marginTop: 4,
  },

  goalBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  goalBadgeText: {
    color: Colors.primaryDark,
    fontSize: 12,
    fontWeight: "700",
  },

  progressTrack: {
    width: "100%",
    height: 12,
    borderRadius: 999,
    backgroundColor: Colors.gray200,
    overflow: "hidden",
    marginTop: spacing.lg,
  },

  progressBar: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },

  footerRight: {
    alignItems: "flex-end",
  },

  footerLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },

  footerValue: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
});