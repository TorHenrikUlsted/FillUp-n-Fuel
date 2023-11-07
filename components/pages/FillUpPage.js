import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Keyboard, ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import storageService from "../../utils/StorageService";
import { useLanguage } from "../../utils/LanguageService";
import Gauge from "../molecules/gauge/Gauge";
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
  const [fuelUnit, setFuelUnit, saveFuelUnitNow] = useDebouncedStorage("fuelUnit", "");
  const [fuelMilage, setFuelMilage, saveFuelMilageNow] = useDebouncedStorage("fuelMilage", "");
  const [cost, setCost] = useState("");
  const prevCostRef = useRef(1);
  const [litersNeeded, setLitersNeeded] = useState("");
  const prevLitersNeededRef = useRef(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationDone, setCalculationDone] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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
      saveFuelPriceNow(),
      saveFuelUnitNow(),
      saveFuelMilageNow(),
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

    setCost(cost || 0);
    setLitersNeeded(tankSize - currentFuelLevelInLiters || 0);
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
        setTankSize(tankSize || "");

        const fuelPrice = await storageService.getData("fuelPrice");
        setFuelPrice(fuelPrice || "");

        const currentFuelLevel = await storageService.getData("currentFuelLevel");
        setCurrentFuelLevel(currentFuelLevel || [1, "/", 2]);

        const fuelUnit = await storageService.getData("fuelUnit");
        setFuelUnit(fuelUnit || "lpk");

        const fuelMilage = await storageService.getData("fuelMilage");
        setFuelMilage(fuelMilage || "");

      } catch (error) {
        console.error("Error fetching storage data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  } else {
    return (
      <View style={styles.container} >
        <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
          <FillUpModal
            isVisible={isModalVisible}
            cost={cost || 0}
            litersNeeded={litersNeeded || 0}
            fuelUnit={fuelUnit || "lpk"}
            onClose={() => {
              setIsModalVisible(false); 
              setCalculationDone(false);
            }}
          />

          <View style={styles.fuelBox}>
            <FuelPicker
              selectedValue={fuelUnit}
              onValueChange={(newFuelUnit) => {
                  handleFuelUnit(fuelUnit, newFuelUnit, fuelMilage, tankSize, fuelPrice, setFuelMilage, setTankSize, setFuelPrice, setFuelUnit, setIsCalculating);
              }}
            >
            </FuelPicker>
          </View>

          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.inputLabel}>{translations.tankSize}</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                value={tankSize ? tankSize.toString() : ""}
                onChangeText={setTankSize}
                placeholder={translations.enterTankSize}
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

          <View style={styles.calcBox}>
            {isCalculating ? (
              <View style={{ padding: 27 }}>
                <ActivityIndicator size="large" color="#a8bfad" />
              </View>
            ) : (
              <CalculateButton onPress={handleCalculate} />
            )}
          </View>

        </KeyboardAwareScrollView>

        {!keyboardVisible && <BackButton />}

      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 90,
  },
  fuelBox: {
    flex: 1,
    paddingBottom: 40,
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
    fontSize: 14,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  gridItem: {
    flex: 1,
    paddingHorizontal: 5,
    marginBottom: 16,
    height: 100,
  },
  gaugeContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  calcBox: {
    flex: 1,
    paddingTop: 20,
  },
});

export default FillUpPage;
