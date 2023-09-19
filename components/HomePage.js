import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useLanguage } from "./LanguageProvider";

const HomePage = ({ navigation }) => {
  const { language, translations } = useLanguage();
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../assets/icon.png")} />
      </View>

      <Text style={styles.heading}>{translations.chooseMode}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("DistancePage")}
        >
          <Text style={styles.buttonText}>
            {translations.distanceCalculator}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("FillUpPage")}
        >
          <Text style={styles.buttonText}>{translations.fillUpCalculator}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    marginBottom: 30,
    width: 300,
    height: 300,
    justifyContent: "center",
  },
  logoText: {
    textAlign: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttons: {
    width: "100%",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#a8bfad",
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomePage;
