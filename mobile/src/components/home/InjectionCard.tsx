import { Pressable, StyleSheet, Text, View } from "react-native";

import Card from "../ui/card/Card";

import {
  Colors,
  spacing,
} from "../../theme";

type InjectionCardProps = {
  medication: string;
  dose: string;
  nextApplication: string;
  time?: string;
  onRegister: () => void;
};

export default function InjectionCard({
  medication,
  dose,
  nextApplication,
  time,
  onRegister,
}: InjectionCardProps) {
  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>💉</Text>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.label}>
            Próxima aplicação
          </Text>

          <Text style={styles.date}>
            {nextApplication}
          </Text>

          {time && (
            <Text style={styles.time}>
              às {time}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.medicationBox}>
        <View>
          <Text style={styles.medicationLabel}>
            Medicamento
          </Text>

          <Text style={styles.medication}>
            {medication}
          </Text>
        </View>

        <View style={styles.doseContainer}>
          <Text style={styles.doseLabel}>
            Dose registrada
          </Text>

          <Text style={styles.dose}>
            {dose}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onRegister}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>
          Registrar aplicação
        </Text>
      </Pressable>

      <Text style={styles.notice}>
        Registre somente a dose prescrita pelo seu profissional de saúde.
      </Text>
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
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 28,
  },

  headerContent: {
    marginLeft: spacing.md,
  },

  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },

  date: {
    color: Colors.text,
    fontSize: 23,
    fontWeight: "800",
    marginTop: 3,
  },

  time: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
  },

  medicationBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.gray100,
    borderRadius: 16,
    padding: spacing.md,
    marginTop: spacing.lg,
  },

  medicationLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
  },

  medication: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 4,
  },

  doseContainer: {
    alignItems: "flex-end",
  },

  doseLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
  },

  dose: {
    color: Colors.primary,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 4,
  },

  button: {
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.md,
  },

  buttonPressed: {
    opacity: 0.82,
  },

  buttonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "700",
  },

  notice: {
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 10,
  },
});