import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  loadSavedPalettes,
  saveSavedPalettes,
  type PaletteColor,
  type SavedPalette,
} from "@/constants/palettes";
import { Fonts } from "@/constants/theme";
import { hexToRgb } from "@/utils/colors";

const paletteSets: Record<string, string[]> = {
  "Calma e natural|Tons claros": [
    "#16645F",
    "#72D6B0",
    "#EEECDE",
    "#B8D8BA",
    "#FFB35C",
  ],
  "Calma e natural|Tons escuros": [
    "#123C3A",
    "#2E6B62",
    "#5C8D79",
    "#B7795B",
    "#E5C59A",
  ],
  "Vibrante e criativa|Tons claros": [
    "#FF6B9A",
    "#FFB35C",
    "#FFE29A",
    "#72D6B0",
    "#7B61FF",
  ],
  "Vibrante e criativa|Tons escuros": [
    "#7B1E4A",
    "#C44569",
    "#D88A36",
    "#246A73",
    "#3D348B",
  ],
  "Elegante e sofisticada|Tons claros": [
    "#16645F",
    "#C6A15B",
    "#F4E9D8",
    "#8AA6A3",
    "#343832",
  ],
  "Elegante e sofisticada|Tons escuros": [
    "#172121",
    "#2F3E46",
    "#52796F",
    "#B08968",
    "#DDB892",
  ],
};

const colorNames = ["Principal", "Complementar", "Neutro", "Apoio", "Destaque"];

function getParam(value: string | string[] | undefined, fallback: string) {
  return Array.isArray(value) ? (value[0] ?? fallback) : (value ?? fallback);
}

function buildPalette(
  mood: string,
  tone: string,
  purpose: string,
): PaletteColor[] {
  const base =
    paletteSets[`${mood}|${tone}`] ??
    paletteSets["Calma e natural|Tons claros"];
  const offset = purpose.length % base.length;

  return base.map((hex, index) => ({
    name: colorNames[(index + offset) % colorNames.length],
    hex,
  }));
}

