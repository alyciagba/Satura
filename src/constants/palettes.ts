import AsyncStorage from "@react-native-async-storage/async-storage";

export type PaletteColor = {
  name: string;
  hex: string;
};

export type SavedPalette = {
  id: string;
  name: string;
  purpose: string;
  mood: string;
  tone: string;
  colors: PaletteColor[];
  savedAt: string;
};

export const SAVED_PALETTES_STORAGE_KEY = "satura:saved-palettes";

export async function loadSavedPalettes(): Promise<SavedPalette[]> {
  const storedPalettes = await AsyncStorage.getItem(SAVED_PALETTES_STORAGE_KEY);

  if (!storedPalettes) return [];

  try {
    const palettes: unknown = JSON.parse(storedPalettes);
    return Array.isArray(palettes) ? (palettes as SavedPalette[]) : [];
  } catch {
    return [];
  }
}

export async function saveSavedPalettes(
  palettes: SavedPalette[],
): Promise<void> {
  await AsyncStorage.setItem(
    SAVED_PALETTES_STORAGE_KEY,
    JSON.stringify(palettes),
  );
}

export async function removeSavedPalette(id: string): Promise<SavedPalette[]> {
  const palettes = await loadSavedPalettes();
  const remaining = palettes.filter((palette) => palette.id !== id);
  await saveSavedPalettes(remaining);
  return remaining;
}
