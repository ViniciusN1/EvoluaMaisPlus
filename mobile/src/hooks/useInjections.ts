import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

import {
  Injection,
  Treatment,
  getTreatment,
  listInjections,
  nextApplicationDate,
  registerInjection,
} from "../services/injection.service";

export function useInjections() {
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [injections, setInjections] = useState<Injection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const [t, list] = await Promise.all([getTreatment(), listInjections()]);
      setTreatment(t);
      setInjections(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar aplicações.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const next = treatment
    ? nextApplicationDate(injections[0], treatment.frequency)
    : null;

  function confirmRegister() {
    if (!treatment) return;
    Alert.alert(
      "Registrar aplicação",
      `Confirmar ${treatment.medication} · ${treatment.dose} agora?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Registrar",
          onPress: async () => {
            try {
              await registerInjection({
                medication: treatment.medication,
                dose: treatment.dose,
              });
              await refresh();
            } catch (e) {
              Alert.alert(
                "Erro",
                e instanceof Error ? e.message : "Não foi possível salvar.",
              );
            }
          },
        },
      ],
    );
  }

  return { treatment, injections, next, loading, error, refresh, confirmRegister };
}
