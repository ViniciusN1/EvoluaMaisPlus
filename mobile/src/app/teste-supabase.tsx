import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { supabase } from "../lib/supabase";

export default function TesteSupabaseScreen() {
  const [testando, setTestando] = useState(false);

  async function testarConexao() {
    try {
      setTestando(true);

      const { error } = await supabase
        .from("perfis")
        .select("id")
        .limit(1);

      if (error) {
        throw error;
      }

      Alert.alert(
        "Conexão concluída",
        "O aplicativo conseguiu acessar o Supabase.",
      );
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Erro desconhecido.";

      Alert.alert(
        "Erro de conexão",
        mensagem,
      );
    } finally {
      setTestando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Teste do Supabase
      </Text>

      <Pressable
        disabled={testando}
        style={[
          styles.button,
          testando && styles.disabled,
        ]}
        onPress={testarConexao}
      >
        <Text style={styles.buttonText}>
          {testando
            ? "Testando..."
            : "Testar conexão"}
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

  title: {
    color: "#0F172A",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 30,
  },

  button: {
    height: 56,
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

  disabled: {
    opacity: 0.5,
  },
});