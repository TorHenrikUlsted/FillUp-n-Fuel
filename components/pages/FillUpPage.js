import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, Text, TextInput, StyleSheet, Keyboard, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import storageService from "../../utils/StorageService";
import { useLanguage } from "../../utils/LanguageService";
import Gauge from "../molecules/gauge/Gauge";
import FuelPicker from "../atoms/picker/FuelPicker";
import BackButton from "../atoms/button/BackButton";
import CalculateButton from "../atoms/button/CalculateButton";
import FillUpModal from "../organisms/modal/FillUpModal";
import handleFuelUnit from "../atoms/handle/handleFuelUnit";
import { useDebouncedStorage } from "../atoms/handle/useDebouncedStorage";

const INPUT_PLACEHOLDER_COLOR = "#94a3b8";
const SWIPE_THRESHOLD = 80;
const MIN_VELOCITY = 200;

const FillUpPage = ({ navigation }) => {
  const { translations } = useLanguage();
  const insets = useSafeAreaInsets();
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

    // Parse and validate inputs
    const tankSizeNum = tankSize ? parseFloat(tankSize) : 0;
    const fuelPriceNum = fuelPrice ? parseFloat(fuelPrice) : 0;

    // Guard against NaN values
    const safeTankSize = isNaN(tankSizeNum) ? 0 : tankSizeNum;
    const safeFuelPrice = isNaN(fuelPriceNum) ? 0 : fuelPriceNum;

    // Convert the current fuel level from a fraction to a number
    const [numerator, _, denominator] = currentFuelLevel;
    let currentFuelLevelInLiters;
    if (denominator === 0) {
      currentFuelLevelInLiters = 0;
    } else {
      currentFuelLevelInLiters = (numerator / denominator) * safeTankSize;
    }

    const cost = (safeTankSize - currentFuelLevelInLiters) * safeFuelPrice;
    const litersNeeded = safeTankSize - currentFuelLevelInLiters;

    // Guard against NaN values in results
    const safeCost = isNaN(cost) || !isFinite(cost) ? 0 : cost;
    const safeLitersNeeded = isNaN(litersNeeded) || !isFinite(litersNeeded) ? 0 : litersNeeded;

    setCost(safeCost);
    setLitersNeeded(safeLitersNeeded);
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
        // Batch all storage calls together for better performance
        const [tankSize, fuelPrice, currentFuelLevel, fuelUnit, fuelMilage] = await Promise.all([
          storageService.getData("tankSize"),
          storageService.getData("fuelPrice"),
          storageService.getData("currentFuelLevel"),
          storageService.getData("fuelUnit"),
          storageService.getData("fuelMilage"),
        ]);

        setTankSize(tankSize || "");
        setFuelPrice(fuelPrice || "");
        setCurrentFuelLevel(currentFuelLevel || [1, "/", 2]);
        setFuelUnit(fuelUnit || "lpk");
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

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-20, 20])
        .failOffsetY([-15, 15])
        .onEnd((e) => {
          const { translationX, velocityX } = e;
          if (translationX < -SWIPE_THRESHOLD || velocityX < -MIN_VELOCITY) {
            navigation.goBack();
          }
        }),
    [navigation]
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  } else {
    return (
      <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { paddingTop: insets.top }]} >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 75}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: 90 + insets.bottom }]}>
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
                  placeholderTextColor={INPUT_PLACEHOLDER_COLOR}
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
                  placeholderTextColor={INPUT_PLACEHOLDER_COLOR}
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

          </ScrollView>
        </KeyboardAvoidingView>

        {!keyboardVisible && <BackButton />}

      </View>
      </GestureDetector>
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
    paddingTop: 16,
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
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  input: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1e293b",
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
    paddingHorizontal: 6,
    marginBottom: 20,
    minHeight: 88,
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

export default React.memo(FillUpPage);
