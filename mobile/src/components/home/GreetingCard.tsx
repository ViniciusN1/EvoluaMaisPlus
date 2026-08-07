import { StyleSheet, Text, View } from "react-native";

import {
  Colors,
  Shadows,
  spacing,
} from "../../theme";

type GreetingCardProps = {
  name: string;
};

function obterSaudacao() {
  const horaAtual = new Date().getHours();

  if (horaAtual < 12) {
    return {
      text: "Bom dia",
      icon: "☀️",
    };
  }

  if (horaAtual < 18) {
    return {
      text: "Boa tarde",
      icon: "🌤️",
    };
  }

  return {
    text: "Boa noite",
    icon: "🌙",
  };
}

function formatarDataAtual() {
  const data = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());

  return data.charAt(0).toUpperCase() + data.slice(1);
}

export default function GreetingCard({
  name,
}: GreetingCardProps) {
  const greeting = obterSaudacao();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {greeting.text}, {name}
          </Text>

          <Text style={styles.date}>
            {formatarDataAtual()}
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <Text style={styles.icon}>
            {greeting.icon}
          </Text>
        </View>
      </View>

      <Text style={styles.message}>
        Cada pequeno passo faz parte da sua evolução.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    borderRadius: 26,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...Shadows.card,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  greeting: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "800",
  },

  date: {
    color: "#D9EEFF",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 6,
  },

  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 27,
  },

  message: {
    color: "#EAF5FF",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 22,
  },
});