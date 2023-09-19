import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLanguage } from "../../../utils/LanguageService";

const DistanceModal = ({
  visible,
  onClose,
  distanceUnit,
  costPerUnit,
  costOneWay,
  costBothWays,
  distance,
  refillMessage,
  distancePerTank,
}) => {
  const { translations } = useLanguage();

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View>
          <Text style={[styles.heading, { fontSize: 30 }]}>
            For{" "}
            <Text style={styles.cost}>
              {Number(distance).toFixed(2)}{" "}
              <Text style={{ color: "black" }}>
                {distanceUnit === "km" ? translations.kilometers : "Miles"}
              </Text>
            </Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.faintText, styles.heading]}>
            {translations.youCanTravel}
          </Text>
          {!isNaN(distancePerTank) && (
            <View>
              <Text style={[styles.sectionText, styles.cost]}>
                {" "}
                {distancePerTank.toFixed(2)}{" "}
                <Text style={{ color: "black" }}>
                  {distanceUnit === "km" ? translations.kilometers : "Miles"}
                </Text>
              </Text>
            </View>
          )}
          {isNaN(distancePerTank) && (
            <Text
              style={[
                styles.sectionText,
                {
                  color: translations.tankSizeRequiredForEstimate
                    ? "red"
                    : "black",
                },
              ]}
            >
              {translations.tankSizeRequiredForEstimate}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.faintText, styles.heading]}>
            {translations.itWillCost}
          </Text>
          <Text style={[styles.sectionText, styles.cost]}>
            {costPerUnit.toFixed(2)}{" "}
            <Text style={styles.costTxt}>
              per
              <Text style={{ color: "black" }}>
                {" "}
                {distanceUnit === "km" ? "kilometer" : "Mile"}
              </Text>
            </Text>
          </Text>
          <Text style={[styles.sectionText, styles.cost]}>
            {costOneWay.toFixed(2)}{" "}
            <Text style={styles.costTxt}>{translations.forOneWay}</Text>
          </Text>
          <Text style={[styles.sectionText, styles.cost]}>
            {costBothWays.toFixed(2)}{" "}
            <Text style={styles.costTxt}>{translations.forBothWays}</Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.faintText, styles.heading]}>
            {translations.refill}
          </Text>
          <Text
            style={[
              styles.sectionText,
              {
                color:
                  refillMessage === translations.tankSizeRequired
                    ? "red"
                    : "black",
              },
            ]}
          >
            {refillMessage}
          </Text>
        </View>
        <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
          <Text style={styles.modalCloseBtnText}>{translations.close}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    padding: 16,
    alignItems: "center",
  },
  faintText: {
    color: "#999",
    textAlign: "center",
  },
  section: {
    marginTop: 50,
  },
  sectionText: {
    fontSize: 20,
    textAlign: "center",
  },
  costTxt: {
    color: "black",
  },
  heading: {
    marginBottom: 8,
    fontSize: 23,
    textAlign: "center",
  },
  modalCloseBtn: {
    backgroundColor: "#a8bfad",
    paddingVertical: 20,
    paddingHorizontal: 100,
    borderRadius: 4,
    marginTop: 75,
  },
  modalCloseBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },

  cost: {
    color: "#859889",
  },
});

export default DistanceModal;
