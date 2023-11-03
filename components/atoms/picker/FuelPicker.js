import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useLanguage } from "../../../utils/LanguageService";

const FuelPicker = ({ selectedValue, onValueChange }) => {
  const { translations } = useLanguage();

  return (
    <View style={styles.Container}>
      <View style={styles.inner}>
        <View style={{ flex: 0.5 }}>
          <Text style={styles.text}>{translations.fuelunit}</Text>
        </View>
        <View style={{ flex: 0.5 }}>
          <Picker
            style={styles.picker}
            selectedValue={selectedValue}
            onValueChange={onValueChange}
          >
            <Picker.Item label="L/100km" value="lpk" style={styles.itemStyle} />
            <Picker.Item
              label="M/Gallon"
              value="mpg"
              style={styles.itemStyle}
            />
          </Picker>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1 / 5,
    justifyContent: "center",
    backgroundColor: "#fafafa",
    borderColor: "#dedede",
    borderWidth: 1,
    borderRadius: 10,
  },
  inner: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  picker: {
    textAlign: "center",
    color: "black",
  },
  itemStyle: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default FuelPicker;
