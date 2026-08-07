import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { supabase } from "../lib/supabase";

export default function AuthLoadingScreen() {
  const [erro, setErro] =
    useState<string | null>(null);

  const [tentandoNovamente, setTentandoNovamente] =
    useState(false);

  useEffect(() => {
    let ativo = true;

    async function iniciar() {
      await verificarUsuario(ativo);
    }

    iniciar();

    return () => {
      ativo = false;
    };
  }, []);

  async function verificarUsuario(
    componenteAtivo = true,
  ) {
    try {
      setErro(null);

      /*
       * Pequeno intervalo para permitir
       * que a sessão retornada pelo OAuth
       * seja persistida localmente.
       */
      await esperar(400);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!componenteAtivo) {
        return;
      }

      if (sessionError) {
        throw sessionError;
      }

      if (!session) {
        console.log(
          "AUTH-LOADING: sessão não encontrada.",
        );

        router.replace("/login");
        return;
      }

      const user = session.user;

      console.log(
        "AUTH-LOADING: usuário autenticado.",
      );

      /*
       * Procura o perfil público
       * correspondente ao auth.users.
       */
      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select(
          `
          id,
          name,
          email,
          avatar_url,
          plan,
          onboarding_completed
          `,
        )
        .eq("id", user.id)
        .maybeSingle();

      if (!componenteAtivo) {
        return;
      }

      if (profileError) {
        throw profileError;
      }

      /*
       * PRIMEIRO LOGIN
       *
       * O usuário já existe em auth.users,
       * mas ainda não possui uma linha
       * em public.profiles.
       */
      if (!profile) {
        const nome =
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          "";

        const avatar =
          user.user_metadata?.avatar_url ??
          user.user_metadata?.picture ??
          null;

        const {
          error: createProfileError,
        } = await supabase
          .from("profiles")
          .insert({
            id: user.id,

            name: nome,

            email:
              user.email ?? "",

            avatar_url:
              avatar,

            plan:
              "free",

            onboarding_completed:
              false,

            updated_at:
              new Date().toISOString(),
          });

        if (!componenteAtivo) {
          return;
        }

        if (createProfileError) {
          throw createProfileError;
        }

        console.log(
          "AUTH-LOADING: perfil criado.",
        );

        router.replace("/welcome");
        return;
      }

      /*
       * Se o usuário já possui perfil,
       * aproveitamos para manter alguns
       * dados básicos sincronizados com Google.
       */
      const novoNome =
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        profile.name ??
        "";

      const novoAvatar =
        user.user_metadata?.avatar_url ??
        user.user_metadata?.picture ??
        profile.avatar_url ??
        null;

      const novoEmail =
        user.email ??
        profile.email ??
        "";

      const {
        error: updateProfileError,
      } = await supabase
        .from("profiles")
        .update({
          name: novoNome,
          email: novoEmail,
          avatar_url: novoAvatar,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateProfileError) {
        console.warn(
          "Não foi possível atualizar os dados básicos do perfil:",
          updateProfileError.message,
        );
      }

      if (!componenteAtivo) {
        return;
      }

      /*
       * USUÁRIO JÁ FEZ ONBOARDING
       */
      if (profile.onboarding_completed) {
        console.log(
          "AUTH-LOADING: onboarding concluído.",
        );

        router.replace(
          "/(tabs)/home",
        );

        return;
      }

      /*
       * USUÁRIO EXISTE,
       * MAS AINDA PRECISA RESPONDER
       * AO QUESTIONÁRIO.
       */
      console.log(
        "AUTH-LOADING: onboarding pendente.",
      );

      router.replace("/welcome");
    } catch (error) {
      console.error(
        "ERRO AUTH-LOADING:",
        error,
      );

      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível preparar sua conta.";

      if (componenteAtivo) {
        setErro(mensagem);
      }
    }
  }

  async function tentarNovamente() {
    if (tentandoNovamente) {
      return;
    }

    try {
      setTentandoNovamente(true);

      await verificarUsuario(true);
    } finally {
      setTentandoNovamente(false);
    }
  }

  async function voltarAoLogin() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error(
        "Erro ao encerrar sessão:",
        error,
      );
    }

    router.replace("/login");
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {!erro ? (
        <>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>
              E+
            </Text>
          </View>

          <ActivityIndicator
            size="large"
            color="#208AEF"
          />

          <Text style={styles.title}>
            Preparando sua conta
          </Text>

          <Text style={styles.text}>
            Estamos carregando seu perfil e
            preparando sua experiência no
            Evolua Mais.
          </Text>
        </>
      ) : (
        <>
          <View style={styles.errorIcon}>
            <Text style={styles.errorIconText}>
              !
            </Text>
          </View>

          <Text style={styles.errorTitle}>
            Não foi possível continuar
          </Text>

          <Text style={styles.errorText}>
            {erro}
          </Text>

          <Pressable
            disabled={tentandoNovamente}
            style={({ pressed }) => [
              styles.retryButton,

              tentandoNovamente &&
                styles.disabledButton,

              pressed &&
                !tentandoNovamente &&
                styles.pressed,
            ]}
            onPress={tentarNovamente}
          >
            {tentandoNovamente ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <Text
                style={
                  styles.retryButtonText
                }
              >
                Tentar novamente
              </Text>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.pressed,
            ]}
            onPress={voltarAoLogin}
          >
            <Text
              style={
                styles.loginButtonText
              }
            >
              Voltar ao login
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

function esperar(ms: number) {
  return new Promise<void>(
    (resolve) => {
      setTimeout(resolve, ms);
    },
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      justifyContent:
        "center",

      alignItems:
        "center",

      paddingHorizontal:
        28,

      backgroundColor:
        "#F8FAFC",
    },

    logoBox: {
      width: 70,
      height: 70,

      borderRadius: 24,

      backgroundColor:
        "#EAF5FF",

      justifyContent:
        "center",

      alignItems:
        "center",

      marginBottom: 28,
    },

    logoText: {
      color: "#208AEF",

      fontSize: 25,

      fontWeight: "900",
    },

    title: {
      color: "#0F172A",

      fontSize: 23,

      fontWeight: "800",

      marginTop: 24,

      textAlign: "center",
    },

    text: {
      color: "#64748B",

      fontSize: 14,

      lineHeight: 21,

      textAlign: "center",

      marginTop: 10,

      maxWidth: 310,
    },

    errorIcon: {
      width: 70,
      height: 70,

      borderRadius: 24,

      backgroundColor:
        "#FEF2F2",

      justifyContent:
        "center",

      alignItems:
        "center",

      marginBottom: 24,
    },

    errorIconText: {
      color: "#EF4444",

      fontSize: 32,

      fontWeight: "900",
    },

    errorTitle: {
      color: "#0F172A",

      fontSize: 22,

      fontWeight: "800",

      textAlign: "center",
    },

    errorText: {
      color: "#64748B",

      fontSize: 13,

      lineHeight: 20,

      textAlign: "center",

      marginTop: 10,

      marginBottom: 28,

      maxWidth: 320,
    },

    retryButton: {
      width: "100%",

      height: 56,

      borderRadius: 17,

      backgroundColor:
        "#208AEF",

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    retryButtonText: {
      color: "#FFFFFF",

      fontSize: 15,

      fontWeight: "800",
    },

    loginButton: {
      width: "100%",

      height: 52,

      borderRadius: 17,

      justifyContent:
        "center",

      alignItems:
        "center",

      marginTop: 10,
    },

    loginButtonText: {
      color: "#64748B",

      fontSize: 14,

      fontWeight: "700",
    },

    disabledButton: {
      opacity: 0.55,
    },

    pressed: {
      opacity: 0.78,
    },
  });