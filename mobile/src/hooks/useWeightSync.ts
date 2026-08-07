import { useEffect, useState } from "react";

import { getWeightRecords } from "../services/weight.service";
import { useWeightStore } from "../store/weight.store";

export function useWeightSync() {
  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const replaceRecords = useWeightStore(
    (state) => state.replaceRecords,
  );

  useEffect(() => {
    async function sync() {
      try {
        setError(null);

        const records =
          await getWeightRecords();

        replaceRecords(
          records.map((record) => ({
            id: record.id,
            weight: Number(record.weight),
            bmi: Number(record.bmi ?? 0),
            recordedAt:
              record.recorded_at,
            note:
              record.note ?? undefined,
          })),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar pesos.",
        );
      } finally {
        setLoading(false);
      }
    }

    sync();
  }, [replaceRecords]);

  return {
    loading,
    error,
  };
}