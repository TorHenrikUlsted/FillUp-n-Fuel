import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DistanceModal from "../organisms/modal/DistanceModal";
import { useLanguage } from "../../utils/LanguageService";
import BackButton from "../atoms/button/BackButton";
import CalculateButton from "../atoms/button/CalculateButton";
import storageService from "../../utils/StorageService";
import FuelPicker from "../atoms/picker/FuelPicker";

const DistancePage = () => {
  const { language, translations } = useLanguage();
  const [distanceUnit, setDistanceUnit] = useState("km");
  const [distance, setDistance] = useState(0);
  const [tankSize, setTankSize] = useState(0);
  const [fuelPrice, setFuelPrice] = useState(0);
  const [fuelUnit, setFuelUnit] = useState("lpk");
  const [fuelMilage, setFuelMilage] = useState(0);
  const [extra, setExtra] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [cost, setCost] = useState(0);
  const [refillMessage, setRefillMessage] = useState("");
  const [costPerUnit, setCostPerUnit] = useState(0);
  const [costOneWay, setCostOneWay] = useState(0);
  const [costBothWays, setCostBothWays] = useState(0);
  const [distancePerTank, setDistancePerTank] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleDistanceUnit = (itemValue) => {
    let newDistance;
    if (itemValue === "mi" && distanceUnit === "km") {
      newDistance = parseFloat(distance * 0.621371).toFixed(1);
    } else if (itemValue === "km" && distanceUnit === "mi") {
      newDistance = (parseFloat(distance) * 1.60934).toFixed(1);
    }

    setDistance(newDistance);
    storageService.saveData("distanceNumber", newDistance);

    setDistanceUnit(itemValue);
    storageService.saveData("distanceUnit", itemValue);
  };

  const handleFuelUnit = (oldFuelUnit, newFuelUnit) => {
    if (oldFuelMilage === "") {
      setFuelMilage("0");
      storageService.saveData("fuelMilage", "0");
      return;
    }
    let oldFuelMilage = parseFloat(fuelMilage);
    let newFuelMilage;
    let newTankSize;
    let newFuelPrice;

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

    const numMilage = newFuelMilage.toFixed(1);
    const numPrice = newFuelPrice.toFixed(2);

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
    let distanceNum = parseFloat(distance);
    let fuelMilageNum = parseFloat(fuelMilage);
    let fuelPriceNum = parseFloat(fuelPrice);
    let tankSizeNum = parseFloat(tankSize);
    let extraNum = parseFloat(extra);

    if (distanceUnit === "km") {
      if (fuelUnit === "lpk") {
        const dpt = (tankSizeNum / fuelMilageNum) * 100;
        const cpk = (fuelPriceNum * tankSize) / dpt;
        const cow = distanceNum * cpk + extraNum;
        const cow2 = cow * 2;

        setDistancePerTank(dpt);
        setCostPerUnit(cpk);
        setCostOneWay(cow);
        setCostBothWays(cow2);
      } else if (fuelUnit === "mpg") {
        const kpg = fuelMilageNum * 1.60934; //convert to km
        //const kpl = (kpg / 3.78541); //convert to liter
        const fn = distanceNum / kpg;
        const dpt = tankSizeNum * kpg;
        const cpk = fuelPriceNum / kpg;
        const cow = fn * fuelPrice + extraNum;
        const cow2 = cow * 2;

        setDistancePerTank(dpt);
        setCostPerUnit(cpk);
        setCostOneWay(cow);
        setCostBothWays(cow2);
      }
    }

    if (distanceUnit === "mi") {
      if (fuelUnit === "lpk") {
        const lp1k = fuelMilageNum / 100;
        const lp1mi = lp1k * 1.60934;
        const dpt = tankSizeNum / lp1mi;
        const cpm = (fuelPriceNum * tankSize) / dpt;
        const cow = distanceNum * cpm + extraNum;
        const cow2 = cow * 2;

        setDistancePerTank(dpt);
        setCostPerUnit(cpm);
        setCostOneWay(cow);
        setCostBothWays(cow2);
      } else if (fuelUnit === "mpg") {
        const dpt = tankSizeNum * fuelMilageNum;
        const fn = distanceNum / fuelMilageNum;
        const cpm = fuelPriceNum / fuelMilageNum;
        const cow = fn * fuelPriceNum + extraNum;
        const cow2 = cow * 2;

        setDistancePerTank(dpt);
        setCostPerUnit(cpm);
        setCostOneWay(cow);
        setCostBothWays(cow2);
      }
    }

    // Check if refilling is necessary
    if (distanceNum > distancePerTank) {
      setRefillMessage(`${translations.refillOnTheWay}`);
    } else if (distanceNum <= distancePerTank) {
      setRefillMessage(`${translations.noRefillOnTheWay}`);
    } else setRefillMessage(`${translations.tankSizeRequired}`);

    setModalVisible(true);
  };

  useEffect(() => {
    const getData = async () => {
      const distanceUnit = await storageService.getData("distanceUnit");
      if (distanceUnit !== null) {
        setDistanceUnit(distanceUnit);
      }
      const distanceNumber = await storageService.getData("distanceNumber");
      if (distanceNumber !== null) {
        setDistance(parseFloat(distanceNumber));
      }
      const tankSize = await storageService.getData("tankSize");
      if (tankSize !== null) {
        setTankSize(tankSize);
      }
      const fuelPrice = await storageService.getData("fuelPrice");
      if (fuelPrice !== null) {
        setFuelPrice(fuelPrice);
      }
      const fuelUnit = await storageService.getData("fuelUnit");
      if (fuelUnit !== null) {
        setFuelUnit(fuelUnit);
      }
      const fuelMilage = await storageService.getData("fuelMilage");
      if (fuelMilage !== null) {
        setFuelMilage(parseFloat(fuelMilage));
      }
      const DistanceExtra = await storageService.getData("DistanceExtra");
      if (DistanceExtra !== null) {
        setExtra(parseFloat(DistanceExtra));
      }
      setIsLoading(false);
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
            <DistanceModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              distance={distance}
              costPerUnit={costPerUnit}
              costOneWay={costOneWay}
              costBothWays={costBothWays}
              distanceUnit={distanceUnit}
              refillMessage={refillMessage}
              distancePerTank={distancePerTank}
              translations={translations}
              language={language}
            />

            <View style={styles.header}>
              <Text style={styles.headerText}>{translations.typeIn}</Text>
              <Picker
                selectedValue={distanceUnit}
                onValueChange={(itemValue) => {
                  handleDistanceUnit(itemValue);
                }}
                style={styles.picker}
              >
                <Picker.Item label={translations.kilometers} value="km" />
                <Picker.Item label={translations.miles} value="mi" />
              </Picker>
            </View>
            <TextInput
              keyboardType="numeric"
              value={distance ? distance.toString() : ""}
              onChangeText={(text) => {
                setDistance(text);
                storageService.saveData("distanceNumber", text);
              }}
              placeholder={`${translations.enterDistance} ${distanceUnit}`}
              style={styles.input}
            />

            <CalculateButton onPress={handleCalculate} />
            <FuelPicker
              selectedValue={fuelUnit}
              onValueChange={(newFuelUnit) => {
                handleFuelUnit(fuelUnit, newFuelUnit);
              }}
            ></FuelPicker>

            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.gridItemLabel}>
                  {translations.tankSize}
                </Text>
                <TextInput
                  keyboardType="numeric"
                  value={tankSize ? tankSize.toString() : ""}
                  onChangeText={(text) => {
                    setTankSize(text);
                    storageService.saveData("tankSize", text);
                  }}
                  placeholder={translations.enterTankSize}
                  style={styles.input}
                />
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridItemLabel}>
                  {translations.fuelPrice}
                </Text>
                <TextInput
                  keyboardType="numeric"
                  value={fuelPrice ? fuelPrice.toString() : ""}
                  onChangeText={(text) => {
                    setFuelPrice(text);
                    storageService.saveData("fuelPrice", text);
                  }}
                  placeholder={translations.enterFuelPrice}
                  style={styles.input}
                />
              </View>
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
                  onChangeText={(text) => {
                    setFuelMilage(text);
                    storageService.saveData("fuelMilage", text);
                  }}
                  placeholder={`${translations.fuelEfficiency}`}
                  style={styles.input}
                />
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridItemLabel}>{translations.extra} </Text>
                <TextInput
                  keyboardType="numeric"
                  value={extra ? extra.toString() : ""}
                  onChangeText={(text) => {
                    setExtra(text);
                    storageService.saveData("DistanceExtra", text);
                  }}
                  placeholder={`${translations.enterExtraFees}`}
                  style={styles.input}
                />
              </View>
            </View>
            <BackButton />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    verticalAlign: "middle",
    marginBottom: 100,
  },
  picker: {
    width: "50%",
  },
  gridItem: {
    justifyContent: "center",
    textAlign: "center",
    width: "48%",
  },
  gridItemLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
});

export default DistancePage;
