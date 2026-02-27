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

const SurveyForm = ({ navigation }: any) => {
  const [propertyType, setPropertyType] = useState("");

  const propertyTypes = [
    { id: "residential", name: "Residential", icon: "home", color: "#4CAF50" },
    {
      id: "non-residential",
      name: "Non-Residential",
      icon: "business",
      color: "#2196F3",
    },
  ];

  const handleSelect = (type: string) => {
    setPropertyType(type);
    if (type === "residential") {
      navigation.navigate("ResidentialIntermediate");
    } else {
      navigation.navigate("NonResidentialIntermediate");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>New Survey</Text>
          <Text style={styles.subtitle}>Select Property Type</Text>
        </View>

        <View style={styles.typeContainer}>
          {propertyTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeCard,
                propertyType === type.id && styles.typeCardSelected,
              ]}
              onPress={() => handleSelect(type.id)}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: type.color }]}
              >
                <Ionicons name={type.icon as any} size={48} color="#fff" />
              </View>
              <Text style={styles.typeName}>{type.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a237e",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  typeCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeCardSelected: {
    borderWidth: 2,
    borderColor: "#1a237e",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  typeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});

export default SurveyForm;
