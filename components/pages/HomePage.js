import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useLanguage } from "../../utils/LanguageService";

const SWIPE_THRESHOLD = 80;
const MIN_VELOCITY = 200;

const HomePage = ({ navigation }) => {
  const { translations } = useLanguage();

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-20, 20])
        .activeOffsetY([-25, 25])
        .onEnd((e) => {
          const { translationX, translationY, velocityX, velocityY } = e;
          const isHorizontal = Math.abs(translationX) >= Math.abs(translationY);
          if (isHorizontal) {
            if (Math.abs(translationX) < SWIPE_THRESHOLD && Math.abs(velocityX) < MIN_VELOCITY) return;
if (translationX < -SWIPE_THRESHOLD || velocityX < -MIN_VELOCITY) {
            navigation.navigate("DistancePage");
          } else if (translationX > SWIPE_THRESHOLD || velocityX > MIN_VELOCITY) {
            navigation.navigate("FillUpPage");
          }
          } else {
            if (translationY < -SWIPE_THRESHOLD || velocityY < -MIN_VELOCITY) {
              navigation.navigate("InfoPage");
            }
          }
        }),
    [navigation]
  );

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../../assets/icon.png")} />
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

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("InfoPage")}
        >
          <Text style={styles.buttonText}>{translations.info}</Text>
        </TouchableOpacity>
      </View>
    </View>
    </GestureDetector>
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

export default React.memo(HomePage);
