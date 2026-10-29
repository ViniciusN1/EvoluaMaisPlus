import { supabase } from "../lib/supabase";

export type Injection = {
  id: string;
  medication: string;
  dose: string;
  appliedAt: Date;
  site: string | null;
};

export type Treatment = {
  medication: string;
  dose: string;
  frequency: string;
};

async function getUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("Usuário não autenticado.");
  return data.user.id;
}

export async function getTreatment(): Promise<Treatment> {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("treatment_profiles")
    .select("medication, current_dose, frequency")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return {
    medication: data.medication ?? "",
    dose: data.current_dose ?? "",
    frequency: data.frequency ?? "",
  };
}

export async function listInjections(limit = 20): Promise<Injection[]> {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("injections")
    .select("id, medication, dose, applied_at, site")
    .eq("user_id", userId)
    .order("applied_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    medication: row.medication,
    dose: row.dose,
    appliedAt: new Date(row.applied_at),
    site: row.site,
  }));
}

export async function registerInjection(input: {
  medication: string;
  dose: string;
  appliedAt?: Date;
  site?: string;
}): Promise<void> {
  const userId = await getUserId();
  const { error } = await supabase.from("injections").insert({
    user_id: userId,
    medication: input.medication,
    dose: input.dose,
    applied_at: (input.appliedAt ?? new Date()).toISOString(),
    site: input.site ?? null,
  });
  if (error) throw error;
}

/** Intervalo em dias a partir da frequência escolhida no onboarding. */
export function intervalDays(frequency: string): number | null {
  switch (frequency) {
    case "Diariamente":
      return 1;
    case "Uma vez por semana":
      return 7;
    case "A cada 15 dias":
      return 15;
    default:
      return null; // "Outra frequência": sem previsão automática
  }
}

export function nextApplicationDate(
  last: Injection | undefined,
  frequency: string,
): Date | null {
  if (!last) return null;
  const days = intervalDays(frequency);
  if (!days) return null;
  const next = new Date(last.appliedAt);
  next.setDate(next.getDate() + days);
  return next;
}

/** "Hoje", "Amanhã", "Atrasada há 2 dias" ou "12 de novembro". */
export function formatRelativeDay(date: Date): string {
  const start = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = Math.round((start(date) - start(new Date())) / 86400000);
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Amanhã";
  if (diff < 0)
    return `Atrasada há ${-diff} dia${diff === -1 ? "" : "s"}`;
  return formatDay(date);
}

export function formatDay(date: Date): string {
  return date.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
