import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Colors,
  Shadows,
  spacing,
} from "../../theme";

type ImcCardProps = {
  bmi: number;
  previousBmi?: number;
};

function classificarImc(imc: number) {
  if (imc < 18.5) {
    return "Abaixo da faixa";
  }

  if (imc < 25) {
    return "Faixa saudável";
  }

  if (imc < 30) {
    return "Sobrepeso";
  }

  if (imc < 35) {
    return "Obesidade I";
  }

  if (imc < 40) {
    return "Obesidade II";
  }

  return "Obesidade III";
}

export default function ImcCard({
  bmi,
  previousBmi,
}: ImcCardProps) {
  const diferenca =
    previousBmi !== undefined
      ? bmi - previousBmi
      : null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📊</Text>
        </View>

        {diferenca !== null && (
          <Text
            style={[
              styles.difference,
              diferenca <= 0
                ? styles.positive
                : styles.warning,
            ]}
          >
            {diferenca <= 0 ? "↓" : "↑"}{" "}
            {Math.abs(diferenca).toFixed(1)}
          </Text>
        )}
      </View>

      <Text style={styles.label}>
        IMC
      </Text>

      <Text style={styles.value}>
        {bmi.toFixed(1)}
      </Text>

      <Text style={styles.category}>
        {classificarImc(bmi)}
      </Text>

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          Indicador de acompanhamento
        </Text>
      </View>
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
    backgroundColor: "#FFF7ED",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 22,
  },

  difference: {
    fontSize: 12,
    fontWeight: "800",
  },

  positive: {
    color: Colors.success,
  },

  warning: {
    color: Colors.warning,
  },

  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 16,
  },

  value: {
    color: Colors.text,
    fontSize: 34,
    fontWeight: "800",
    marginTop: 3,
  },

  category: {
    color: Colors.warning,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 3,
  },

  notice: {
    borderRadius: 10,
    backgroundColor: Colors.gray100,
    padding: 10,
    marginTop: 18,
  },

  noticeText: {
    color: Colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    textAlign: "center",
  },
});