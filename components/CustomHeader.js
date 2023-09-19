import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LanguageSelector } from "./LanguageProvider";

const CustomHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <LanguageSelector />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    height: 80,
    paddingHorizontal: 16,
    zIndex: 1,
  },
});

export default CustomHeader;
