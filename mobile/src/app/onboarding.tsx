import { type ReactNode, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type DimensionValue,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import { Alert } from "react-native";

import { saveTreatmentProfile } from "../services/profile.service";

type SituacaoMedicamento =
  | "vai_comecar"
  | "ja_usa"
  | null;

type OnboardingData = {
  situacaoMedicamento: SituacaoMedicamento;
  alturaCm: string;
  pesoAtual: string;
  pesoInicial: string;
  dataInicioTratamento: string;
  medicamento: string;
  doseAtual: string;
  frequencia: string;
  objetivo: string;
  dificuldades: string[];
};

type FaixaPesoSaudavel = {
  minimo: number;
  referencia: number;
  maximo: number;
};

type ResultadoEmagrecimento = {
  quilosPerdidos: number;
  percentualPerdido: number;
  semanas: number;
  quilosPorSemana: number;
  percentualPorSemana: number;
  classificacao: string;
};

const medicamentos = [
  "Mounjaro",
  "Ozempic",
  "Wegovy",
  "Saxenda",
  "Victoza",
  "Trulicity",
  "Outro",
];

const frequencias = [
  "Diariamente",
  "Uma vez por semana",
  "A cada 15 dias",
  "Outra frequência",
];

const objetivos = [
  "Perder peso",
  "Controlar a glicemia",
  "Melhorar meus hábitos",
  "Acompanhar meu tratamento",
  "Melhorar minha qualidade de vida",
  "Outro objetivo",
];

const opcoesDificuldades = [
  "Controlar a alimentação",
  "Fome ou vontade de comer",
  "Ansiedade",
  "Compulsão alimentar",
  "Consumo de doces",
  "Manter uma rotina",
  "Lembrar das aplicações",
  "Lidar com efeitos adversos",
  "Acompanhar meu peso",
  "Manter a motivação",
  "Praticar atividade física",
  "Outra dificuldade",
];

const TOTAL_ETAPAS = 9;

export default function OnboardingScreen() {
  const [etapa, setEtapa] = useState(1);

  const [form, setForm] = useState<OnboardingData>({
    situacaoMedicamento: null,
    alturaCm: "",
    pesoAtual: "",
    pesoInicial: "",
    dataInicioTratamento: "",
    medicamento: "",
    doseAtual: "",
    frequencia: "",
    objetivo: "",
    dificuldades: [],
  });

  const progresso = useMemo<DimensionValue>(() => {
    return `${(etapa / TOTAL_ETAPAS) * 100}%`;
  }, [etapa]);

  const imcAtual = useMemo(() => {
    return calcularImc(
      form.pesoAtual,
      form.alturaCm,
    );
  }, [form.pesoAtual, form.alturaCm]);

  const faixaPesoSaudavel = useMemo(() => {
    return calcularFaixaPesoSaudavel(
      form.alturaCm,
    );
  }, [form.alturaCm]);

  const resultadoEmagrecimento =
    useMemo<ResultadoEmagrecimento | null>(() => {
      if (
        form.situacaoMedicamento !== "ja_usa"
      ) {
        return null;
      }

      return calcularTaxaEmagrecimento(
        form.pesoInicial,
        form.pesoAtual,
        form.dataInicioTratamento,
      );
    }, [
      form.situacaoMedicamento,
      form.pesoInicial,
      form.pesoAtual,
      form.dataInicioTratamento,
    ]);

  function atualizarCampo<
    K extends keyof OnboardingData,
  >(
    campo: K,
    valor: OnboardingData[K],
  ) {
    setForm((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valor,
    }));
  }

  function alternarDificuldade(
    dificuldade: string,
  ) {
    setForm((estadoAtual) => {
      const jaSelecionada =
        estadoAtual.dificuldades.includes(
          dificuldade,
        );

      return {
        ...estadoAtual,
        dificuldades: jaSelecionada
          ? estadoAtual.dificuldades.filter(
              (item) => item !== dificuldade,
            )
          : [
              ...estadoAtual.dificuldades,
              dificuldade,
            ],
      };
    });
  }

  function obterErroEtapa(): string | null {
  switch (etapa) {
    case 1:
      if (
        form.situacaoMedicamento === null
      ) {
        return "Selecione uma opção para continuar.";
      }

      return null;

    case 2: {
      const altura =
        converterNumero(
          form.alturaCm,
        );

      if (!form.alturaCm.trim()) {
        return "Informe sua altura.";
      }

      if (
        !Number.isFinite(altura) ||
        altura < 100 ||
        altura > 250
      ) {
        return "Informe uma altura válida entre 100 e 250 cm.";
      }

      return null;
    }

    case 3: {
      const pesoAtual =
        converterNumero(
          form.pesoAtual,
        );

      if (!form.pesoAtual.trim()) {
        return "Informe seu peso atual.";
      }

      if (
        !Number.isFinite(pesoAtual) ||
        pesoAtual < 25 ||
        pesoAtual > 400
      ) {
        return "Informe um peso atual entre 25 e 400 kg.";
      }

      if (
        form.situacaoMedicamento ===
        "ja_usa"
      ) {
        const pesoInicial =
          converterNumero(
            form.pesoInicial,
          );

        if (!form.pesoInicial.trim()) {
          return "Informe seu peso no início do tratamento.";
        }

        if (
          !Number.isFinite(
            pesoInicial,
          ) ||
          pesoInicial < 25 ||
          pesoInicial > 400
        ) {
          return "Informe um peso inicial entre 25 e 400 kg.";
        }

        if (
          !validarDataBrasileira(
            form.dataInicioTratamento,
          )
        ) {
          return "Informe uma data de início válida.";
        }
      }

      return null;
    }

    case 4:
      if (imcAtual === null) {
        return "Não foi possível calcular o IMC.";
      }

      return null;

    case 5:
      return form.medicamento
        ? null
        : "Selecione o medicamento.";

    case 6:
      return form.doseAtual.trim()
        ? null
        : "Informe a dose atual.";

    case 7:
      return form.frequencia
        ? null
        : "Selecione a frequência.";

    case 8:
      return form.objetivo
        ? null
        : "Selecione seu objetivo.";

    case 9:
      return form.dificuldades.length > 0
        ? null
        : "Selecione pelo menos uma dificuldade.";

    default:
      return null;
  }
}

 function validarEtapa() {
  switch (etapa) {
    case 1: {
      return form.situacaoMedicamento !== null;
    }

    case 2: {
      const altura = converterNumero(
        form.alturaCm,
      );

      return (
        Number.isFinite(altura) &&
        altura >= 100 &&
        altura <= 250
      );
    }

    case 3: {
      const pesoAtual = converterNumero(
        form.pesoAtual,
      );

      if (
        !Number.isFinite(pesoAtual) ||
        pesoAtual < 25 ||
        pesoAtual > 400
      ) {
        return false;
      }

      if (
        form.situacaoMedicamento ===
        "vai_comecar"
      ) {
        return true;
      }

      if (
        form.situacaoMedicamento !==
        "ja_usa"
      ) {
        return false;
      }

      const pesoInicial = converterNumero(
        form.pesoInicial,
      );

      if (
        !Number.isFinite(pesoInicial) ||
        pesoInicial < 25 ||
        pesoInicial > 400
      ) {
        return false;
      }

      if (
        !validarDataBrasileira(
          form.dataInicioTratamento,
        )
      ) {
        return false;
      }

      return true;
    }

    case 4: {
      return (
        imcAtual !== null &&
        Number.isFinite(imcAtual) &&
        imcAtual > 0 &&
        faixaPesoSaudavel !== null
      );
    }

    case 5: {
      return (
        form.medicamento.trim().length > 0
      );
    }

    case 6: {
      const dose =
        form.doseAtual.trim();

      return dose.length >= 1;
    }

    case 7: {
      return (
        form.frequencia.trim().length > 0
      );
    }

    case 8: {
      return (
        form.objetivo.trim().length > 0
      );
    }

    case 9: {
      return (
        form.dificuldades.length > 0
      );
    }

    default:
      return false;
  }
}

 function avancar() {
  const erro =
    obterErroEtapa();

  if (erro) {
    Alert.alert(
      "Confira suas respostas",
      erro,
    );

    return;
  }

  if (etapa < TOTAL_ETAPAS) {
    setEtapa(
      (etapaAtual) =>
        etapaAtual + 1,
    );

    return;
  }

  finalizarOnboarding();
}

  function voltar() {
    if (etapa <= 1) {
      return;
    }

    setEtapa((etapaAtual) => {
      return etapaAtual - 1;
    });
  }

 async function finalizarOnboarding() {
  if (
    imcAtual === null ||
    faixaPesoSaudavel === null ||
    form.situacaoMedicamento === null
  ) {
    Alert.alert(
      "Dados incompletos",
      "Não foi possível finalizar o cadastro.",
    );

    return;
  }

  try {
    const initialWeight =
      form.situacaoMedicamento ===
      "vai_comecar"
        ? converterNumero(
            form.pesoAtual,
          )
        : converterNumero(
            form.pesoInicial,
          );

    const currentWeight =
      converterNumero(
        form.pesoAtual,
      );

    const heightCm =
      converterNumero(
        form.alturaCm,
      );

    const targetWeight =
      Number(
        faixaPesoSaudavel
          .referencia
          .toFixed(2),
      );

    let treatmentStartDate:
      | string
      | null = null;

    if (
      form.situacaoMedicamento ===
        "ja_usa" &&
      form.dataInicioTratamento
    ) {
      const data =
        converterDataBrasileira(
          form.dataInicioTratamento,
        );

      if (data) {
        treatmentStartDate =
          `${data.getFullYear()}-${String(
            data.getMonth() + 1,
          ).padStart(
            2,
            "0",
          )}-${String(
            data.getDate(),
          ).padStart(
            2,
            "0",
          )}`;
      }
    }

    await saveTreatmentProfile({
      treatmentStatus:
        form.situacaoMedicamento,

      heightCm,

      initialWeight,

      currentWeight,

      treatmentStartDate,

      medication:
        form.medicamento,

      currentDose:
        form.doseAtual,

      frequency:
        form.frequencia,

      goal:
        form.objetivo,

      difficulties:
        form.dificuldades,

      currentBmi:
        Number(
          imcAtual.toFixed(2),
        ),

      targetWeight,
    });

    router.replace(
      "/(tabs)/home",
    );
  } catch (error) {
    console.error(
      "Erro ao salvar onboarding:",
      error,
    );

    const mensagem =
      error instanceof Error
        ? error.message
        : "Não foi possível salvar seus dados.";

    Alert.alert(
      "Erro ao salvar",
      mensagem,
    );
  }
}

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.top}>
          <Text style={styles.brand}>
            EVOLUA MAIS
          </Text>

          <Text style={styles.stepText}>
            Etapa {etapa} de {TOTAL_ETAPAS}
          </Text>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                {
                  width: progresso,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.content}>
          {etapa === 1 && (
            <QuestionCard
              title="Você já iniciou seu tratamento?"
              description="Essa informação será usada para personalizar seu acompanhamento."
            >
              <OptionButton
                title="Vou começar agora"
                selected={
                  form.situacaoMedicamento ===
                  "vai_comecar"
                }
                onPress={() => {
                  atualizarCampo(
                    "situacaoMedicamento",
                    "vai_comecar",
                  );

                  atualizarCampo(
                    "pesoInicial",
                    "",
                  );

                  atualizarCampo(
                    "dataInicioTratamento",
                    "",
                  );
                }}
              />

              <OptionButton
                title="Já estou em tratamento"
                selected={
                  form.situacaoMedicamento ===
                  "ja_usa"
                }
                onPress={() =>
                  atualizarCampo(
                    "situacaoMedicamento",
                    "ja_usa",
                  )
                }
              />
            </QuestionCard>
          )}

          {etapa === 2 && (
            <QuestionCard
              title="Qual é a sua altura?"
              description="Sua altura será usada para calcular o seu IMC e estimar uma faixa de peso saudável."
            >
              <NumberInput
                value={form.alturaCm}
                onChangeText={(valor) =>
                  atualizarCampo(
                    "alturaCm",
                    valor,
                  )
                }
                placeholder="Exemplo: 175"
                unit="cm"
              />

              <Text style={styles.helperText}>
                Informe sua altura em centímetros.
              </Text>
            </QuestionCard>
          )}

          {etapa === 3 &&
            form.situacaoMedicamento ===
              "vai_comecar" && (
              <QuestionCard
                title="Qual é o seu peso atual?"
                description="Esse será o ponto inicial do seu acompanhamento."
              >
                <NumberInput
                  value={form.pesoAtual}
                  onChangeText={(valor) =>
                    atualizarCampo(
                      "pesoAtual",
                      valor,
                    )
                  }
                  placeholder="Exemplo: 98,5"
                  unit="kg"
                />
              </QuestionCard>
            )}

          {etapa === 3 &&
            form.situacaoMedicamento ===
              "ja_usa" && (
              <QuestionCard
                title="Conte sobre sua evolução"
                description="Informe seu peso no início, seu peso atual e quando o tratamento começou."
              >
                <Text style={styles.inputLabel}>
                  Peso quando iniciou
                </Text>

                <NumberInput
                  value={form.pesoInicial}
                  onChangeText={(valor) =>
                    atualizarCampo(
                      "pesoInicial",
                      valor,
                    )
                  }
                  placeholder="Exemplo: 105"
                  unit="kg"
                />

                <Text
                  style={[
                    styles.inputLabel,
                    styles.secondLabel,
                  ]}
                >
                  Peso atual
                </Text>

                <NumberInput
                  value={form.pesoAtual}
                  onChangeText={(valor) =>
                    atualizarCampo(
                      "pesoAtual",
                      valor,
                    )
                  }
                  placeholder="Exemplo: 98,5"
                  unit="kg"
                />

                <Text
                  style={[
                    styles.inputLabel,
                    styles.secondLabel,
                  ]}
                >
                  Data de início do tratamento
                </Text>

                <View
                  style={styles.dateInputContainer}
                >
                  <TextInput
                    value={
                      form.dataInicioTratamento
                    }
                    onChangeText={(valor) =>
                      atualizarCampo(
                        "dataInicioTratamento",
                        formatarData(valor),
                      )
                    }
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    maxLength={10}
                    style={styles.dateInput}
                  />
                </View>

                <Text style={styles.helperText}>
                  Exemplo: 10/06/2026
                </Text>
              </QuestionCard>
            )}

          {etapa === 4 && (
            <QuestionCard
              title="Seu resultado atual"
              description="Calculamos o IMC e uma faixa estimada de peso usando os dados informados."
            >
              <View style={styles.imcCard}>
                <Text style={styles.imcLabel}>
                  Índice de Massa Corporal
                </Text>

                <Text style={styles.imcValue}>
                  {imcAtual !== null
                    ? imcAtual.toFixed(1)
                    : "--"}
                </Text>

                <Text style={styles.imcCategory}>
                  {imcAtual !== null
                    ? classificarImc(imcAtual)
                    : "Não calculado"}
                </Text>

                {faixaPesoSaudavel && (
                  <View
                    style={
                      styles.healthyWeightBox
                    }
                  >
                    <Text
                      style={
                        styles.healthyWeightTitle
                      }
                    >
                      Faixa estimada de peso saudável
                    </Text>

                    <Text
                      style={
                        styles.healthyWeightRange
                      }
                    >
                      {faixaPesoSaudavel.minimo.toFixed(
                        1,
                      )}
                      {" kg a "}
                      {faixaPesoSaudavel.maximo.toFixed(
                        1,
                      )}
                      {" kg"}
                    </Text>

                    <Text
                      style={
                        styles.referenceWeight
                      }
                    >
                      Peso de referência:{" "}
                      {faixaPesoSaudavel.referencia.toFixed(
                        1,
                      )}
                      {" kg"}
                    </Text>
                  </View>
                )}

                {resultadoEmagrecimento && (
                  <View
                    style={
                      styles.progressResultCard
                    }
                  >
                    <Text
                      style={
                        styles.progressResultTitle
                      }
                    >
                      Sua evolução até agora
                    </Text>

                    <ResultRow
                      label="Peso eliminado"
                      value={`${resultadoEmagrecimento.quilosPerdidos.toFixed(
                        1,
                      )} kg`}
                    />

                    <ResultRow
                      label="Percentual eliminado"
                      value={`${resultadoEmagrecimento.percentualPerdido.toFixed(
                        1,
                      )}%`}
                    />

                    <ResultRow
                      label="Tempo de acompanhamento"
                      value={`${resultadoEmagrecimento.semanas.toFixed(
                        1,
                      )} semanas`}
                    />

                    <ResultRow
                      label="Média semanal"
                      value={`${resultadoEmagrecimento.quilosPorSemana.toFixed(
                        2,
                      )} kg/semana`}
                    />

                    <ResultRow
                      label="Média percentual"
                      value={`${resultadoEmagrecimento.percentualPorSemana.toFixed(
                        2,
                      )}%/semana`}
                    />

                    <View
                      style={
                        styles.rateClassification
                      }
                    >
                      <Text
                        style={
                          styles.rateClassificationLabel
                        }
                      >
                        Ritmo observado
                      </Text>

                      <Text
                        style={
                          styles.rateClassificationValue
                        }
                      >
                        {
                          resultadoEmagrecimento.classificacao
                        }
                      </Text>
                    </View>
                  </View>
                )}

                <Text style={styles.imcNotice}>
                  O IMC, a faixa de peso e a taxa de
                  evolução são estimativas de
                  acompanhamento. Eles não substituem
                  avaliação ou meta definida por um
                  profissional de saúde.
                </Text>
              </View>
            </QuestionCard>
          )}

          {etapa === 5 && (
            <QuestionCard
              title="Qual medicamento foi prescrito?"
              description="Selecione o medicamento indicado pelo seu profissional de saúde."
            >
              {medicamentos.map(
                (medicamento) => (
                  <OptionButton
                    key={medicamento}
                    title={medicamento}
                    selected={
                      form.medicamento ===
                      medicamento
                    }
                    onPress={() =>
                      atualizarCampo(
                        "medicamento",
                        medicamento,
                      )
                    }
                  />
                ),
              )}
            </QuestionCard>
          )}

          {etapa === 6 && (
            <QuestionCard
              title={
                form.situacaoMedicamento ===
                "vai_comecar"
                  ? "Qual dose foi prescrita?"
                  : "Qual é a sua dose atual?"
              }
              description="Digite exatamente a dose informada pelo seu profissional de saúde."
            >
              <View
                style={styles.doseInputContainer}
              >
                <TextInput
                  value={form.doseAtual}
                  onChangeText={(valor) =>
                    atualizarCampo(
                      "doseAtual",
                      valor,
                    )
                  }
                  placeholder="Exemplo: 2,5 mg"
                  placeholderTextColor="#94A3B8"
                  style={styles.doseInput}
                  autoCapitalize="none"
                />
              </View>

              <Text style={styles.medicalNotice}>
                O Evolua Mais registra a dose
                informada, mas não define nem
                recomenda alterações no tratamento.
              </Text>
            </QuestionCard>
          )}

          {etapa === 7 && (
            <QuestionCard
              title="Com que frequência você utiliza?"
              description="Selecione a frequência indicada para seu tratamento."
            >
              {frequencias.map((frequencia) => (
                <OptionButton
                  key={frequencia}
                  title={frequencia}
                  selected={
                    form.frequencia === frequencia
                  }
                  onPress={() =>
                    atualizarCampo(
                      "frequencia",
                      frequencia,
                    )
                  }
                />
              ))}
            </QuestionCard>
          )}

          {etapa === 8 && (
            <QuestionCard
              title="Qual é o seu principal objetivo?"
              description="Sua resposta ajudará a personalizar os recursos do aplicativo."
            >
              {objetivos.map((objetivo) => (
                <OptionButton
                  key={objetivo}
                  title={objetivo}
                  selected={
                    form.objetivo === objetivo
                  }
                  onPress={() =>
                    atualizarCampo(
                      "objetivo",
                      objetivo,
                    )
                  }
                />
              ))}
            </QuestionCard>
          )}

          {etapa === 9 && (
            <QuestionCard
              title="Quais são suas maiores dificuldades?"
              description="Você pode selecionar mais de uma opção."
            >
              {opcoesDificuldades.map(
                (dificuldade) => (
                  <OptionButton
                    key={dificuldade}
                    title={dificuldade}
                    selected={form.dificuldades.includes(
                      dificuldade,
                    )}
                    onPress={() =>
                      alternarDificuldade(
                        dificuldade,
                      )
                    }
                    multiple
                  />
                ),
              )}
            </QuestionCard>
          )}
        </View>

        <View style={styles.footer}>
          {etapa > 1 && (
            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed &&
                  styles.pressedButton,
              ]}
              onPress={voltar}
            >
              <Text
                style={styles.backButtonText}
              >
                Voltar
              </Text>
            </Pressable>
          )}

          <Pressable
            disabled={!validarEtapa()}
            style={({ pressed }) => [
              styles.nextButton,
              etapa === 1 &&
                styles.fullButton,
              !validarEtapa() &&
                styles.disabledButton,
              pressed &&
                validarEtapa() &&
                styles.pressedButton,
            ]}
            onPress={avancar}
          >
            <Text
              style={styles.nextButtonText}
            >
              {etapa === TOTAL_ETAPAS
                ? "Finalizar"
                : "Continuar"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function converterNumero(valor: string) {
  return Number(
    valor.trim().replace(",", "."),
  );
}

function calcularImc(
  peso: string,
  alturaCm: string,
) {
  const pesoNumero =
    converterNumero(peso);

  const alturaMetros =
    converterNumero(alturaCm) / 100;

  if (
    !Number.isFinite(pesoNumero) ||
    !Number.isFinite(alturaMetros) ||
    pesoNumero <= 0 ||
    alturaMetros <= 0
  ) {
    return null;
  }

  return (
    pesoNumero /
    (alturaMetros * alturaMetros)
  );
}

function classificarImc(imc: number) {
  if (imc < 18.5) {
    return "Abaixo da faixa saudável";
  }

  if (imc < 25) {
    return "Faixa saudável";
  }

  if (imc < 30) {
    return "Sobrepeso";
  }

  if (imc < 35) {
    return "Obesidade classe 1";
  }

  if (imc < 40) {
    return "Obesidade classe 2";
  }

  return "Obesidade classe 3";
}

function calcularFaixaPesoSaudavel(
  alturaCm: string,
): FaixaPesoSaudavel | null {
  const alturaMetros =
    converterNumero(alturaCm) / 100;

  if (
    !Number.isFinite(alturaMetros) ||
    alturaMetros <= 0
  ) {
    return null;
  }

  const alturaAoQuadrado =
    alturaMetros * alturaMetros;

  return {
    minimo: 18.5 * alturaAoQuadrado,
    referencia: 22 * alturaAoQuadrado,
    maximo: 24.9 * alturaAoQuadrado,
  };
}

function formatarData(valor: string) {
  const numeros = valor.replace(/\D/g, "");

  const limitado = numeros.slice(0, 8);

  if (limitado.length <= 2) {
    return limitado;
  }

  if (limitado.length <= 4) {
    return `${limitado.slice(
      0,
      2,
    )}/${limitado.slice(2)}`;
  }

  return `${limitado.slice(
    0,
    2,
  )}/${limitado.slice(
    2,
    4,
  )}/${limitado.slice(4)}`;
}

function converterDataBrasileira(
  dataTexto: string,
) {
  const partes = dataTexto.split("/");

  if (partes.length !== 3) {
    return null;
  }

  const dia = Number(partes[0]);
  const mes = Number(partes[1]);
  const ano = Number(partes[2]);

  if (
    !Number.isInteger(dia) ||
    !Number.isInteger(mes) ||
    !Number.isInteger(ano)
  ) {
    return null;
  }

  const data = new Date(
    ano,
    mes - 1,
    dia,
    12,
    0,
    0,
  );

  if (
    data.getFullYear() !== ano ||
    data.getMonth() !== mes - 1 ||
    data.getDate() !== dia
  ) {
    return null;
  }

  return data;
}

function validarDataBrasileira(
  dataTexto: string,
) {
  const data =
    converterDataBrasileira(dataTexto);

  if (!data) {
    return false;
  }

  const agora = new Date();

  const anoAtual =
    agora.getFullYear();

  const anoData =
    data.getFullYear();

  if (
    anoData < 2000 ||
    anoData > anoAtual
  ) {
    return false;
  }

  return (
    data.getTime() <=
    agora.getTime()
  );
}

function calcularTaxaEmagrecimento(
  pesoInicialTexto: string,
  pesoAtualTexto: string,
  dataInicioTexto: string,
): ResultadoEmagrecimento | null {
  const pesoInicial =
    converterNumero(pesoInicialTexto);

  const pesoAtual =
    converterNumero(pesoAtualTexto);

  const dataInicio =
    converterDataBrasileira(
      dataInicioTexto,
    );

  if (
    !Number.isFinite(pesoInicial) ||
    !Number.isFinite(pesoAtual) ||
    pesoInicial <= 0 ||
    pesoAtual <= 0 ||
    !dataInicio
  ) {
    return null;
  }

  const agora = new Date();

  const diferencaMilissegundos =
    agora.getTime() -
    dataInicio.getTime();

  const semanas =
    diferencaMilissegundos /
    (1000 * 60 * 60 * 24 * 7);

  if (semanas <= 0) {
    return null;
  }

  const quilosPerdidos =
    pesoInicial - pesoAtual;

  const percentualPerdido =
    (quilosPerdidos / pesoInicial) * 100;

  const quilosPorSemana =
    quilosPerdidos / semanas;

  const percentualPorSemana =
    percentualPerdido / semanas;

  return {
    quilosPerdidos,
    percentualPerdido,
    semanas,
    quilosPorSemana,
    percentualPorSemana,
    classificacao:
      classificarTaxaSemanal(
        quilosPorSemana,
      ),
  };
}

function classificarTaxaSemanal(
  quilosPorSemana: number,
) {
  if (quilosPorSemana < 0) {
    return "Houve aumento de peso";
  }

  if (quilosPorSemana < 0.2) {
    return "Ritmo leve";
  }

  if (quilosPorSemana <= 0.9) {
    return "Ritmo gradual";
  }

  return "Ritmo acelerado";
}

type QuestionCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

function QuestionCard({
  title,
  description,
  children,
}: QuestionCardProps) {
  return (
    <View>
      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.description}>
        {description}
      </Text>

      <View style={styles.options}>
        {children}
      </View>
    </View>
  );
}

