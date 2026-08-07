import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Colors,
  Shadows,
  spacing,
} from "../../theme";

type AiCardProps = {
  title: string;
  message: string;
  premium?: boolean;
  onPress?: () => void;
};

export default function AiCard({
  title,
  message,
  premium = false,
  onPress,
}: AiCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.aiIdentity}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✨</Text>
          </View>

          <View>
            <Text style={styles.label}>
              Evolua IA
            </Text>

            <Text style={styles.title}>
              {title}
            </Text>
          </View>
        </View>

        {premium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>
              PREMIUM
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.message}>
        {message}
      </Text>

      {onPress && (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.buttonText}>
            Ver análise completa
          </Text>
        </Pressable>
      )}

      <Text style={styles.notice}>
        As análises não substituem orientação médica.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    backgroundColor: "#071C47",
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...Shadows.card,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  aiIdentity: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.14)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  icon: {
    fontSize: 25,
  },

  label: {
    color: "#93C5FD",
    fontSize: 12,
    fontWeight: "700",
  },

  title: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
  },

  premiumBadge: {
    borderRadius: 999,
    backgroundColor: "#FBBF24",
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  premiumText: {
    color: "#78350F",
    fontSize: 9,
    fontWeight: "900",
  },

  message: {
    color: "#DBEAFE",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 20,
  },

  button: {
    height: 46,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "800",
  },

  notice: {
    color: "#94A3B8",
    fontSize: 10,
    textAlign: "center",
    marginTop: 12,
  },

  pressed: {
    opacity: 0.8,
  },
});