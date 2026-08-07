import { supabase } from "../lib/supabase";

export type TreatmentProfileInput = {
  treatmentStatus:
    | "vai_comecar"
    | "ja_usa";

  heightCm: number;

  initialWeight: number;
  currentWeight: number;

  treatmentStartDate?:
    | string
    | null;

  medication: string;
  currentDose: string;
  frequency: string;

  goal: string;
  difficulties: string[];

  currentBmi: number;
  targetWeight: number;
};

export async function saveTreatmentProfile(
  input: TreatmentProfileInput,
) {
  const {
    data: { user },
    error: userError,
  } =
    await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error(
      "Usuário não autenticado.",
    );
  }

  const {
    error: treatmentError,
  } = await supabase
    .from("treatment_profiles")
    .upsert(
      {
        user_id: user.id,

        treatment_status:
          input.treatmentStatus,

        height_cm:
          input.heightCm,

        initial_weight:
          input.initialWeight,

        current_weight:
          input.currentWeight,

        target_weight:
          input.targetWeight,

        treatment_start_date:
          input.treatmentStartDate ??
          null,

        medication:
          input.medication,

        current_dose:
          input.currentDose,

        frequency:
          input.frequency,

        goal:
          input.goal,

        difficulties:
          input.difficulties,

        current_bmi:
          input.currentBmi,

        updated_at:
          new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      },
    );

  if (treatmentError) {
    throw treatmentError;
  }

  const {
    data: existingWeight,
    error: existingWeightError,
  } = await supabase
    .from("weight_records")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  if (existingWeightError) {
    throw existingWeightError;
  }

  if (
    !existingWeight ||
    existingWeight.length === 0
  ) {
    const {
      error: weightError,
    } = await supabase
      .from("weight_records")
      .insert({
        user_id: user.id,

        weight:
          input.currentWeight,

        bmi:
          input.currentBmi,

        note:
          "Registro inicial do onboarding",
      });

    if (weightError) {
      throw weightError;
    }
  }

  const {
    error: profileError,
  } = await supabase
    .from("profiles")
    .update({
      onboarding_completed: true,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileError) {
    throw profileError;
  }

  return {
    success: true,
  };
}