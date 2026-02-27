import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import FormInput from "../components/FormInput";
import FormDropdown from "../components/FormDropdown";
import { getMasters } from "../services/masterDataService";

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("surveyor");
  const [ulbId, setUlbId] = useState("");
  const [wardId, setWardId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ulbs, setUlbs] = useState<{ label: string; value: string }[]>([]);
  const [wards, setWards] = useState<{ label: string; value: string }[]>([]);
  const { register } = useAuth();

  const roleOptions = [
    { label: "Surveyor", value: "surveyor" },
    { label: "Supervisor", value: "supervisor" },
    { label: "Admin", value: "admin" },
  ];

  useEffect(() => {
    loadUlbs();
  }, []);

  useEffect(() => {
    if (ulbId) {
      loadWards(ulbId);
    }
  }, [ulbId]);

  const loadUlbs = async () => {
    try {
      const data = await getMasters("ulbs");
      setUlbs(data.map((ulb: any) => ({ label: ulb.name, value: ulb.id })));
    } catch (error) {
      console.error("Error loading ULBs:", error);
    }
  };

  const loadWards = async (ulbId: string) => {
    try {
      const data = await getMasters("wards", { ulbId });
      setWards(data.map((ward: any) => ({ label: ward.name, value: ward.id })));
    } catch (error) {
      console.error("Error loading wards:", error);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register({ name, email, password, role, ulbId, wardId });
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Register for PTMS</Text>
          </View>

          <View style={styles.form}>
            <FormInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              required
            />

            <FormInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              required
            />

            <FormInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              required
            />

            <FormInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              secureTextEntry={!showPassword}
              required
            />

            <FormDropdown
              label="Role"
              value={role}
              onValueChange={setRole}
              items={roleOptions}
              required
            />

            {(role === "supervisor" || role === "admin") && (
              <>
                <FormDropdown
                  label="ULB"
                  value={ulbId}
                  onValueChange={setUlbId}
                  items={ulbs}
                  placeholder="Select ULB"
                />

                <FormDropdown
                  label="Ward"
                  value={wardId}
                  onValueChange={setWardId}
                  items={wards}
                  placeholder="Select Ward"
                />
              </>
            )}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginText}>
                Already have an account?{" "}
                <Text style={styles.loginLink}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a237e",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  form: {
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1a237e",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButton: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    color: "#1a237e",
    fontWeight: "bold",
  },
});

export default RegisterScreen;
