import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  loadSavedPalettes,
  removeSavedPalette,
  type SavedPalette,
} from "@/constants/palettes";
import { Fonts } from "@/constants/theme";
import { hexToRgb } from "@/utils/colors";

export default function PaletasSalvasScreen() {
  const router = useRouter();
  const [palettes, setPalettes] = useState<SavedPalette[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    void loadSavedPalettes().then(setPalettes);
  }, []);

  async function deletePalette(id: string) {
    const remaining = await removeSavedPalette(id);
    setPalettes(remaining);
  }

  function confirmDelete(palette: SavedPalette) {
    Alert.alert(
      "Excluir paleta?",
      `"${palette.name}" será removida das suas paletas salvas.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deletePalette(palette.id),
        },
      ],
    );
  }

  async function copyColor(hex: string) {
    await Clipboard.setStringAsync(hex);
    Alert.alert("Código copiado", hex);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Voltar"
        >
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.logo}>SATURA</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>SUA COLEÇÃO</Text>
        <Text style={styles.title}>Minhas paletas</Text>
        <Text style={styles.subtitle}>
          Todas as combinações que você criou e salvou.
        </Text>

        {palettes.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptySwatches}>
              <View
                style={[styles.emptySwatch, { backgroundColor: "#16645F" }]}
              />
              <View
                style={[styles.emptySwatch, { backgroundColor: "#FFB35C" }]}
              />
              <View
                style={[styles.emptySwatch, { backgroundColor: "#FF6B9A" }]}
              />
            </View>
            <Text style={styles.emptyTitle}>Sua coleção ainda está vazia</Text>
            <Text style={styles.emptyText}>
              Crie uma paleta e salve suas cores favoritas aqui.
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/criar_paleta")}
            >
              <Text style={styles.createButtonText}>Criar nova paleta</Text>
            </TouchableOpacity>
          </View>
        ) : (
          palettes.map((palette) => (
            <View key={palette.id} style={styles.paletteCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleArea}>
                  <Text style={styles.paletteName}>{palette.name}</Text>
                  <Text style={styles.paletteDate}>
                    {new Date(palette.savedAt).toLocaleDateString("pt-BR")}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => confirmDelete(palette)}
                  accessibilityLabel={`Excluir ${palette.name}`}
                >
                  <Text style={styles.deleteText}>Excluir</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.paletteColors}>
                {palette.colors.map((color) => (
                  <View
                    key={color.hex}
                    style={[
                      styles.paletteColor,
                      { backgroundColor: color.hex },
                    ]}
                  />
                ))}
              </View>

              <View style={styles.tagRow}>
                <Text style={styles.tag}>{palette.purpose}</Text>
                <Text style={styles.tag}>{palette.mood}</Text>
                <Text style={styles.tag}>{palette.tone}</Text>
              </View>

              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() =>
                  setExpandedId(expandedId === palette.id ? null : palette.id)
                }
              >
                <Text style={styles.detailsText}>
                  {expandedId === palette.id
                    ? "Ocultar detalhes"
                    : "Ver detalhes"}
                </Text>
              </TouchableOpacity>

              {expandedId === palette.id && (
                <View style={styles.detailsList}>
                  {palette.colors.map((color) => (
                    <View key={color.hex} style={styles.detailRow}>
                      <View
                        style={[
                          styles.detailSwatch,
                          { backgroundColor: color.hex },
                        ]}
                      />
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailName}>{color.name}</Text>
                        <Text style={styles.detailCode}>
                          {color.hex} | RGB {hexToRgb(color.hex)}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => copyColor(color.hex)}>
                        <Text style={styles.copyText}>Copiar</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
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
  headerSpacer: { width: 28 },
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
    marginBottom: 12,
  },
  subtitle: {
    ...serifText,
    fontSize: 15,
    lineHeight: 22,
    color: "#666860",
    marginBottom: 26,
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    marginTop: 10,
  },
  emptySwatches: { flexDirection: "row", gap: 8, marginBottom: 22 },
  emptySwatch: { width: 30, height: 30, borderRadius: 15 },
  emptyTitle: {
    ...serifText,
    fontSize: 19,
    fontWeight: "700",
    color: "#343832",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyText: {
    ...serifText,
    fontSize: 14,
    lineHeight: 20,
    color: "#77786F",
    textAlign: "center",
    marginBottom: 22,
  },
  createButton: {
    backgroundColor: "#16645F",
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 24,
  },
  createButtonText: {
    ...serifText,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  paletteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  cardTitleArea: { flex: 1 },
  paletteName: {
    ...serifText,
    fontSize: 18,
    fontWeight: "700",
    color: "#343832",
    marginBottom: 4,
  },
  paletteDate: { ...serifText, fontSize: 12, color: "#8A8B84" },
  deleteText: {
    ...serifText,
    fontSize: 12,
    fontWeight: "700",
    color: "#B34B5F",
  },
  paletteColors: {
    flexDirection: "row",
    height: 72,
    borderRadius: 13,
    overflow: "hidden",
    marginBottom: 14,
  },
  paletteColor: { flex: 1 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  tag: {
    ...serifText,
    backgroundColor: "#EEECDE",
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
    fontSize: 11,
    color: "#5F625C",
  },
  detailsButton: { paddingVertical: 8 },
  detailsText: {
    ...serifText,
    color: "#16645F",
    fontSize: 13,
    fontWeight: "700",
  },
  detailsList: {
    borderTopWidth: 1,
    borderTopColor: "#EEECDE",
    paddingTop: 10,
    gap: 8,
  },
  detailRow: { flexDirection: "row", alignItems: "center" },
  detailSwatch: { width: 30, height: 30, borderRadius: 8, marginRight: 9 },
  detailInfo: { flex: 1 },
  detailName: {
    ...serifText,
    fontSize: 12,
    fontWeight: "700",
    color: "#343832",
  },
  detailCode: { ...serifText, fontSize: 11, color: "#77786F", marginTop: 2 },
  copyText: { ...serifText, color: "#16645F", fontSize: 12, fontWeight: "700" },
});
