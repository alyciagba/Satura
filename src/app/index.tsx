import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import { Fonts } from "@/constants/theme";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Decoração colorida */}
      <View style={styles.colorDecoration}>
        <View style={[styles.circle, styles.purple]} />
        <View style={[styles.circle, styles.pink]} />
        <View style={[styles.circle, styles.orange]} />
        <View style={[styles.circle, styles.green]} />
      </View>

      {/* Logo */}
      <View style={styles.header}>
        <Text style={styles.logo}>SATURA</Text>

        <Text style={styles.subtitle}>
          Encontre as cores que combinam com você.
        </Text>
      </View>

      {/* Formulário */}
      <View style={styles.form}>
        <Text style={styles.label}>E-mail</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#777"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#777"
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/home")}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.register}>
            Ainda não tem uma conta?{" "}
            <Text style={styles.registerHighlight}>Criar conta</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Decoração inferior */}
      <View style={styles.bottomDecoration}>
        <View style={[styles.line, styles.linePurple]} />
        <View style={[styles.line, styles.linePink]} />
        <View style={[styles.line, styles.lineOrange]} />
      </View>
    </View>
  );
}

const serifText = { fontFamily: Fonts.serif } as const;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEECDE",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  colorDecoration: {
    position: "absolute",
    top: 70,
    right: 35,
    flexDirection: "row",
    gap: 7,
  },

  circle: {
    width: 13,
    height: 13,
    borderRadius: 20,
  },

  purple: {
    backgroundColor: "#7B61FF",
  },

  pink: {
    backgroundColor: "#FF6B9A",
  },

  orange: {
    backgroundColor: "#FFB35C",
  },

  green: {
    backgroundColor: "#72D6B0",
  },

  header: {
    alignItems: "center",
    marginBottom: 45,
  },

  logo: {
    ...serifText,
    fontSize: 43,
    fontWeight: "700",
    letterSpacing: 6,
    color: "#16645F",
    fontFamily: Fonts.serif,
  },

  subtitle: {
    ...serifText,
    fontSize: 15,
    textAlign: "center",
    color: "#5F625C",
    marginTop: 12,
    maxWidth: 280,
    lineHeight: 22,
  },

  form: {
    width: "100%",
  },

  label: {
    ...serifText,
    fontSize: 14,
    fontWeight: "600",
    color: "#343832",
    marginBottom: 8,
  },

  input: {
    ...serifText,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingHorizontal: 17,
    paddingVertical: 16,
    fontSize: 15,
    marginBottom: 21,
    borderWidth: 1,
    borderColor: "#D8D5C7",
  },

  button: {
    backgroundColor: "#16645F",
    borderRadius: 15,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    ...serifText,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  register: {
    ...serifText,
    textAlign: "center",
    marginTop: 23,
    color: "#686A63",
    fontSize: 14,
  },

  registerHighlight: {
    ...serifText,
    color: "#16645F",
    fontWeight: "700",
  },

  bottomDecoration: {
    position: "absolute",
    bottom: 35,
    left: 30,
    flexDirection: "row",
    gap: 5,
  },

  line: {
    height: 5,
    borderRadius: 5,
  },

  linePurple: {
    width: 35,
    backgroundColor: "#7B61FF",
  },

  linePink: {
    width: 20,
    backgroundColor: "#FF6B9A",
  },

  lineOrange: {
    width: 12,
    backgroundColor: "#FFB35C",
  },
});
