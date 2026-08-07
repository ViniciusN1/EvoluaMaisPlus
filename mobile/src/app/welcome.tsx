
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require(
          "../assets/images/icon.png"
        )}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        Vamos conhecer você
      </Text>

      <Text style={styles.description}>
        Responda algumas perguntas para
        personalizarmos seu acompanhamento.
        Isso leva menos de dois minutos.
      </Text>

      <View style={styles.items}>
        <Text style={styles.item}>
          ✓ Calcular seu IMC
        </Text>

        <Text style={styles.item}>
          ✓ Organizar seu tratamento
        </Text>

        <Text style={styles.item}>
          ✓ Definir metas e dificuldades
        </Text>

        <Text style={styles.item}>
          ✓ Preparar seu painel inicial
        </Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() =>
          router.replace("/onboarding")
        }
      >
        <Text style={styles.buttonText}>
          Começar
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F8FAFC",
  },

  logo: {
    width: 110,
    height: 110,
    alignSelf: "center",
    borderRadius: 26,
    marginBottom: 28,
  },

  title: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
  },

  description: {
    color: "#64748B",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    marginTop: 12,
  },

  items: {
    gap: 14,
    marginVertical: 34,
  },

  item: {
    color: "#334155",
    fontSize: 16,
    fontWeight: "600",
  },

  button: {
    height: 58,
    borderRadius: 14,
    backgroundColor: "#208AEF",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});