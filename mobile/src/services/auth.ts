import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import { supabase } from "../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

export async function entrarComGoogle() {
  const redirectTo = Linking.createURL(
    "auth/callback",
    {
      scheme: "evoluamais",
    },
  );

  console.log(
    "REDIRECT OAUTH:",
    redirectTo,
  );

  const { data, error } =
    await supabase.auth.signInWithOAuth({
      provider: "google",

      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

  if (error) {
    console.error(
      "ERRO SIGN IN OAUTH:",
      error,
    );

    throw error;
  }

  if (!data.url) {
    throw new Error(
      "O Supabase não retornou a URL de autenticação.",
    );
  }

  console.log(
    "URL GOOGLE:",
    data.url,
  );

  const result =
    await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectTo,
    );

  console.log(
    "RESULTADO NAVEGADOR:",
    result,
  );

  if (result.type !== "success") {
    return {
      success: false,
      cancelled: true,
      session: null,
    };
  }

  console.log(
    "URL RETORNO:",
    result.url,
  );

  const url = new URL(result.url);

  /*
   * FLUXO PKCE
   *
   * Se vier ?code=...
   * precisamos trocar o código
   * por uma sessão Supabase.
   */
  const code =
    url.searchParams.get("code");

  if (code) {
    console.log(
      "CÓDIGO PKCE RECEBIDO",
    );

    const {
      data: exchangeData,
      error: exchangeError,
    } =
      await supabase.auth
        .exchangeCodeForSession(code);

    if (exchangeError) {
      console.error(
        "ERRO EXCHANGE SESSION:",
        exchangeError,
      );

      throw exchangeError;
    }

    if (!exchangeData.session) {
      throw new Error(
        "O código OAuth foi recebido, mas a sessão não foi criada.",
      );
    }

    console.log(
      "SESSÃO PKCE CRIADA:",
      exchangeData.session.user.email,
    );

    return {
      success: true,
      cancelled: false,
      session:
        exchangeData.session,
    };
  }

  /*
   * FLUXO IMPLÍCITO
   *
   * Mantemos como fallback caso
   * o Supabase devolva tokens
   * diretamente no hash.
   */
  const hashParams =
    new URLSearchParams(
      url.hash.replace("#", ""),
    );

  const accessToken =
    url.searchParams.get(
      "access_token",
    ) ??
    hashParams.get(
      "access_token",
    );

  const refreshToken =
    url.searchParams.get(
      "refresh_token",
    ) ??
    hashParams.get(
      "refresh_token",
    );

  if (
    accessToken &&
    refreshToken
  ) {
    console.log(
      "TOKENS IMPLÍCITOS RECEBIDOS",
    );

    const {
      data: sessionData,
      error: sessionError,
    } =
      await supabase.auth.setSession({
        access_token:
          accessToken,

        refresh_token:
          refreshToken,
      });

    if (sessionError) {
      console.error(
        "ERRO SET SESSION:",
        sessionError,
      );

      throw sessionError;
    }

    if (!sessionData.session) {
      throw new Error(
        "Os tokens foram recebidos, mas a sessão não foi criada.",
      );
    }

    console.log(
      "SESSÃO CRIADA:",
      sessionData.session.user.email,
    );

    return {
      success: true,
      cancelled: false,
      session:
        sessionData.session,
    };
  }

  throw new Error(
    `O Google retornou ao aplicativo, mas não encontramos nem "code" nem tokens na URL.`,
  );
}