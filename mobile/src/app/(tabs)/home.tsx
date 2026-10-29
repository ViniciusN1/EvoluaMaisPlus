import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useMemo, useState } from "react";

import { useWeightStore } from "../../store/weight.store";
import { useWeightSync } from "../../hooks/useWeightSync";

import GreetingCard from "../../components/home/GreetingCard";
import ProgressCard from "../../components/home/ProgressCard";
import WeightCard from "../../components/home/WeightCard";
import InjectionCard from "../../components/home/InjectionCard";
import WaterCard from "../../components/home/WaterCard";
import StepsCard from "../../components/home/StepsCard";
import SleepCard from "../../components/home/SleepCard";
import ImcCard from "../../components/home/ImcCard";
import AiCard from "../../components/home/AiCard";

import { useInjections } from "../../hooks/useInjections";
import {
  formatRelativeDay,
  formatTime,
} from "../../services/injection.service";
import PrimaryButton from "../../components/ui/button/PrimaryButton";
import SectionTitle from "../../components/ui/text/SectionTitle";

import {
  Colors,
  spacing,
} from "../../theme";

export default function HomeScreen() {
  const [refreshing, setRefreshing] =
    useState(false);

  const {
    treatment,
    injections,
    next: nextInjection,
    refresh: refreshInjections,
    confirmRegister,
  } = useInjections();

  const initialWeight = useWeightStore(
    (state) => state.initialWeight,
  );

  const targetWeight = useWeightStore(
    (state) => state.targetWeight,
  );

  const records = useWeightStore(
    (state) => state.records,
  );

  const {
    loading: loadingWeights,
    error: weightError,
  } = useWeightSync();

  const currentRecord = useMemo(() => {
    return records.length > 0
      ? records[records.length - 1]
      : undefined;
  }, [records]);

  const previousRecord = useMemo(() => {
    return records.length > 1
      ? records[records.length - 2]
      : undefined;
  }, [records]);

  const currentWeight =
    currentRecord?.weight ??
    initialWeight;

  const currentBmi =
    currentRecord?.bmi ?? 0;

  const previousBmi =
    previousRecord?.bmi;

  const weightDifference =
    previousRecord
      ? currentWeight -
        previousRecord.weight
      : 0;

  async function handleRefresh() {
    try {
      setRefreshing(true);

      /*
        Quando evoluirmos useWeightSync,
        vamos expor uma função refresh()
        e chamá-la aqui.
      */

      await refreshInjections();
    } finally {
      setRefreshing(false);
    }
  }

  function handleRegisterApplication() {
    Alert.alert(
      "Registrar aplicação",
      "Na próxima etapa vamos salvar a aplicação no Supabase.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Continuar",
          onPress: () => {
            console.log(
              "Registrar aplicação",
            );
          },
        },
      ],
    );
  }

  function handleAddWater() {
    Alert.alert(
      "Adicionar água",
      "Em breve este botão adicionará água ao seu registro diário.",
    );
  }

  function handleOpenAi() {
    router.push("/(tabs)/ai");
  }

  function handleRegisterWeight() {
    router.push("/register-weight");
  }

  if (
    loadingWeights &&
    records.length === 0
  ) {
    return (
      <SafeAreaView
        style={styles.loadingScreen}
      >
        <StatusBar style="dark" />

        <ActivityIndicator
          size="large"
          color={Colors.primary}
        />

        <Text style={styles.loadingText}>
          Carregando sua evolução...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        <GreetingCard
          name="Vinicius"
        />

        {weightError && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>
              Não foi possível sincronizar
            </Text>

            <Text style={styles.errorMessage}>
              {weightError}
            </Text>
          </View>
        )}

        <SectionTitle title="Sua evolução" />

        <ProgressCard
          initialWeight={initialWeight}
          currentWeight={currentWeight}
          targetWeight={targetWeight}
        />

        <WeightCard
          initialWeight={initialWeight}
          currentWeight={currentWeight}
          weeklyDifference={
            weightDifference
          }
        />

        <SectionTitle title="Seu tratamento" />

        <InjectionCard
          medication={treatment?.medication ?? "—"}
          dose={treatment?.dose ?? ""}
          nextApplication={
            nextInjection
              ? formatRelativeDay(nextInjection)
              : injections.length === 0
                ? "Registre a primeira"
                : "Sem previsão"
          }
          time={
            nextInjection
              ? formatTime(nextInjection)
              : undefined
          }
          onRegister={confirmRegister}
        />

        <SectionTitle title="Resumo de hoje" />

        <View style={styles.grid}>
          <WaterCard
            currentLiters={1.8}
            targetLiters={3}
            onAddWater={handleAddWater}
          />

          <StepsCard
            steps={7421}
            targetSteps={10000}
          />
        </View>

        <View style={styles.grid}>
          <SleepCard
            hours={7}
            minutes={42}
            targetHours={8}
          />

          <ImcCard
            bmi={currentBmi}
            previousBmi={previousBmi}
          />
        </View>

        <SectionTitle
          title="Análise inteligente"
        />

        <AiCard
          title="Bom progresso esta semana"
          message={
            weightDifference < 0
              ? `Seu último registro mostrou uma redução de ${Math.abs(
                  weightDifference,
                ).toFixed(
                  1,
                )} kg. Continue registrando seus dados para acompanharmos a tendência.`
              : "Continue registrando seu peso para construirmos uma análise mais completa da sua evolução."
          }
          premium
          onPress={handleOpenAi}
        />

        <View
          style={
            styles.primaryActionContainer
          }
        >
          <PrimaryButton
            title="Registrar novo peso"
            onPress={
              handleRegisterWeight
            }
          />
        </View>

        <Text style={styles.footerNotice}>
          O Evolua Mais é uma ferramenta de
          acompanhamento e não substitui
          orientação médica.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.background,
  },

  loadingScreen: {
    flex: 1,
    backgroundColor:
      Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 16,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 100,
  },

  grid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: spacing.md,
  },

  errorCard: {
    borderRadius: 18,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: 16,
    marginBottom: spacing.lg,
  },

  errorTitle: {
    color: "#991B1B",
    fontSize: 14,
    fontWeight: "800",
  },

  errorMessage: {
    color: "#B91C1C",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  primaryActionContainer: {
    marginTop: spacing.sm,
  },

  footerNotice: {
    color: Colors.textSecondary,
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    marginTop: 18,
    paddingHorizontal: 20,
  },
});