import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import storageService from "../../utils/StorageService";
import { useLanguage } from "../../utils/LanguageService";
import Gauge from "../molecules/gauge/Gauge";
import Spacer from "../atoms/spacer/spacer";
import FuelPicker from "../atoms/picker/FuelPicker";
import BackButton from "../atoms/button/BackButton";
import CalculateButton from "../atoms/button/CalculateButton";
import FillUpModal from "../organisms/modal/FillUpModal";
import handleFuelUnit from "../atoms/handle/handleFuelUnit";
import { useDebouncedStorage } from "../atoms/handle/useDebouncedStorage";

const FillUpPage = () => {
  const { translations } = useLanguage();
  const [tankSize, setTankSize, saveTankSizeNow] = useDebouncedStorage("tankSize", "");
  const [fuelPrice, setFuelPrice, saveFuelPriceNow] = useDebouncedStorage("fuelPrice", "");
  const [currentFuelLevel, setCurrentFuelLevel, saveCurrentFuelLevelNow] = useDebouncedStorage("currentFuelLevel", [1, "/", 2]);
  const [cost, setCost] = useState(0);
  const prevCostRef = useRef(1);
  const [litersNeeded, setLitersNeeded] = useState(0);
  const prevLitersNeededRef = useRef(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fuelUnit, setFuelUnit] = useState('');
  const [fuelMilage, setFuelMilage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationDone, setCalculationDone] = useState(false);

  useEffect(() => {
    if (calculationDone) {
      if (cost !== prevCostRef.current || litersNeeded !== prevLitersNeededRef.current) {
        setIsModalVisible(true);
      }
  
      prevCostRef.current = cost;
      prevLitersNeededRef.current = litersNeeded;
    }
  }, [calculationDone, cost, litersNeeded]);



  const handleCalculate = async () => {
    setIsCalculating(true);
    // Wait for the updated values
    const [currentFuelLevel, tankSize, fuelPrice] = await Promise.all([
      saveCurrentFuelLevelNow(),
      saveTankSizeNow(),
      saveFuelPriceNow()
    ]);

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
    setCalculationDone(true);
  };

  useEffect(() => {
    if (calculationDone) {
      setIsCalculating(false);
      setIsModalVisible(true);
    }
  }, [calculationDone]);

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
                handleFuelUnit(fuelUnit, newFuelUnit, fuelMilage, tankSize, fuelPrice, setFuelMilage, setTankSize, setFuelPrice, setFuelUnit, setIsCalculating);
              }}
            ></FuelPicker>
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.inputLabel}>{translations.tankSize}</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.input}
                  value={tankSize ? tankSize.toString() : ""}
                  onChangeText={setTankSize}
                />
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.inputLabel}>{translations.fuelPrice}</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.input}
                  value={fuelPrice ? fuelPrice.toString() : ""}
                  onChangeText={setFuelPrice}
                  placeholder={translations.enterFuelPrice}
                />
              </View>
            </View>

            <View style={styles.gaugeContainer}>
              <Gauge
                size={300}
                strokeWidth={10}
                strokeColor="#000"
                onFuelLevelChange={setCurrentFuelLevel}
                setIsCalculating={setIsCalculating}
              />
            </View>

            {isCalculating ? (
              <View style={{ padding: 27 }}>
                <ActivityIndicator size="large" color="#a8bfad" />
              </View>
            ) : (
              <CalculateButton onPress={handleCalculate} />
            )}

            <Spacer h={10} w={10} />
            <BackButton />

            <FillUpModal
              isVisible={isModalVisible}
              cost={cost}
              litersNeeded={litersNeeded}
              fuelUnit={fuelUnit}
              onClose={() => {
                setIsModalVisible(false); 
                setCalculationDone(false);
              }}
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
