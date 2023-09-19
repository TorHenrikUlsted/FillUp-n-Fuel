import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLanguage } from "../LanguageProvider";

const FillUpModal = ({ isVisible, cost, litersNeeded, fuelUnit, onClose }) => {
  const { language, translations } = useLanguage();

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={[styles.faintText, styles.heading]}>
            {translations.cost}
          </Text>
          <Text style={styles.costTxt}>{cost.toFixed(2)}</Text>
          <View style={{ height: 20 }} />

          <Text style={[styles.faintText, styles.heading]}>
            {translations.litersNeeded}
          </Text>
          <Text style={styles.costTxt}>
            {litersNeeded.toFixed(2)}{" "}
            {fuelUnit === "lpk" ? translations.liters : "Gallons"}
          </Text>
          <View style={{ height: 20 }} />

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={{ color: "white" }}>{translations.close}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 80,
    paddingVertical: 100,
    borderRadius: 4,
  },
  heading: {
    marginBottom: 8,
    fontSize: 25,
    textAlign: "center",
  },
  faintText: {
    color: "#999",
  },
  costTxt: {
    marginBottom: 8,
    fontSize: 20,
    textAlign: "center",
    color: "#859889",
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: "#a8bfad",
    color: "white",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
});

export default FillUpModal;
