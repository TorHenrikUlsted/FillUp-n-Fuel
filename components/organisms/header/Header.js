import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LanguageSelector } from "../../../utils/LanguageService";

const CustomHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content"/>
      <LanguageSelector />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    height: 70,
    paddingHorizontal: 16,
    zIndex: 1,
  },
});

export default CustomHeader;
