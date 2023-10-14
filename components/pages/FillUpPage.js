import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import storageService from "../../utils/StorageService";
import { useLanguage } from "../../utils/LanguageService";
import Gauge from "../molecules/gauge/Gauge";
import Spacer from "../atoms/spacer/spacer";
import FuelPicker from "../atoms/picker/FuelPicker";
import BackButton from "../atoms/button/BackButton";
import CalculateButton from "../atoms/button/CalculateButton";
import FillUpModal from "../organisms/modal/FillUpModal";

const FillUpPage = () => {
  const { translations } = useLanguage();
  const [tankSize, setTankSize] = useState(0);
  const [fuelPrice, setFuelPrice] = useState(0);
  const [currentFuelLevel, setCurrentFuelLevel] = useState([1, "/", 2]);
  const [cost, setCost] = useState(0);
  const [litersNeeded, setLitersNeeded] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fuelUnit, setFuelUnit] = useState('');
  const [fuelMilage, setFuelMilage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleTankSizeChange = (text) => {
    const value = parseFloat(text);
    setTankSize(value);
    storageService.saveData("tankSize", value);
  };

  const handleFuelPriceChange = (text) => {
    const value = parseFloat(text);
    if (isNaN(value)) {
      setFuelPrice("");
    } else {
      setFuelPrice(value);
      storageService.saveData("fuelPrice", value);
    }
  };

  const handleFuelUnitChange = (oldFuelUnit, newFuelUnit) => {
    if (oldFuelMilage === "") {
      setFuelMilage("0");
      storageService.saveData("fuelMilage", "0");
      return;
    }

    let oldFuelMilage = parseFloat(fuelMilage);
    let newFuelMilage = oldFuelMilage;
    let newTankSize = tankSize;
    let newFuelPrice = fuelPrice;

    if (oldFuelUnit === "lpk" && newFuelUnit === "mpg") {
      newFuelMilage = 235.215 / oldFuelMilage;
      newTankSize = tankSize * 0.264172;
      newFuelPrice = fuelPrice * 3.785411784;
      setFuelMilage(newFuelMilage);
      setTankSize(newTankSize);
      setFuelPrice(newFuelPrice);
    } else if (oldFuelUnit === "mpg" && newFuelUnit === "lpk") {
      newFuelMilage = 235.215 / oldFuelMilage;
      newTankSize = Math.round(tankSize * 3.785411784);
      newFuelPrice = fuelPrice / 3.785411784;
      setFuelMilage(newFuelMilage);
      setTankSize(newTankSize);
      setFuelPrice(newFuelPrice);
    }

    const numMilage = newFuelMilage ? newFuelMilage.toFixed(1) : "0";
    const numPrice = newFuelPrice ? newFuelPrice.toFixed(2) : "0";

    setFuelMilage(numMilage.toString());
    setTankSize(newTankSize.toString());
    setFuelUnit(newFuelUnit);
    setFuelPrice(numPrice);

    storageService.saveData("fuelUnit", newFuelUnit);
    storageService.saveData("fuelMilage", numMilage);
    storageService.saveData("tankSize", newTankSize);
    storageService.saveData("fuelPrice", numPrice);
  };

  const handleCalculate = () => {
    // Convert the current fuel level from a fraction to a number
    const [numerator, _, denominator] = currentFuelLevel;
    let currentFuelLevelInLiters;
    if (denominator === 0) {
      currentFuelLevelInLiters = 0;
    } else {
      currentFuelLevelInLiters = (numerator / denominator) * tankSize;
    }
    const cost = (tankSize - currentFuelLevelInLiters) * fuelPrice;

    setCost(cost);
    setLitersNeeded(tankSize - currentFuelLevelInLiters);
    setIsModalVisible(true);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const tankSize = await storageService.getData("tankSize");
        if (tankSize !== null) {
          setTankSize(tankSize);
        }
        const fuelPrice = await storageService.getData("fuelPrice");
        if (fuelPrice !== null) {
          setFuelPrice(fuelPrice);
        }
        const currentFuelLevel = await storageService.getData("currentFuelLevel");
        if (currentFuelLevel !== null) {
          setCurrentFuelLevel(currentFuelLevel);
        }
        const fuelUnit = await storageService.getData("fuelUnit");
        if (fuelUnit !== null) {
          setFuelUnit(fuelUnit);
        }
        const fuelMilage = await storageService.getData("fuelMilage");
        if (fuelMilage !== null) {
          setFuelMilage(fuelMilage);
        }
      } catch (error) {
        console.error("Error fetching storage data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  } else {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <FuelPicker
              selectedValue={fuelUnit}
              onValueChange={(newFuelUnit) => {
                handleFuelUnitChange(fuelUnit, newFuelUnit);
              }}
            ></FuelPicker>
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.inputLabel}>{translations.tankSize}</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.input}
                  value={tankSize ? tankSize.toString() : ""}
                  onChangeText={handleTankSizeChange}
                />
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.inputLabel}>{translations.fuelPrice}</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.input}
                  value={fuelPrice ? fuelPrice.toString() : ""}
                  onChangeText={handleFuelPriceChange}
                />
              </View>
            </View>

            <View style={styles.gaugeContainer}>
              <Gauge
                size={300}
                strokeWidth={10}
                strokeColor="#000"
                onFuelLevelChange={(fuelLevel) => {
                  setCurrentFuelLevel(fuelLevel);
                  storageService.saveData("currentFuelLevel", currentFuelLevel);
                }}
              />
            </View>

            <CalculateButton onPress={handleCalculate} />
            <Spacer h={10} w={10} />
            <BackButton />

            <FillUpModal
              isVisible={isModalVisible}
              cost={cost}
              litersNeeded={litersNeeded}
              fuelUnit={fuelUnit}
              onClose={() => setIsModalVisible(false)}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 16,
    flex: 1,
    justifyContent: "space-around",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 18,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    flex: 1,
    paddingHorizontal: 5,
    marginBottom: 16,
    height: 100,
  },
  gaugeContainer: {
    alignItems: "center",
    paddingBottom: 1,
  },
});

export default FillUpPage;
