import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Bot,
  Crown,
  Send,
} from "lucide-react-native";

export default function AiScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.aiIcon}>
          <Bot
            color="#FFFFFF"
            size={28}
          />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            Evolua IA
          </Text>

          <Text style={styles.subtitle}>
            Seu assistente de acompanhamento
          </Text>
        </View>

        <View style={styles.premiumBadge}>
          <Crown
            size={14}
            color="#78350F"
          />

          <Text style={styles.premiumText}>
            PREMIUM
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
      >
        <View style={styles.aiMessage}>
          <Text style={styles.aiName}>
            Evolua IA
          </Text>

          <Text style={styles.messageText}>
            Olá! Posso ajudar você a entender
            seus registros, organizar hábitos e
            acompanhar sua evolução.
          </Text>
        </View>

        <View style={styles.suggestions}>
          <Suggestion text="Como está minha evolução?" />
          <Suggestion text="Resuma minha semana" />
          <Suggestion text="Como melhorar minha hidratação?" />
        </View>

        <Text style={styles.notice}>
          A IA não diagnostica, prescreve ou
          recomenda mudanças de dose.
        </Text>
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          placeholder="Escreva sua pergunta..."
          placeholderTextColor="#94A3B8"
          style={styles.input}
        />

        <Pressable style={styles.sendButton}>
          <Send
            size={21}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Suggestion({
  text,
}: {
  text: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.suggestion,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.suggestionText}>
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F6F8FC",
  },

  header: {
    backgroundColor: "#071C47",
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 22,
    flexDirection: "row",
    alignItems: "center",
  },

  aiIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor:
      "rgba(255,255,255,0.14)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerText: {
    flex: 1,
    marginLeft: 13,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
  },

  subtitle: {
    color: "#BFDBFE",
    fontSize: 11,
    marginTop: 3,
  },

  premiumBadge: {
    borderRadius: 999,
    backgroundColor: "#FBBF24",
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  premiumText: {
    color: "#78350F",
    fontSize: 8,
    fontWeight: "900",
  },

  content: {
    flexGrow: 1,
    padding: 20,
  },

  aiMessage: {
    alignSelf: "flex-start",
    maxWidth: "88%",
    borderRadius: 20,
    borderTopLeftRadius: 6,
    backgroundColor: "#FFFFFF",
    padding: 17,
  },

  aiName: {
    color: "#208AEF",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 7,
  },

  messageText: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 21,
  },

  suggestions: {
    gap: 10,
    marginTop: 24,
  },

  suggestion: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    backgroundColor: "#EFF8FF",
    padding: 15,
  },

  suggestionText: {
    color: "#0F5FA8",
    fontSize: 13,
    fontWeight: "700",
  },

  notice: {
    color: "#94A3B8",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 28,
  },

  inputArea: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 16,
    color: "#0F172A",
    fontSize: 14,
  },

  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#208AEF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },

  pressed: {
    opacity: 0.75,
  },
});