import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Keyboard, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import DistanceModal from "../organisms/modal/DistanceModal";
import { useLanguage } from "../../utils/LanguageService";
import BackButton from "../atoms/button/BackButton";
import CalculateButton from "../atoms/button/CalculateButton";
import storageService from "../../utils/StorageService";
import FuelPicker from "../atoms/picker/FuelPicker";
import { useDebouncedStorage } from "../atoms/handle/useDebouncedStorage";
import handleFuelUnit from "../atoms/handle/handleFuelUnit";

const DistancePage = () => {
  const { language, translations } = useLanguage();
  const insets = useSafeAreaInsets();
  const [distanceUnit, setDistanceUnit, saveDistanceUnitNow] = useDebouncedStorage("distanceUnit", "");
  const [distance, setDistance, saveDistanceNow] = useDebouncedStorage("distanceNumber", "");
  const [tankSize, setTankSize, saveTankSizeNow] = useDebouncedStorage("tankSize", "");
  const [fuelPrice, setFuelPrice, saveFuelPriceNow] = useDebouncedStorage("fuelPrice", "");
  const [fuelUnit, setFuelUnit, saveFuelUnitNow] = useDebouncedStorage("fuelUnit", "");
  const [fuelMilage, setFuelMilage, saveFuelMilageNow] = useDebouncedStorage("fuelMilage", "");
  const [extra, setExtra, saveExtraNow] = useDebouncedStorage("DistanceExtra", "");
  const [modalVisible, setModalVisible] = useState(false);
  const [refillMessage, setRefillMessage] = useState("");
  const [costPerUnit, setCostPerUnit] = useState("");
  const [costOneWay, setCostOneWay] = useState("");
  const [costBothWays, setCostBothWays] = useState("");
  const [distancePerTank, setDistancePerTank] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationDone, setCalculationDone] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const handleDistanceUnit = (itemValue) => {
    setIsCalculating(true);
    let newDistance;

    if (itemValue === "mi" && distanceUnit === "km") {
      newDistance = parseFloat(distance * 0.621371).toFixed(1);
    } else if (itemValue === "km" && distanceUnit === "mi") {
      newDistance = (parseFloat(distance) * 1.60934).toFixed(1);
    }

    setDistance(newDistance);
    setDistanceUnit(itemValue);

    setIsCalculating(false);
  };

  const handleCalculate = async () => {
    setIsCalculating(true);

    const [distanceUnit, distance, tankSize, fuelPrice, fuelUnit, fuelMilage, extra] = await Promise.all([
      saveDistanceUnitNow(),
      saveDistanceNow(),
      saveTankSizeNow(),
      saveFuelPriceNow(),
      saveFuelUnitNow(),
      saveFuelMilageNow(),
      saveExtraNow()
    ]);


    // Parse and validate inputs, defaulting to 0 for invalid values
    let distanceNum = distance ? parseFloat(distance) : 0;
    let fuelMilageNum = fuelMilage ? parseFloat(fuelMilage) : 0;
    let fuelPriceNum = fuelPrice ? parseFloat(fuelPrice) : 0;
    let tankSizeNum = tankSize ? parseFloat(tankSize) : 0;
    let extraNum = extra ? parseFloat(extra) : 0;

    // Guard against NaN values from parseFloat
    distanceNum = isNaN(distanceNum) ? 0 : distanceNum;
    fuelMilageNum = isNaN(fuelMilageNum) ? 0 : fuelMilageNum;
    fuelPriceNum = isNaN(fuelPriceNum) ? 0 : fuelPriceNum;
    tankSizeNum = isNaN(tankSizeNum) ? 0 : tankSizeNum;
    extraNum = isNaN(extraNum) ? 0 : extraNum;
    let dpt, cpk, cpm, cow, cow2;

    if (distanceUnit === "km") {
      if (fuelUnit === "lpk") {
        // L/100km: distance per tank = (tank size / fuel consumption) * 100
        dpt = fuelMilageNum > 0 ? (tankSizeNum / fuelMilageNum) * 100 : 0;
        // Cost per km = (fuel price * fuel consumption) / 100
        cpk = (fuelPriceNum * fuelMilageNum) / 100;
        cow = distanceNum * cpk + extraNum;
        cow2 = cow * 2;
      } else if (fuelUnit === "mpg") {
        // For MPG in km mode: use the original approach
        const kpg = fuelMilageNum * 1.60934; // km per gallon
        const fn = kpg > 0 ? distanceNum / kpg : 0;
        dpt = tankSizeNum * kpg;
        cpk = kpg > 0 ? fuelPriceNum / kpg : 0;
        cow = fn * fuelPriceNum + extraNum;
        cow2 = cow * 2;
      }
    }

    if (distanceUnit === "mi") {
      if (fuelUnit === "lpk") {
        // Convert L/100km to L/mile
        const lp1k = fuelMilageNum / 100; // L per km
        const lp1mi = lp1k * 1.60934; // L per mile
        dpt = lp1mi > 0 ? tankSizeNum / lp1mi : 0;
        cpm = fuelPriceNum * lp1mi;
        cow = distanceNum * cpm + extraNum;
        cow2 = cow * 2;
      } else if (fuelUnit === "mpg") {
        dpt = tankSizeNum * fuelMilageNum;
        cpm = fuelMilageNum > 0 ? fuelPriceNum / fuelMilageNum : 0;
        cow = distanceNum * cpm + extraNum;
        cow2 = cow * 2;
      }
    }

    // Guard against NaN values and format results
    const safeDpt = isNaN(dpt) || !isFinite(dpt) ? 0 : dpt;
    const safeCpk = isNaN(cpk) || !isFinite(cpk) ? 0 : cpk;
    const safeCpm = isNaN(cpm) || !isFinite(cpm) ? 0 : cpm;
    const safeCow = isNaN(cow) || !isFinite(cow) ? 0 : cow;
    const safeCow2 = isNaN(cow2) || !isFinite(cow2) ? 0 : cow2;

    setDistancePerTank(safeDpt);
    setCostPerUnit(safeCpk || safeCpm);
    setCostOneWay(safeCow);
    setCostBothWays(safeCow2);

    // Check if refilling is necessary
    if (tankSizeNum > 0 && fuelMilageNum > 0) {
      if (distanceNum >= dpt) {
        setRefillMessage(`${translations.refillOnTheWay}`);
      } else {
        setRefillMessage(`${translations.noRefillOnTheWay}`);
      }
    } else {
      setRefillMessage(`${translations.tankSizeRequired}`);
    }

    setCalculationDone(true);
  };

  useEffect(() => {
    if (calculationDone) {
      setIsCalculating(false);
      setModalVisible(true);
    }
  }, [calculationDone]);

  useEffect(() => {
    const getData = async () => {
      try {
        // Batch all storage calls together for better performance
        const [distanceUnit, distanceNumber, tankSize, fuelPrice, fuelUnit, fuelMilage, DistanceExtra] = await Promise.all([
          storageService.getData("distanceUnit"),
          storageService.getData("distanceNumber"),
          storageService.getData("tankSize"),
          storageService.getData("fuelPrice"),
          storageService.getData("fuelUnit"),
          storageService.getData("fuelMilage"),
          storageService.getData("DistanceExtra"),
        ]);

        setDistanceUnit(distanceUnit || "km");
        setDistance(distanceNumber || "");
        setTankSize(tankSize || "");
        setFuelPrice(fuelPrice || "");
        setFuelUnit(fuelUnit || "lpk");
        setFuelMilage(fuelMilage || "");
        setExtra(DistanceExtra || "");
      } catch (error) {
        console.error("Error fetching storage data: ", error);
      } finally {
        setIsLoading(false);
      }
    }
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

      <View style={[styles.container, { paddingTop: insets.top }]}>
        <DistanceModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setCalculationDone(false);
          }}
          distance={distance || 0}
          costPerUnit={costPerUnit || 0}
          costOneWay={costOneWay || 0}
          costBothWays={costBothWays || 0}
          distanceUnit={distanceUnit || 'km'}
          refillMessage={refillMessage}
          distancePerTank={distancePerTank || 0}
          translations={translations}
          language={language}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 75}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: 90 + insets.bottom }]}>
            <View style={styles.head}>
              <View style={styles.header}>
                <Text style={styles.headerText}>{translations.typeIn}</Text>
                <Picker
                  selectedValue={distanceUnit}
                  onValueChange={handleDistanceUnit}
                  style={styles.picker}
                >
                  <Picker.Item label={translations.kilometers} value="km" />
                  <Picker.Item label={translations.miles} value="mi" />
                </Picker>
              </View>


              <TextInput
                keyboardType="numeric"
                value={distance ? distance.toString() : ""}
                onChangeText={setDistance}
                placeholder={`${translations.enterDistance} ${distanceUnit}`}
                style={[styles.input, { width: "100%" }]}
              />
            </View>

            <View style={styles.calcBox}>
              {isCalculating ? (
                <View style={{ padding: 27 }}>
                  <ActivityIndicator size="large" color="#a8bfad" />
                </View>
              ) : (
                <CalculateButton onPress={handleCalculate} style={styles.calcBtn} />
              )
              }
            </View>

            <View style={styles.fuelBox}>
              <FuelPicker
                selectedValue={fuelUnit}
                onValueChange={(newFuelUnit) => {
                  handleFuelUnit(fuelUnit, newFuelUnit, fuelMilage, tankSize, fuelPrice, setFuelMilage, setTankSize, setFuelPrice, setFuelUnit, setIsCalculating);
                }}
                style={styles.pickerFuel}
              >
              </FuelPicker>
            </View>


            <View style={styles.grid}>
              <View style={styles.gridSection}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridItemLabel}>
                    {translations.tankSize}
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    value={tankSize ? tankSize.toString() : ""}
                    onChangeText={setTankSize}
                    placeholder={translations.enterTankSize}
                    style={styles.gridInput}
                  />
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridItemLabel}>
                    {translations.fuelPrice}
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    value={fuelPrice ? fuelPrice.toString() : ""}
                    onChangeText={setFuelPrice}
                    placeholder={translations.enterFuelPrice}
                    style={styles.gridInput}
                  />
                </View>
              </View>

              <View style={styles.gridSection}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridItemLabel}>
                    {fuelUnit == "lpk"
                      ? "L/100km"
                      : fuelUnit == "mpg"
                        ? "M/Gallon"
                        : "Fuel Unit"}
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    value={fuelMilage ? fuelMilage.toString() : ""}
                    onChangeText={setFuelMilage}
                    placeholder={`${translations.fuelEfficiency}`}
                    style={styles.gridInput}
                  />
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridItemLabel}>{translations.extra} </Text>
                  <TextInput
                    keyboardType="numeric"
                    value={extra ? extra.toString() : ""}
                    onChangeText={setExtra}
                    placeholder={`${translations.enterExtraFees}`}
                    style={styles.gridInput}
                  />
                </View>
              </View>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>

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
    paddingTop: 16,
    paddingBottom: 90,
  },
  head: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
  },
  picker: {
    width: 165,
    height: "100%",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
    textAlign: "center",
  },
  calcBox: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 10,
  },
  fuelBox: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 50,
  },
  grid: {
    flex: 6,
    flexDirection: "column",
    alignItems: "center",
  },
  gridSection: {
    flex: 1,
    paddingBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gridItem: {
    justifyContent: "center",
    textAlign: "center",
    width: "48%",
    margin: 3,
  },
  gridItemLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  gridInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    paddingBottom: 20,
    paddingTop: 20,
    marginBottom: 16,
    borderRadius: 4,
    textAlign: "center",
  }
});

export default React.memo(DistancePage);
