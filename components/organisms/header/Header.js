import React from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { LanguageSelector } from "../../../utils/LanguageService";

const CustomHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent={true} />
      <View style={styles.headerContent}>
        <View style={styles.spacer} />
        <LanguageSelector />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingTop: 25,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    paddingHorizontal: 16,
  },
  spacer: {
    flex: 1,
  },
});

export default CustomHeader;
