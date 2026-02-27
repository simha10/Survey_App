import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import api from "../api/axiosConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { saveMasterData, saveAssignments } from "../utils/storage";
import { fetchAllMasterData } from "../services/masterDataService";
import { fetchSurveyorAssignments } from "../services/surveyService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useNavigation, NavigationProp } from "@react-navigation/native";

const roles = ["SUPERADMIN", "ADMIN", "SUPERVISOR", "SURVEYOR"];

const LoginScreen = ({ navigation }: any) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "", role: "" });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const [showPassword, setShowPassword] = useState(false);
  const navigationProp = useNavigation<NavigationProp<any>>();

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    // Prefill credentials from SecureStore
    (async () => {
      try {
        const cachedUsername = await SecureStore.getItemAsync("cachedUsername");
        const cachedPassword = await SecureStore.getItemAsync("cachedPassword");
        const cachedRole = await SecureStore.getItemAsync("cachedRole");
        setForm((prev) => ({
          ...prev,
          username: typeof cachedUsername === "string" ? cachedUsername : "",
          password: typeof cachedPassword === "string" ? cachedPassword : "",
          role: typeof cachedRole === "string" ? cachedRole : "",
        }));
      } catch (e) {
        console.error("Error retrieving credentials from SecureStore:", e);
        setForm((prev) => ({ ...prev, username: "", password: "", role: "" }));
      }
    })();
  }, [animatedValue]);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: undefined });
  };

  const validate = () => {
    const errs: any = {};
    if (!form.username || form.username.length < 3)
      errs.username = "Username required";
    if (!form.password || form.password.length < 8)
      errs.password = "Password min 8 chars";
    if (!form.role) errs.role = "Role required";
    return errs;
  };

  const handleLogin = async () => {
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        username: form.username,
        password: form.password,
        role: form.role,
      });
      const { token, user } = res.data;
      // Check if selected role matches backend user role
      if (
        form.role &&
        user.role &&
        form.role.toUpperCase() !== user.role.toUpperCase()
      ) {
        Toast.show({
          type: "error",
          text1: "Role Mismatch",
          text2: `You selected "${form.role}", but your account role is "${user.role}". Please select the correct role to continue.`,
        });
        setForm((prev) => ({
          ...prev,
          role: user.role,
        }));
        setLoading(false);
        return;
      }
      await AsyncStorage.setItem("userToken", token);
      const masterData = await fetchAllMasterData(token);
      await saveMasterData(masterData);

      if (user.role === "SURVEYOR") {
        const assignments = await fetchSurveyorAssignments();
        await saveAssignments(assignments);
      }

      // Cache credentials securely
      await SecureStore.setItemAsync("cachedUsername", form.username);
      await SecureStore.setItemAsync("cachedPassword", form.password);
      await SecureStore.setItemAsync("cachedRole", form.role);

      await login(user.role, token, user);
      Toast.show({ type: "success", text1: "Login successful" });
      setTimeout(() => {
        navigationProp.reset({
          index: 0,
          routes: [{ name: "AuthenticatedDrawer" }],
        });
      }, 1000);
    } catch (err: any) {
      console.error("Login error:", err, err?.response, err?.message);
      Toast.show({
        type: "error",
        text1: err.response?.data?.error || err.message || "Network error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{
        flex: 1,
        backgroundColor: theme === "dark" ? "#111827" : "#fff",
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 400,
            backgroundColor: theme === "dark" ? "#1e293b" : "#fff",
            borderRadius: 20,
            padding: 28,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 8,
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Image
            source={require("../../assets/logo.png")}
            style={{
              width: 72,
              height: 72,
              marginBottom: 12,
              resizeMode: "contain",
            }}
          />
          <Text
            style={{
              marginBottom: 20,
              fontSize: 22,
              fontWeight: "bold",
              color: theme === "dark" ? "#e5e7eb" : "#111827",
              textAlign: "center",
            }}
          >
            Login into your account
          </Text>
          <View style={{ width: "100%" }}>
            <View
              style={{
                marginBottom: 8,
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme === "dark" ? "#475569" : "#d1d5db",
                backgroundColor: theme === "dark" ? "#0f172a" : "#fff",
                paddingHorizontal: 12,
              }}
            >
              <Feather
                name="at-sign"
                size={20}
                color={theme === "dark" ? "#e5e7eb" : "#6b7280"}
                style={{ marginLeft: 0 }}
              />
              <TextInput
                placeholder="Username"
                style={{
                  flex: 1,
                  padding: 12,
                  fontSize: 16,
                  fontWeight: "500",
                  color: theme === "dark" ? "#e5e7eb" : "#111827",
                }}
                placeholderTextColor={theme === "dark" ? "#6b7280" : "#9ca3af"}
                value={form.username}
                onChangeText={(v) => handleChange("username", v)}
                autoCapitalize="none"
              />
            </View>
            {errors.username && (
              <Text
                style={{
                  marginBottom: 8,
                  marginLeft: 12,
                  fontSize: 12,
                  fontWeight: "500",
                  color: "#f87171",
                }}
              >
                {errors.username}
              </Text>
            )}
            <View
              style={{
                marginBottom: 8,
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme === "dark" ? "#475569" : "#d1d5db",
                backgroundColor: theme === "dark" ? "#0f172a" : "#fff",
                paddingHorizontal: 12,
              }}
            >
              <Feather
                name="lock"
                size={20}
                color={theme === "dark" ? "#e5e7eb" : "#6b7280"}
                style={{ marginLeft: 0 }}
              />
              <TextInput
                placeholder="Password"
                style={{
                  flex: 1,
                  padding: 12,
                  fontSize: 16,
                  fontWeight: "500",
                  color: theme === "dark" ? "#e5e7eb" : "#111827",
                }}
                placeholderTextColor={theme === "dark" ? "#6b7280" : "#9ca3af"}
                value={form.password}
                onChangeText={(v) => handleChange("password", v)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={{ padding: 8, marginRight: 0 }}
              >
                <Feather
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color={theme === "dark" ? "#e5e7eb" : "#6b7280"}
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text
                style={{
                  marginBottom: 8,
                  marginLeft: 12,
                  fontSize: 12,
                  fontWeight: "500",
                  color: "#f87171",
                }}
              >
                {errors.password}
              </Text>
            )}
            <View
              style={{
                marginBottom: 8,
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme === "dark" ? "#475569" : "#d1d5db",
                backgroundColor: theme === "dark" ? "#0f172a" : "#fff",
                paddingHorizontal: 12,
              }}
            >
              <Feather
                name="users"
                size={20}
                color={theme === "dark" ? "#e5e7eb" : "#6b7280"}
                style={{ marginLeft: 0 }}
              />
              <Picker
                selectedValue={form.role}
                onValueChange={(v) => handleChange("role", v)}
                style={{
                  flex: 1,
                  padding: 12,
                  color: theme === "dark" ? "#e5e7eb" : "#111827",
                }}
              >
                <Picker.Item label="Select Role" value="" />
                {roles.map((r) => (
                  <Picker.Item key={r} label={r} value={r} />
                ))}
              </Picker>
            </View>
            {errors.role && (
              <Text
                style={{
                  marginBottom: 8,
                  marginLeft: 12,
                  fontSize: 12,
                  fontWeight: "500",
                  color: "#f87171",
                }}
              >
                {errors.role}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={{
              marginTop: 16,
              width: "100%",
              borderRadius: 12,
              padding: 16,
              backgroundColor: loading ? "#93c5fd" : "#2563eb",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                fontWeight: "600",
                letterSpacing: 0.5,
                color: "#fff",
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
          {loading && (
            <ActivityIndicator
              size="large"
              color={theme === "dark" ? "#e5e7eb" : "#2563eb"}
              style={{ marginTop: 16 }}
            />
          )}
        </View>
        <Toast />
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
