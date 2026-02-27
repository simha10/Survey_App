import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import FormInput from "../components/FormInput";
import FormDropdown from "../components/FormDropdown";

const ResidentialIntermediate = ({ navigation }: any) => {
  const [ownerName, setOwnerName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [constructionType, setConstructionType] = useState("");
  const [occupancyType, setOccupancyType] = useState("");

  const propertyTypeOptions = [
    { label: "Independent House", value: "independent_house" },
    { label: "Flat/Apartment", value: "flat" },
    { label: "Villa", value: "villa" },
  ];

  const constructionTypeOptions = [
    { label: "Pucca", value: "pucca" },
    { label: "Semi-Pucca", value: "semi_pucca" },
    { label: "Kuccha", value: "kuccha" },
  ];

  const occupancyTypeOptions = [
    { label: "Self-Occupied", value: "self_occupied" },
    { label: "Rented", value: "rented" },
    { label: "Vacant", value: "vacant" },
  ];

  const handleProceed = () => {
    navigation.navigate("ResidentialFloorDetail", {
      ownerName,
      propertyAddress,
      propertyType,
      constructionType,
      occupancyType,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Residential Property Details</Text>

        <FormInput
          label="Owner Name"
          value={ownerName}
          onChangeText={setOwnerName}
          placeholder="Enter owner name"
          required
        />

        <FormInput
          label="Property Address"
          value={propertyAddress}
          onChangeText={setPropertyAddress}
          placeholder="Enter property address"
          required
        />

        <FormDropdown
          label="Property Type"
          value={propertyType}
          onValueChange={setPropertyType}
          items={propertyTypeOptions}
          placeholder="Select property type"
          required
        />

        <FormDropdown
          label="Construction Type"
          value={constructionType}
          onValueChange={setConstructionType}
          items={constructionTypeOptions}
          placeholder="Select construction type"
          required
        />

        <FormDropdown
          label="Occupancy Type"
          value={occupancyType}
          onValueChange={setOccupancyType}
          items={occupancyTypeOptions}
          placeholder="Select occupancy type"
          required
        />

        <TouchableOpacity style={styles.button} onPress={handleProceed}>
          <Text style={styles.buttonText}>Proceed to Floor Details</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
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
    backgroundColor: "#1a237e",
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
    marginRight: 8,
  },
});

export default ResidentialIntermediate;
