import { supabase } from "../lib/supabase";

export type CreateWeightRecordInput = {
  weight: number;
  bmi: number;
  note?: string;
};

export type WeightRecordRow = {
  id: string;
  user_id: string;
  weight: number;
  bmi: number | null;
  note: string | null;
  recorded_at: string;
  created_at: string;
};

export async function createWeightRecord(
  input: CreateWeightRecordInput,
): Promise<WeightRecordRow> {
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

  const { data, error } = await supabase
    .from("weight_records")
    .insert({
      user_id: user.id,
      weight: input.weight,
      bmi: input.bmi,
      note: input.note ?? null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getWeightRecords(): Promise<
  WeightRecordRow[]
> {
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

  const { data, error } = await supabase
    .from("weight_records")
    .select(
      `
      id,
      user_id,
      weight,
      bmi,
      note,
      recorded_at,
      created_at
      `,
    )
    .eq("user_id", user.id)
    .order("recorded_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}