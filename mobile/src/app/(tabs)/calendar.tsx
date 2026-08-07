import {
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

export default function CalendarScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.content}
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
              Hoje, 20:00
            </Text>

            <Text style={styles.nextMedication}>
              Mounjaro · 7,5 mg
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Aplicações recentes
        </Text>

        <View style={styles.historyCard}>
          <HistoryItem
            date="28 de julho"
            medication="Mounjaro · 7,5 mg"
          />

          <HistoryItem
            date="21 de julho"
            medication="Mounjaro · 7,5 mg"
          />

          <HistoryItem
            date="14 de julho"
            medication="Mounjaro · 5 mg"
            last
          />
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