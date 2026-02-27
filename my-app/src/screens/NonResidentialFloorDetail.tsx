import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import FormInput from "../components/FormInput";
import FormDropdown from "../components/FormDropdown";

const NonResidentialFloorDetail = ({ navigation, route }: any) => {
  const params = route.params || {};
  const [floorNumber, setFloorNumber] = useState("");
  const [builtUpArea, setBuiltUpArea] = useState("");
  const [yearOfConstruction, setYearOfConstruction] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [propertyTax, setPropertyTax] = useState("");

  const floorOptions = [
    { label: "Ground Floor", value: "ground" },
    { label: "Basement", value: "basement" },
    { label: "1st Floor", value: "1" },
    { label: "2nd Floor", value: "2" },
    { label: "3rd Floor & Above", value: "3+" },
  ];

  const handleSave = () => {
    if (!floorNumber || !builtUpArea) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    Alert.alert("Success", "Survey saved successfully", [
      {
        text: "OK",
        onPress: () => navigation.navigate("SurveyorDashboard"),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Floor Details - Non-Residential</Text>

        <FormDropdown
          label="Floor Number"
          value={floorNumber}
          onValueChange={setFloorNumber}
          items={floorOptions}
          placeholder="Select floor"
          required
        />

        <FormInput
          label="Built-up Area (sq ft)"
          value={builtUpArea}
          onChangeText={setBuiltUpArea}
          placeholder="Enter built-up area"
          keyboardType="numeric"
          required
        />

        <FormInput
          label="Year of Construction"
          value={yearOfConstruction}
          onChangeText={setYearOfConstruction}
          placeholder="Enter year of construction"
          keyboardType="numeric"
        />

        <FormInput
          label="Monthly Rent (₹)"
          value={monthlyRent}
          onChangeText={setMonthlyRent}
          placeholder="Enter monthly rent"
          keyboardType="numeric"
        />

        <FormInput
          label="Property Tax (₹)"
          value={propertyTax}
          onChangeText={setPropertyTax}
          placeholder="Enter property tax"
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Ionicons name="save" size={20} color="#fff" />
          <Text style={styles.buttonText}>Save Survey</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default NonResidentialFloorDetail;
