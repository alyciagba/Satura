import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
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

export default function HomeScreen() {
  const router = useRouter();
  const [palettes, setPalettes] = useState<SavedPalette[]>([]);

  useFocusEffect(
    useCallback(() => {
      void loadSavedPalettes().then(setPalettes);
    }, []),
  );

  function confirmDelete(palette: SavedPalette) {
    Alert.alert(
      "Excluir paleta?",
      `"${palette.name}" será removida das suas paletas salvas.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const remaining = await removeSavedPalette(palette.id);
            setPalettes(remaining);
          },
        },
      ],
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>SATURA</Text>
          <Text style={styles.greeting}>Olá, Gabriela! ✨</Text>
        </View>

        <View style={styles.profileButton}>
          <Text style={styles.profileText}>G</Text>
        </View>
      </View>

      {/* Destaque principal */}
      <View style={styles.hero}>
        <View style={styles.colorCircles}>
          <View style={[styles.circle, styles.green]} />
          <View style={[styles.circle, styles.purple]} />
          <View style={[styles.circle, styles.orange]} />
          <View style={[styles.circle, styles.pink]} />
        </View>

        <Text style={styles.heroTitle}>Que cores combinam{"\n"}com você?</Text>

        <Text style={styles.heroText}>
          Crie uma paleta personalizada de acordo com seu estilo, objetivo e a
          sensação que deseja transmitir.
        </Text>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/criar_paleta")}
        >
          <Text style={styles.plus}>+</Text>
          <Text style={styles.createButtonText}>Criar nova paleta</Text>
        </TouchableOpacity>
      </View>

      {palettes.length > 0 && (
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Suas paletas</Text>

            <TouchableOpacity onPress={() => router.push("/paletas_salvas")}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {palettes.map((palette) => (
            <View key={palette.id} style={styles.paletteCard}>
              <View style={styles.paletteCardHeader}>
                <View>
                  <Text style={styles.paletteName}>{palette.name}</Text>
                  <Text style={styles.paletteDescription}>
                    Salva em{" "}
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
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const serifText = { fontFamily: Fonts.serif } as const;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEECDE",
  },

  content: {
    paddingHorizontal: 25,
    paddingTop: 55,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 35,
  },

  logo: {
    ...serifText,
    fontSize: 25,
    fontWeight: "700",
    letterSpacing: 4,
    color: "#16645F",
    fontFamily: Fonts.serif,
  },

  greeting: {
    ...serifText,
    marginTop: 8,
    fontSize: 15,
    color: "#5F625C",
  },

  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  profileText: {
    ...serifText,
    fontSize: 17,
    fontWeight: "700",
    color: "#16645F",
  },

  hero: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 28,
    marginBottom: 35,
  },

  colorCircles: {
    flexDirection: "row",
    gap: 7,
    marginBottom: 25,
  },

  circle: {
    width: 16,
    height: 16,
    borderRadius: 10,
  },

  green: {
    backgroundColor: "#16645F",
  },

  purple: {
    backgroundColor: "#7B61FF",
  },

  orange: {
    backgroundColor: "#FFB35C",
  },

  pink: {
    backgroundColor: "#FF6B9A",
  },

  heroTitle: {
    ...serifText,
    fontSize: 30,
    lineHeight: 35,
    fontWeight: "700",
    color: "#16645F",
    fontFamily: Fonts.serif,
    marginBottom: 14,
  },

  heroText: {
    ...serifText,
    fontSize: 15,
    lineHeight: 22,
    color: "#666860",
    marginBottom: 25,
  },

  createButton: {
    backgroundColor: "#16645F",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  plus: {
    ...serifText,
    color: "#FFFFFF",
    fontSize: 22,
    marginRight: 8,
    marginTop: -2,
  },

  createButtonText: {
    ...serifText,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionTitle: {
    ...serifText,
    fontSize: 22,
    fontWeight: "700",
    color: "#16645F",
    fontFamily: Fonts.serif,
  },

  seeAll: {
    ...serifText,
    fontSize: 14,
    fontWeight: "600",
    color: "#16645F",
  },

  paletteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
  },

  paletteCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  deleteText: {
    ...serifText,
    fontSize: 12,
    fontWeight: "700",
    color: "#B34B5F",
  },

  paletteColors: {
    flexDirection: "row",
    height: 65,
    borderRadius: 13,
    overflow: "hidden",
    marginBottom: 14,
  },

  paletteColor: {
    flex: 1,
  },

  paletteName: {
    ...serifText,
    fontSize: 16,
    fontWeight: "700",
    color: "#343832",
  },

  paletteDescription: {
    ...serifText,
    fontSize: 13,
    color: "#8A8B84",
    marginTop: 4,
  },
});
