import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Image as RNImage } from "react-native";

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <RNImage
          source={require("../../assets/logo.png")}
          style={{
            width: 120,
            height: 120,
            resizeMode: "contain",
          }}
        />
        <Text style={styles.title}>PTMS</Text>
        <Text style={styles.subtitle}>Property Tax Management System</Text>
        <Text style={styles.loading}>Loading...</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 8,
  },
  loading: {
    fontSize: 14,
    color: "#888",
    marginTop: 30,
  },
});

export default SplashScreen;
