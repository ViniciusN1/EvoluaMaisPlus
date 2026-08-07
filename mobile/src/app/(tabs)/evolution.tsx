import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  ChartNoAxesCombined,
  TrendingDown,
} from "lucide-react-native";

export default function EvolutionScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Sua evolução
        </Text>

        <Text style={styles.description}>
          Acompanhe peso, IMC, medidas e
          mudanças ao longo do tempo.
        </Text>

        <View style={styles.heroCard}>
          <View style={styles.iconBox}>
            <TrendingDown
              size={28}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.heroLabel}>
            Peso eliminado
          </Text>

          <Text style={styles.heroValue}>
            8,6 kg
          </Text>

          <Text style={styles.heroText}>
            Desde o início do acompanhamento
          </Text>
        </View>

        <View style={styles.placeholderCard}>
          <ChartNoAxesCombined
            size={38}
            color="#208AEF"
          />

          <Text style={styles.placeholderTitle}>
            Gráfico de peso
          </Text>

          <Text style={styles.placeholderText}>
            Na próxima etapa conectaremos seu
            histórico e criaremos o gráfico de
            evolução.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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

  heroCard: {
    borderRadius: 24,
    backgroundColor: "#208AEF",
    padding: 24,
  },

  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor:
      "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },

  heroLabel: {
    color: "#DBEAFE",
    fontSize: 14,
    fontWeight: "600",
  },

  heroValue: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "800",
    marginTop: 4,
  },

  heroText: {
    color: "#EAF5FF",
    fontSize: 13,
    marginTop: 6,
  },

  placeholderCard: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 26,
    alignItems: "center",
    marginTop: 20,
  },

  placeholderTitle: {
    color: "#0F172A",
    fontSize: 19,
    fontWeight: "800",
    marginTop: 16,
  },

  placeholderText: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8,
  },
});