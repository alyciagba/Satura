import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { useState } from "react";

import { Fonts } from "@/constants/theme";

type PaletteOption = {
  title: string;
  description: string;
  icon: string;
};

const purposes: PaletteOption[] = [
  {
    title: "Projeto de design",
    description: "Para trabalhos, interfaces, apresentações...",
    icon: "✦",
  },
  {
    title: "Meu estilo pessoal",
    description: "Roupas, acessórios e identidade visual.",
    icon: "♡",
  },
  {
    title: "Arte e ilustração",
    description: "Para desenhos, pinturas e criações.",
    icon: "✎",
  },
  {
    title: "Decoração",
    description: "Para ambientes e espaços.",
    icon: "⌂",
  },
  {
    title: "Outro",
    description: "Quero usar as cores para outra finalidade.",
    icon: "✧",
  },
];

const moods: PaletteOption[] = [
  {
    title: "Calma e natural",
    description: "Tons leves, equilibrados e acolhedores.",
    icon: "☼",
  },
  {
    title: "Vibrante e criativa",
    description: "Cores expressivas para chamar atenção.",
    icon: "✦",
  },
  {
    title: "Elegante e sofisticada",
    description: "Uma combinação marcante e refinada.",
    icon: "◇",
  },
];

const tones: PaletteOption[] = [
  {
    title: "Tons claros",
    description: "Leves, suaves e iluminados.",
    icon: "☼",
  },
  {
    title: "Tons escuros",
    description: "Intensos, profundos e marcantes.",
    icon: "◐",
  },
];

export default function CriarPaletaScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<string | null>(null);

  const options = step === 1 ? purposes : step === 2 ? moods : tones;

  const selectedOption =
    step === 1 ? selectedPurpose : step === 2 ? selectedMood : selectedTone;

  function selectOption(title: string) {
    if (step === 1) {
      setSelectedPurpose(title);
    } else if (step === 2) {
      setSelectedMood(title);
    } else {
      setSelectedTone(title);
    }
  }

  function continueFlow() {
    if (!selectedOption) return;

    if (step === 3) {
      router.push({
        pathname: "/resultado_paleta",
        params: {
          purpose: selectedPurpose ?? "Outro",
          mood: selectedMood ?? "Calma e natural",
          tone: selectedTone ?? "Tons claros",
        },
      });
      return;
    }

    setStep((currentStep) => currentStep + 1);
  }

  function handleBack() {
    if (step === 1) {
      router.replace("/home");
      return;
    }

    setStep((currentStep) => currentStep - 1);
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          accessibilityLabel={
            step === 1 ? "Voltar para início" : "Pergunta anterior"
          }
        >
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.logo}>SATURA</Text>

        <Text style={styles.step}>{step}/4</Text>
      </View>

      {/* Barra de progresso */}
      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progress,
            {
              width: step === 1 ? "25%" : step === 2 ? "50%" : "75%",
            },
          ]}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.questionNumber}>
          {step === 1
            ? "VAMOS COMEÇAR"
            : step === 2
              ? "MAIS UM PASSO"
              : "QUASE LÁ"}
        </Text>

        <Text style={styles.title}>
          {step === 1
            ? "Para que você precisa"
            : step === 2
              ? "Qual sensação você quer transmitir?"
              : "Você prefere cores claras ou escuras?"}

          {"\n"}

          {step === 1 ? "da sua paleta?" : ""}
        </Text>

        <Text style={styles.subtitle}>
          {step === 1
            ? "Escolha o objetivo que mais combina com o que você está procurando."
            : step === 2
              ? "Escolha o clima que mais combina com o resultado que você imaginou."
              : "Escolha a tonalidade que mais combina com o resultado que você deseja."}
        </Text>

        {/* Opções */}

        {options.map((option) => (
          <TouchableOpacity
            key={option.title}
            style={[
              styles.option,
              selectedOption === option.title && styles.selectedOption,
            ]}
            onPress={() => selectOption(option.title)}
            accessibilityRole="radio"
            accessibilityState={{
              selected: selectedOption === option.title,
            }}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>{option.icon}</Text>
            </View>

            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>{option.title}</Text>

              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedOption && styles.disabledButton,
          ]}
          onPress={continueFlow}
          disabled={!selectedOption}
        >
          <Text style={styles.continueButtonText}>
            {step === 3 ? "Gerar minha paleta" : "Continuar"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const serifText = { fontFamily: Fonts.serif } as const;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEECDE",
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    ...serifText,
    fontSize: 38,
    color: "#16645F",
    lineHeight: 38,
  },

  logo: {
    ...serifText,
    fontSize: 23,
    fontWeight: "700",
    letterSpacing: 4,
    color: "#16645F",
    fontFamily: Fonts.serif,
  },

  step: {
    ...serifText,
    fontSize: 14,
    fontWeight: "600",
    color: "#77786F",
  },

  progressBackground: {
    height: 5,
    backgroundColor: "#D9D7C9",
    marginHorizontal: 25,
    marginTop: 25,
    borderRadius: 10,
  },

  progress: {
    height: 5,
    backgroundColor: "#16645F",
    borderRadius: 10,
  },

  content: {
    paddingHorizontal: 25,
    paddingTop: 45,
    paddingBottom: 40,
  },

  questionNumber: {
    ...serifText,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#FF6B9A",
    marginBottom: 12,
  },

  title: {
    ...serifText,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
    color: "#16645F",
    fontFamily: Fonts.serif,
    marginBottom: 15,
  },

  subtitle: {
    ...serifText,
    fontSize: 15,
    lineHeight: 22,
    color: "#666860",
    marginBottom: 30,
  },

  option: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  selectedOption: {
    borderWidth: 2,
    borderColor: "#16645F",
    padding: 14,
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EEECDE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  icon: {
    ...serifText,
    fontSize: 21,
    color: "#16645F",
  },

  optionText: {
    flex: 1,
  },

  optionTitle: {
    ...serifText,
    fontSize: 16,
    fontWeight: "700",
    color: "#343832",
    marginBottom: 4,
  },

  optionDescription: {
    ...serifText,
    fontSize: 12,
    lineHeight: 17,
    color: "#85867F",
  },

  continueButton: {
    backgroundColor: "#16645F",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },

  disabledButton: {
    backgroundColor: "#B8B9B0",
  },

  continueButtonText: {
    ...serifText,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  palettePreview: {
    height: 145,
    flexDirection: "row",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 12,
    marginBottom: 24,
  },

  paletteColor: {
    flex: 1,
  },

  paletteLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#343832",
  },

  paletteDescription: {
    fontSize: 14,
    color: "#85867F",
    marginTop: 6,
    marginBottom: 28,
  },
});
