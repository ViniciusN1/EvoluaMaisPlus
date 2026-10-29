import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  CalendarDays,
  Check,
  Syringe,
} from "lucide-react-native";

import { useInjections } from "../../hooks/useInjections";
import {
  formatDay,
  formatRelativeDay,
  formatTime,
} from "../../services/injection.service";

export default function CalendarScreen() {
  const {
    treatment,
    injections,
    next,
    loading,
    error,
    refresh,
    confirmRegister,
  } = useInjections();

  const medicationLabel = treatment
    ? `${treatment.medication} · ${treatment.dose}`
    : "";

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refresh} />
        }
      >
        <Text style={styles.title}>
          Agenda
        </Text>

        <Text style={styles.description}>
          Aplicações, lembretes e compromissos
          do seu acompanhamento.
        </Text>

        <View style={styles.nextCard}>
          <View style={styles.iconBox}>
            <Syringe
              size={27}
              color="#208AEF"
            />
          </View>

          <View style={styles.nextContent}>
            <Text style={styles.nextLabel}>
              Próxima aplicação
            </Text>

            <Text style={styles.nextDate}>
              {next
                ? `${formatRelativeDay(next)}, ${formatTime(next)}`
                : injections.length === 0
                  ? "Registre sua primeira aplicação"
                  : "Sem previsão automática"}
            </Text>

            <Text style={styles.nextMedication}>
              {medicationLabel}
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.registerButton}
          onPress={confirmRegister}
          disabled={!treatment}
        >
          <Text style={styles.registerText}>
            Registrar aplicação agora
          </Text>
        </Pressable>

        {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
        {error && <Text style={styles.errorText}>{error}</Text>}

        <Text style={styles.sectionTitle}>
          Aplicações recentes
        </Text>

        <View style={styles.historyCard}>
          {injections.length === 0 && !loading ? (
            <Text style={styles.emptyText}>
              Nenhuma aplicação registrada ainda.
            </Text>
          ) : (
            injections.map((item, index) => (
              <HistoryItem
                key={item.id}
                date={`${formatDay(item.appliedAt)}, ${formatTime(item.appliedAt)}`}
                medication={`${item.medication} · ${item.dose}`}
                last={index === injections.length - 1}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type HistoryItemProps = {
  date: string;
  medication: string;
  last?: boolean;
};

function HistoryItem({
  date,
  medication,
  last = false,
}: HistoryItemProps) {
  return (
    <View
      style={[
        styles.historyItem,
        last && styles.lastItem,
      ]}
    >
      <View style={styles.checkBox}>
        <Check
          size={17}
          color="#FFFFFF"
          strokeWidth={3}
        />
      </View>

      <View style={styles.historyContent}>
        <Text style={styles.historyDate}>
          {date}
        </Text>

        <Text style={styles.historyMedication}>
          {medication}
        </Text>
      </View>

      <CalendarDays
        size={20}
        color="#94A3B8"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  registerButton: {
    marginTop: 14,
    backgroundColor: "#208AEF",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  registerText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },
  errorText: {
    color: "#DC2626",
    marginTop: 12,
  },
  emptyText: {
    color: "#64748B",
    padding: 16,
    textAlign: "center",
  },
  screen: {
    flex: 1,
    backgroundColor: "#F6F8FC",
  },

  content: {
    padding: 24,
    paddingBottom: 120,
  },

  title: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "800",
  },

  description: {
    color: "#64748B",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 26,
  },

  nextCard: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: "#EAF5FF",
    justifyContent: "center",
    alignItems: "center",
  },

  nextContent: {
    marginLeft: 16,
  },

  nextLabel: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },

  nextDate: {
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 3,
  },

  nextMedication: {
    color: "#208AEF",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 3,
  },

  sectionTitle: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 30,
    marginBottom: 14,
  },

  historyCard: {
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
  },

  historyItem: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  lastItem: {
    borderBottomWidth: 0,
  },

  checkBox: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
  },

  historyContent: {
    flex: 1,
    marginLeft: 13,
  },

  historyDate: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "700",
  },

  historyMedication: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 3,
  },
});