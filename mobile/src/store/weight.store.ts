import { create } from "zustand";

export type WeightRecord = {
  id: string;
  weight: number;
  bmi: number;
  recordedAt: string;
  note?: string;
};

type WeightState = {
  heightCm: number;
  initialWeight: number;
  targetWeight: number;
  records: WeightRecord[];

  addWeightRecord: (
    weight: number,
    note?: string,
  ) => void;

  replaceRecords: (
    records: WeightRecord[],
  ) => void;

  setProfileData: (data: {
    heightCm: number;
    initialWeight: number;
    targetWeight: number;
  }) => void;
};

function calculateBmi(
  weight: number,
  heightCm: number,
) {
  const heightMeters = heightCm / 100;

  if (
    !Number.isFinite(weight) ||
    !Number.isFinite(heightMeters) ||
    weight <= 0 ||
    heightMeters <= 0
  ) {
    return 0;
  }

  return (
    weight /
    (heightMeters * heightMeters)
  );
}

export const useWeightStore =
  create<WeightState>((set) => ({
    // Temporários.
    // Depois virão do Supabase.
    heightCm: 175,
    initialWeight: 104,
    targetWeight: 82,

    records: [
      {
        id: "initial-record",
        weight: 95.4,
        bmi: calculateBmi(95.4, 175),
        recordedAt: new Date().toISOString(),
        note: "Registro inicial",
      },
    ],

    addWeightRecord: (weight, note) => {
      set((state) => {
        const newRecord: WeightRecord = {
          id: `${Date.now()}-${Math.random()}`,
          weight,
          bmi: calculateBmi(
            weight,
            state.heightCm,
          ),
          recordedAt:
            new Date().toISOString(),
          note,
        };

        return {
          records: [
            ...state.records,
            newRecord,
          ],
        };
      });
    },

    replaceRecords: (records) => {
      set({
        records,
      });
    },

    setProfileData: (data) => {
      set({
        heightCm: data.heightCm,
        initialWeight:
          data.initialWeight,
        targetWeight:
          data.targetWeight,
      });
    },
  }));