export default function ResultadoPaletaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    purpose?: string | string[];
    mood?: string | string[];
    tone?: string | string[];
  }>();
  const purpose = getParam(params.purpose, "Outro");
  const mood = getParam(params.mood, "Calma e natural");
  const tone = getParam(params.tone, "Tons claros");
  const palette = buildPalette(mood, tone, purpose);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [paletteName, setPaletteName] = useState("");

  async function copyColor(hex: string) {
    await Clipboard.setStringAsync(hex);
    setCopiedHex(hex);
  }

  async function savePalette() {
    const name = paletteName.trim();
    if (!name) return;

    const savedPalette: SavedPalette = {
      id: `${Date.now()}`,
      name,
      purpose,
      mood,
      tone,
      colors: palette,
      savedAt: new Date().toISOString(),
    };
    const savedPalettes = await loadSavedPalettes();

    await saveSavedPalettes([savedPalette, ...savedPalettes]);
    setSaved(true);
    setNameModalVisible(false);
    Alert.alert(
      "Paleta salva",
      `"${name}" foi salva na sua conta neste dispositivo.`,
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Voltar para editar"
        >
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.logo}>SATURA</Text>
        <Text style={styles.step}>RESULTADO</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>SUA PALETA ESTÁ PRONTA</Text>
        <Text style={styles.title}>Cores que combinam com você.</Text>
        <Text style={styles.subtitle}>
          Criada para {purpose.toLowerCase()}, com uma sensação{" "}
          {mood.toLowerCase()} e {tone.toLowerCase()}.
        </Text>

        <View style={styles.swatchPreview}>
          {palette.map((color) => (
            <View
              key={color.hex}
              style={[styles.previewColor, { backgroundColor: color.hex }]}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Cores da sua paleta</Text>
        <View style={styles.colorList}>
          {palette.map((color) => (
            <View key={color.hex} style={styles.colorRow}>
              <View
                style={[styles.colorSample, { backgroundColor: color.hex }]}
              />
              <View style={styles.colorInfo}>
                <Text style={styles.colorName}>{color.name}</Text>
                <Text style={styles.colorCode}>
                  {color.hex} | RGB {hexToRgb(color.hex)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => copyColor(color.hex)}
              >
                <Text style={styles.copyText}>
                  {copiedHex === color.hex ? "Copiado" : "Copiar"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => setNameModalVisible(true)}
          disabled={saved}
        >
          <Text style={styles.saveButtonText}>
            {saved ? "Paleta salva" : "Salvar na minha conta"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.back()}
        >
          <Text style={styles.editButtonText}>Editar minhas respostas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.homeButtonText}>Voltar para início</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={nameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Dê um nome à sua paleta</Text>
            <Text style={styles.modalDescription}>
              Salve um nome para encontrar esta combinação depois.
            </Text>
            <TextInput
              autoFocus
              value={paletteName}
              onChangeText={setPaletteName}
              placeholder="Ex.: Identidade da marca"
              placeholderTextColor="#8A8B84"
              style={styles.nameInput}
              maxLength={40}
              returnKeyType="done"
              onSubmitEditing={savePalette}
            />
            <TouchableOpacity
              style={[
                styles.saveButton,
                !paletteName.trim() && styles.disabledButton,
              ]}
              onPress={savePalette}
              disabled={!paletteName.trim()}
            >
              <Text style={styles.saveButtonText}>Salvar paleta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setNameModalVisible(false)}
            >
              <Text style={styles.editButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const serifText = { fontFamily: Fonts.serif } as const;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EEECDE" },
  header: {
    paddingTop: 55,
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: { ...serifText, fontSize: 38, color: "#16645F", lineHeight: 38 },
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
    fontSize: 11,
    fontWeight: "700",
    color: "#77786F",
    letterSpacing: 1,
  },
  content: { paddingHorizontal: 25, paddingTop: 45, paddingBottom: 45 },
  eyebrow: {
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
    marginBottom: 28,
  },
  swatchPreview: {
    height: 145,
    flexDirection: "row",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 30,
  },
  previewColor: { flex: 1 },
  sectionTitle: {
    ...serifText,
    fontSize: 21,
    fontWeight: "700",
    color: "#16645F",
    fontFamily: Fonts.serif,
    marginBottom: 14,
  },
  colorList: { gap: 10 },
  colorRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  colorSample: { width: 48, height: 48, borderRadius: 12, marginRight: 12 },
  colorInfo: { flex: 1 },
  colorName: {
    ...serifText,
    fontSize: 14,
    fontWeight: "700",
    color: "#343832",
    marginBottom: 4,
  },
  colorCode: { ...serifText, fontSize: 12, color: "#77786F" },
  copyButton: { paddingHorizontal: 10, paddingVertical: 8 },
  copyText: { ...serifText, fontSize: 12, fontWeight: "700", color: "#16645F" },
  saveButton: {
    backgroundColor: "#16645F",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 25,
  },
  saveButtonText: {
    ...serifText,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  disabledButton: { backgroundColor: "#B8B9B0" },
  editButton: { alignItems: "center", paddingVertical: 16 },
  editButtonText: {
    ...serifText,
    color: "#16645F",
    fontSize: 14,
    fontWeight: "700",
  },
  homeButton: {
    borderWidth: 1,
    borderColor: "#16645F",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
  },
  homeButtonText: {
    ...serifText,
    color: "#16645F",
    fontSize: 14,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(24, 42, 40, 0.45)",
    justifyContent: "center",
    padding: 25,
  },
  modalCard: { backgroundColor: "#FFFFFF", borderRadius: 22, padding: 24 },
  modalTitle: {
    ...serifText,
    fontSize: 22,
    fontWeight: "700",
    color: "#16645F",
    fontFamily: Fonts.serif,
    marginBottom: 8,
  },
  modalDescription: {
    ...serifText,
    fontSize: 14,
    lineHeight: 20,
    color: "#666860",
    marginBottom: 18,
  },
  nameInput: {
    ...serifText,
    backgroundColor: "#F5F4EC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D8D5C7",
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#343832",
    marginBottom: 14,
  },
  cancelButton: { alignItems: "center", paddingVertical: 15 },
});
