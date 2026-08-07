import { supabase } from "../lib/supabase";

export type HomeProfileData = {
  name: string;
  email: string;
  plan: "free" | "premium";

  heightCm: number;
  initialWeight: number;
  currentWeight: number;
  targetWeight: number;

  medication: string;
  currentDose: string;
  frequency: string;

  currentBmi: number;
};

export async function getHomeProfile():
  Promise<HomeProfileData> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error(
      "Usuário não autenticado.",
    );
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select(
        `
        name,
        email,
        plan
        `,
      )
      .eq("id", user.id)
      .single();

  if (profileError) {
    throw profileError;
  }

  const {
    data: treatment,
    error: treatmentError,
  } = await supabase
    .from("treatment_profiles")
    .select(
      `
      height_cm,
      initial_weight,
      current_weight,
      target_weight,
      medication,
      current_dose,
      frequency,
      current_bmi
      `,
    )
    .eq("user_id", user.id)
    .single();

  if (treatmentError) {
    throw treatmentError;
  }

  return {
    name: profile.name ?? "Usuário",
    email: profile.email ?? "",
    plan:
      profile.plan === "premium"
        ? "premium"
        : "free",

    heightCm:
      Number(treatment.height_cm),

    initialWeight:
      Number(treatment.initial_weight),

    currentWeight:
      Number(treatment.current_weight),

    targetWeight:
      Number(
        treatment.target_weight ??
          treatment.current_weight,
      ),

    medication:
      treatment.medication,

    currentDose:
      treatment.current_dose,

    frequency:
      treatment.frequency,

    currentBmi:
      Number(
        treatment.current_bmi ?? 0,
      ),
  };
}