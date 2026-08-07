import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useMemo, useState } from "react";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  CalendarDays,
  Check,
  Scale,
  X,
} from "lucide-react-native";

import { createWeightRecord } from "../services/weight.service";
import { useWeightStore } from "../store/weight.store";

function convertNumber(value: string) {
  return Number(
    value.trim().replace(",", "."),
  );
}

function formatCurrentDate() {
  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  ).format(new Date());
}

export default function RegisterWeightScreen() {
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] =
    useState(false);

  const heightCm = useWeightStore(
    (state) => state.heightCm,
  );

  const addWeightRecord =
    useWeightStore(
      (state) =>
        state.addWeightRecord,
    );

  const currentWeight = useWeightStore(
    (state) =>
      state.records.at(-1)?.weight ??
      state.initialWeight,
  );

  const numericWeight = useMemo(() => {
    return convertNumber(weight);
  }, [weight]);

  const calculatedBmi = useMemo(() => {
    if (
      !Number.isFinite(numericWeight) ||
      numericWeight <= 0
    ) {
      return null;
    }

    const heightMeters =
      heightCm / 100;

    return (
      numericWeight /
      (heightMeters * heightMeters)
    );
  }, [heightCm, numericWeight]);

  const difference = useMemo(() => {
    if (
      !Number.isFinite(numericWeight) ||
      numericWeight <= 0
    ) {
      return null;
    }

    return numericWeight - currentWeight;
  }, [currentWeight, numericWeight]);

  const validWeight =
    Number.isFinite(numericWeight) &&
    numericWeight >= 25 &&
    numericWeight <= 400;

  async function handleSave() {
  if (
    !validWeight ||
    saving ||
    calculatedBmi === null
  ) {
    return;
  }

  try {
    setSaving(true);

    const savedRecord =
      await createWeightRecord({
        weight: numericWeight,
        bmi: Number(
          calculatedBmi.toFixed(2),
        ),
        note:
          note.trim() || undefined,
      });

    addWeightRecord(
      Number(savedRecord.weight),
      savedRecord.note ?? undefined,
    );

    Alert.alert(
      "Peso registrado",
      "Seu novo peso foi salvo na sua conta.",
      [
        {
          text: "Continuar",
          onPress: () => router.back(),
        },
      ],
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível salvar o peso.";

    Alert.alert(
      "Erro ao salvar",
      message,
    );
  } finally {
    setSaving(false);
  }
}

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <StatusBar style="dark" />

      <View style={styles.handle} />

      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.pressed,
          ]}
          onPress={() => router.back()}
        >
          <X
            size={23}
            color="#334155"
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          Registrar peso
        </Text>

        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <Scale
            size={34}
            color="#208AEF"
          />
        </View>

        <Text style={styles.title}>
          Qual é seu peso hoje?
        </Text>

        <Text style={styles.description}>
          Registre seu peso para atualizar
          automaticamente seu IMC e sua
          evolução.
        </Text>

        <View
          style={[
            styles.weightInputContainer,
            weight.length > 0 &&
              !validWeight &&
              styles.invalidInput,
          ]}
        >
          <TextInput
            value={weight}
            onChangeText={setWeight}
            placeholder="95,4"
            placeholderTextColor="#CBD5E1"
            keyboardType="decimal-pad"
            maxLength={6}
            style={styles.weightInput}
            autoFocus
          />

          <Text style={styles.weightUnit}>
            kg
          </Text>
        </View>

        {weight.length > 0 &&
          !validWeight && (
            <Text style={styles.errorText}>
              Informe um peso entre 25 e
              400 kg.
            </Text>
          )}

        <View style={styles.dateCard}>
          <CalendarDays
            size={21}
            color="#208AEF"
          />

          <View style={styles.dateContent}>
            <Text style={styles.dateLabel}>
              Data do registro
            </Text>

            <Text style={styles.dateValue}>
              {formatCurrentDate()}
            </Text>
          </View>
        </View>

        {calculatedBmi !== null && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>
              Resultado estimado
            </Text>

            <View style={styles.resultRow}>
              <View style={styles.resultItem}>
                <Text
                  style={styles.resultLabel}
                >
                  Novo IMC
                </Text>

                <Text
                  style={styles.resultValue}
                >
                  {calculatedBmi.toFixed(1)}
                </Text>
              </View>

              <View style={styles.resultDivider} />

              <View style={styles.resultItem}>
                <Text
                  style={styles.resultLabel}
                >
                  Diferença
                </Text>

                <Text
                  style={[
                    styles.resultValue,
                    difference !== null &&
                    difference <= 0
                      ? styles.positive
                      : styles.warning,
                  ]}
                >
                  {difference !== null &&
                  difference > 0
                    ? "+"
                    : ""}
                  {difference?.toFixed(1)} kg
                </Text>
              </View>
            </View>
          </View>
        )}

        <Text style={styles.inputLabel}>
          Observação opcional
        </Text>

        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Exemplo: peso medido pela manhã"
          placeholderTextColor="#94A3B8"
          multiline
          maxLength={200}
          style={styles.noteInput}
          textAlignVertical="top"
        />

        <Pressable
          disabled={!validWeight || saving}
          style={({ pressed }) => [
            styles.saveButton,
            (!validWeight || saving) &&
              styles.disabledButton,
            pressed &&
              validWeight &&
              styles.pressed,
          ]}
          onPress={handleSave}
        >
          <Check
            size={21}
            color="#FFFFFF"
            strokeWidth={3}
          />

          <Text style={styles.saveText}>
            {saving
              ? "Salvando..."
              : "Salvar novo peso"}
          </Text>
        </Pressable>

        <Text style={styles.notice}>
          Para acompanhar melhor a tendência,
          tente medir seu peso em condições
          semelhantes, como no mesmo horário do
          dia.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  handle: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginTop: 10,
  },

  header: {
    height: 66,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    color: "#0F172A",
    fontSize: 17,
    fontWeight: "800",
  },

  headerSpace: {
    width: 42,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 50,
  },

  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: "#EAF5FF",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "#0F172A",
    fontSize: 28,
    lineHeight: 35,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 22,
  },

  description: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 10,
  },

  weightInputContainer: {
    height: 90,
    borderWidth: 2,
    borderColor: "#208AEF",
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    marginTop: 30,
  },

  invalidInput: {
    borderColor: "#EF4444",
  },

  weightInput: {
    flex: 1,
    color: "#0F172A",
    fontSize: 42,
    fontWeight: "800",
    textAlign: "center",
  },

  weightUnit: {
    color: "#64748B",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
  },

  errorText: {
    color: "#EF4444",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },

  dateCard: {
    minHeight: 68,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginTop: 18,
  },

  dateContent: {
    marginLeft: 13,
  },

  dateLabel: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "600",
  },

  dateValue: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 3,
  },

  resultCard: {
    borderRadius: 20,
    backgroundColor: "#EFF8FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    padding: 18,
    marginTop: 18,
  },

  resultTitle: {
    color: "#0F5FA8",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 15,
  },

  resultRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  resultItem: {
    flex: 1,
    alignItems: "center",
  },

  resultDivider: {
    width: 1,
    height: 45,
    backgroundColor: "#BAE6FD",
  },

  resultLabel: {
    color: "#64748B",
    fontSize: 11,
  },

  resultValue: {
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 5,
  },

  positive: {
    color: "#22C55E",
  },

  warning: {
    color: "#F59E0B",
  },

  inputLabel: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 9,
  },

  noteInput: {
    minHeight: 110,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    color: "#0F172A",
    fontSize: 14,
    lineHeight: 21,
    padding: 16,
  },

  saveButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#208AEF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
    marginTop: 26,
  },

  disabledButton: {
    backgroundColor: "#CBD5E1",
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  notice: {
    color: "#94A3B8",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 16,
  },

  pressed: {
    opacity: 0.78,
  },
});