type OptionButtonProps = {
  title: string;
  selected: boolean;
  onPress: () => void;
  multiple?: boolean;
};

function OptionButton({
  title,
  selected,
  onPress,
  multiple = false,
}: OptionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        selected &&
          styles.optionSelected,
        pressed &&
          styles.optionPressed,
      ]}
    >
      <View
        style={[
          multiple
            ? styles.checkbox
            : styles.radio,

          selected &&
            (multiple
              ? styles.checkboxSelected
              : styles.radioSelected),
        ]}
      >
        {selected && (
          <View
            style={
              multiple
                ? styles.checkmarkContainer
                : styles.radioCenter
            }
          >
            {multiple && (
              <Text
                style={styles.checkmark}
              >
                ✓
              </Text>
            )}
          </View>
        )}
      </View>

      <Text
        style={[
          styles.optionText,
          selected &&
            styles.optionTextSelected,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

type NumberInputProps = {
  value: string;
  onChangeText: (
    value: string,
  ) => void;
  placeholder: string;
  unit: string;
};

function NumberInput({
  value,
  onChangeText,
  placeholder,
  unit,
}: NumberInputProps) {
  return (
    <View style={styles.numberContainer}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType="decimal-pad"
        style={styles.numberInput}
      />

      <Text style={styles.numberUnit}>
        {unit}
      </Text>
    </View>
  );
}

type ResultRowProps = {
  label: string;
  value: string;
};

function ResultRow({
  label,
  value,
}: ResultRowProps) {
  return (
    <View style={styles.progressRow}>
      <Text style={styles.progressLabel}>
        {label}
      </Text>

      <Text style={styles.progressValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 32,
  },

  top: {
    marginBottom: 38,
  },

  brand: {
    color: "#208AEF",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 24,
  },

  stepText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 10,
  },

  progressTrack: {
    width: "100%",
    height: 7,
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#208AEF",
  },

  content: {
    flex: 1,
  },

  title: {
    color: "#0F172A",
    fontSize: 28,
    lineHeight: 35,
    fontWeight: "800",
  },

  description: {
    color: "#64748B",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },

  options: {
    marginTop: 28,
    gap: 12,
  },

  option: {
    minHeight: 64,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },

  optionSelected: {
    borderColor: "#208AEF",
    backgroundColor: "#EFF8FF",
  },

  optionPressed: {
    opacity: 0.8,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  radioSelected: {
    borderColor: "#208AEF",
  },

  radioCenter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#208AEF",
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  checkboxSelected: {
    borderColor: "#208AEF",
    backgroundColor: "#208AEF",
  },

  checkmarkContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  optionText: {
    flex: 1,
    color: "#334155",
    fontSize: 16,
    fontWeight: "600",
  },

  optionTextSelected: {
    color: "#0F4C81",
  },

  inputLabel: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  secondLabel: {
    marginTop: 16,
  },

  numberContainer: {
    height: 62,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  numberInput: {
    flex: 1,
    color: "#0F172A",
    fontSize: 18,
  },

  numberUnit: {
    color: "#64748B",
    fontSize: 16,
    fontWeight: "700",
  },

  dateInputContainer: {
    height: 62,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    justifyContent: "center",
  },

  dateInput: {
    color: "#0F172A",
    fontSize: 17,
  },

  helperText: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },

  doseInputContainer: {
    height: 62,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    justifyContent: "center",
  },

  doseInput: {
    color: "#0F172A",
    fontSize: 17,
  },

  medicalNotice: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },

  imcCard: {
    borderRadius: 20,
    backgroundColor: "#EFF8FF",
    borderWidth: 1.5,
    borderColor: "#BAE6FD",
    padding: 20,
    alignItems: "center",
  },

  imcLabel: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },

  imcValue: {
    color: "#208AEF",
    fontSize: 52,
    fontWeight: "800",
    marginTop: 12,
  },

  imcCategory: {
    color: "#334155",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 20,
  },

  healthyWeightBox: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 18,
    marginBottom: 16,
  },

  healthyWeightTitle: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  healthyWeightRange: {
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8,
  },

  referenceWeight: {
    color: "#208AEF",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },

  progressResultCard: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 18,
    marginBottom: 16,
  },

  progressResultTitle: {
    color: "#0F172A",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 14,
  },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  progressLabel: {
    flex: 1,
    color: "#64748B",
    fontSize: 13,
  },

  progressValue: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
  },

  rateClassification: {
    marginTop: 14,
    borderRadius: 12,
    backgroundColor: "#EFF8FF",
    padding: 14,
  },

  rateClassificationLabel: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
  },

  rateClassificationValue: {
    color: "#208AEF",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4,
  },

  imcNotice: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },

  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 36,
  },

  backButton: {
    height: 56,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  backButtonText: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "700",
  },

  nextButton: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#208AEF",
    justifyContent: "center",
    alignItems: "center",
  },

  fullButton: {
    width: "100%",
  },

  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  disabledButton: {
    backgroundColor: "#CBD5E1",
  },

  pressedButton: {
    opacity: 0.82,
  },
});