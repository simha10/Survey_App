import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

type RootDrawerParamList = {
  SurveyorDashboard: undefined;
  SupervisorDashboard: undefined;
  AdminDashboard: undefined;
  SuperAdminDashboard: undefined;
  Profile: undefined;
  SurveyRecords: undefined;
  SurveyCount: undefined;
};

interface CustomHeaderProps {
  title: string;
  showBack?: boolean;
  rightIcon?: string;
  onRightPress?: () => void;
  showMenu?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBack = false,
  rightIcon,
  onRightPress,
  showMenu = false,
}) => {
  const navigation = useNavigation<NavigationProp<RootDrawerParamList>>();

  const handleMenuPress = () => {
    // Use type assertion for drawer navigation
    (navigation as any).openDrawer();
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        ) : showMenu ? (
          <TouchableOpacity onPress={handleMenuPress} style={styles.iconButton}>
            <Ionicons name="menu" size={24} color="#000" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.rightContainer}>
        {rightIcon ? (
          <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
            <Ionicons name={rightIcon as any} size={24} color="#000" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  leftContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  rightContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  title: {
    flex: 2,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  iconButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
});

export default CustomHeader;
