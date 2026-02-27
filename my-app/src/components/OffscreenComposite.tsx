import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface OffscreenCompositeProps {
  visible?: boolean;
}

const OffscreenComposite: React.FC<OffscreenCompositeProps> = ({
  visible = false,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Offscreen Composite</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -1000,
    left: -1000,
    width: 1,
    height: 1,
    opacity: 0,
  },
  text: {
    fontSize: 0,
  },
});

export default OffscreenComposite;
