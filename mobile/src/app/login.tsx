import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { entrarComGoogle } from "../services/auth";

export default function LoginScreen() {
  const [carregando, setCarregando] =
    useState(false);

  async function handleGoogleLogin() {
    if (carregando) {
      return;
    }

    try {
      setCarregando(true);

      const resultado =
        await entrarComGoogle();

      if (
        !resultado.success ||
        resultado.cancelled
      ) {
        return;
      }

      if (!resultado.session) {
        throw new Error(
          "O login foi concluído, mas a sessão do usuário não foi criada.",
        );
      }

      console.log(
        "USUÁRIO AUTENTICADO:",
        resultado.session.user.email,
      );

      router.replace("/auth-loading");
    } catch (error) {
      console.error(
        "Erro no login Google:",
        error,
      );

      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível entrar com Google.";

      Alert.alert(
        "Erro no login",
        mensagem,
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        <Image
          source={require(
            "../assets/images/icon.png"
          )}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.brand}>
          EVOLUA MAIS
        </Text>

        <Text style={styles.title}>
          Bem-vindo
        </Text>

        <Text style={styles.description}>
          Acompanhe seu tratamento, peso,
          hábitos e evolução em um só lugar.
        </Text>

        <Pressable
          disabled={carregando}
          style={({ pressed }) => [
            styles.googleButton,

            carregando &&
              styles.googleButtonDisabled,

            pressed &&
              !carregando &&
              styles.pressed,
          ]}
          onPress={handleGoogleLogin}
        >
          <View
            style={
              styles.googleIconBox
            }
          >
            <Text
              style={
                styles.googleLetter
              }
            >
              G
            </Text>
          </View>

          <Text style={styles.googleText}>
            {carregando
              ? "Entrando com Google..."
              : "Continuar com Google"}
          </Text>
        </Pressable>

        {carregando && (
          <Text style={styles.loadingText}>
            Conclua o login na janela do
            Google.
          </Text>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Sua conta permite manter sua
            evolução sincronizada entre
            Android e iPhone.
          </Text>
        </View>

        <Text style={styles.legal}>
          Ao continuar, você concorda com os
          Termos de Uso e com a Política de
          Privacidade do Evolua Mais.
        </Text>
      </View>

      <Text style={styles.footer}>
        Evolua Mais • v1.0
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 24,
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    borderRadius: 28,
    marginBottom: 20,
  },

  brand: {
    color: "#208AEF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 18,
  },

  title: {
    color: "#0F172A",
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "800",
    textAlign: "center",
  },

  description: {
    color: "#64748B",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 34,
    paddingHorizontal: 8,
  },

  googleButton: {
    height: 60,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },

  googleButtonDisabled: {
    opacity: 0.55,
  },

  googleIconBox: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  googleLetter: {
    color: "#4285F4",
    fontSize: 20,
    fontWeight: "900",
  },

  googleText: {
    color: "#1E293B",
    fontSize: 16,
    fontWeight: "700",
  },

  loadingText: {
    color: "#208AEF",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 12,
  },

  infoBox: {
    borderRadius: 16,
    backgroundColor: "#EFF8FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    padding: 14,
    marginTop: 22,
  },

  infoText: {
    color: "#475569",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },

  legal: {
    color: "#94A3B8",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 24,
    paddingHorizontal: 10,
  },

  footer: {
    color: "#CBD5E1",
    fontSize: 11,
    textAlign: "center",
    paddingBottom: 22,
  },

  pressed: {
    opacity: 0.78,
  },
});