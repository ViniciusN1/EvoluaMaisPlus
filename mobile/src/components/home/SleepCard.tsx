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

type SleepCardProps = {
  hours: number;
  minutes: number;
  targetHours?: number;
};

function calcularHorasTotais(
  hours: number,
  minutes: number,
) {
  return hours + minutes / 60;
}

function obterClassificacao(
  totalHours: number,
) {
  if (totalHours < 6) {
    return "Sono curto";
  }

  if (totalHours < 7) {
    return "Pode melhorar";
  }

  if (totalHours <= 9) {
    return "Muito bom";
  }

  return "Sono prolongado";
}

export default function SleepCard({
  hours,
  minutes,
  targetHours = 8,
}: SleepCardProps) {
  const totalHours = calcularHorasTotais(
    hours,
    minutes,
  );

  const progresso = Math.min(
    100,
    Math.max(
      0,
      (totalHours / targetHours) * 100,
    ),
  );

  const larguraBarra: DimensionValue =
    `${progresso}%`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>😴</Text>
        </View>

        <Text style={styles.classification}>
          {obterClassificacao(totalHours)}
        </Text>
      </View>

      <Text style={styles.label}>
        Sono
      </Text>

      <Text style={styles.value}>
        {hours}h
        {String(minutes).padStart(2, "0")}
      </Text>

      <Text style={styles.goal}>
        Meta: {targetHours} horas
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
        Dados manuais por enquanto.
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
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 22,
  },

  classification: {
    color: "#7C3AED",
    fontSize: 11,
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
    backgroundColor: "#8B5CF6",
  },

  message: {
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 14,
  },
});