import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, 
  KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DistanceModal from './modals/DistanceModal';
import { useLanguage } from './LanguageProvider';
import BackButton from './buttons/BackButton';
import CalculateButton from './buttons/CalculateButton';
import storageService from './StorageService';

const translations = {
    en: {
      refillOnTheWay: 'You will need to refill on the way.',
      noRefillOnTheWay: 'You will not need to refill on the way.',
      tankSizeRequired: 'Tank size is required to determine if refilling is necessary.',
      typeIn: 'Type In',
      kilometers: 'Kilometers',
      miles: 'Miles',
      enterDistance: `Enter distance in`,
      tankSize: 'Tank Size (L)',
      enterTankSize: 'Enter tank size (L)',
      fuelPrice: 'Fuel Price',
      enterFuelPrice: 'Enter fuel price',
      fuelEfficiency: 'Enter fuel efficiency',
      extra: 'EXTRA',
      enterExtraFees: 'Enter extra fees'
    },
    no: {
      refillOnTheWay: 'Du må fylle underveies',
      noRefillOnTheWay: 'Du trenger ikke å fylle underveis.',
      tankSizeRequired: 'Volum på tanken er nødvendig for å avgjøre om påfylling er nødvendig underveis.',
      typeIn: 'Skriv inn',
      kilometers: 'Kilometer',
      miles: 'Miles',
      enterDistance: `Skriv inn avstand i`,
      tankSize: 'Tankstørrelse (L)',
      enterTankSize: 'Skriv inn tankstørrelse',
      fuelPrice: 'Drivstoffpris',
      enterFuelPrice: 'Skriv inn drivstoffpris',
      fuelEfficiency: `Skriv inn drivstoffbruk`,
      extra: `EKSTRA`,
      enterExtraFees:`Skriv inn ekstra avgifter`
    },
  };
  
const DistancePage = () => {  
  const { language } = useLanguage();

  const [distanceUnit, setDistanceUnit] = useState('km');
  const [distance, setDistance] = useState('');
  const [tankSize, setTankSize] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [fuelUnit, setFuelUnit] = useState('L/100km');
  const [fuelMilage, setFuelMilage] = useState('');
  const [extra, setExtra] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [cost, setCost] = useState('');
  const [refillMessage, setRefillMessage] = useState('');
  const [fuelConsumption, setFuelConsumption] = useState(0);
  const [costBothWaysKm, setCostBothWaysKm] = useState(0);
  const [costPerKm, setCostPerKm] = useState(0);
  const [costOneWayKm, setCostOneWayKm] = useState(0);
  const [costBothWaysMi, setCostBothWaysMi] = useState(0);
  const [costPerMi, setCostPerMi] = useState(0);
  const [costOneWayMi, setCostOneWayMi] = useState(0);
  const [distancePerTank, setDistancePerTank] = useState(0);


    const handleCalculate = () => {

      const distanceInKm = distanceUnit === 'km' ? distance : distance * 1.60934;
      if (fuelUnit === 'L/100km') {
        const fuelConsumption = (distanceInKm / 100) * fuelMilage;
        let cost = fuelConsumption * fuelPrice;
        cost += Number(extra);
        const costPerKm = (fuelMilage / 100) * fuelPrice;
        const costOneWayKm = cost;
        const costBothWaysKm = cost * 2;
        const distancePerTank = (tankSize / fuelMilage) * 100;
        setFuelConsumption(fuelConsumption);
        setCost(cost);
        setCostPerKm(costPerKm);
        setCostOneWayKm(costOneWayKm);
        setCostBothWaysKm(costBothWaysKm);
        setDistancePerTank(distancePerTank);
      } 
      
      else if (fuelUnit === 'L/mi') {
        const fuelConsumption = distanceInKm * (tankSize / 1.60934);
        let cost = fuelConsumption * fuelPrice;
        cost += Number(extra);
        const costPerMi = tankSize * fuelPrice;
        const costOneWayMi = cost;
        const costBothWaysMi = cost * 2;
        const distancePerTank = tankSize / fuelMilage;
        setFuelConsumption(fuelConsumption);
        setCost(cost);
        setCostPerMi(costPerMi);
        setCostOneWayMi(costOneWayMi);
        setCostBothWaysMi(costBothWaysMi);
        setDistancePerTank(distancePerTank);
      } 
      
      else if (fuelUnit === 'mi/gal') {
        const fuelConsumption = distanceInKm / (tankSize * 1.60934);
        let cost = fuelConsumption * fuelPrice;
        cost += Number(extra);
        const costPerMi = (fuelPrice / tankSize);
        const costOneWayMi = cost;
        const costBothWaysMi = cost * 2;
        const distancePerTank = tankSize * fuelMilage;
        setFuelConsumption(fuelConsumption);
        setCost(cost);
        setCostPerMi(costPerMi);
        setCostOneWayMi(costOneWayMi);
        setCostBothWaysMi(costBothWaysMi);
        setDistancePerTank(distancePerTank);
      }

    // Convert cost to miles if necessary
if (distanceUnit === 'mi') {
  setCost(prevCost => prevCost / 1.60934);
  if (costOneWayKm) {
    setCostOneWayMi((costOneWayKm / 1.60934).toFixed(2));
    setCostBothWaysMi((costBothWaysKm / 1.60934).toFixed(2));
    setCostPerMi((costPerKm / 1.60934).toFixed(2));
  }
} else {
  if (costOneWayMi) {
    setCostOneWayKm((costOneWayMi * 1.60934).toFixed(2));
    setCostBothWaysKm((costBothWaysMi * 1.60934).toFixed(2));
    setCostPerKm((costPerMi * 1.60934).toFixed(2));
  }
}

    // Check if refilling is necessary
  if (tankSize) {
    
    if (fuelConsumption > tankSize) {
      setRefillMessage(`${translations[language].refillOnTheWay}`);
    } else {
      setRefillMessage(`${translations[language].noRefillOnTheWay}`);
    }

  } else {
    setRefillMessage(`${translations[language].tankSizeRequired}`);
  }
  
    setModalVisible(true);
      
  };


  useEffect(() => {
    const getData = async () => {
      const distanceUnit = await storageService.getData('distanceUnit');
      if (distanceUnit !== null) {
        setDistanceUnit(distanceUnit);
      }
      const distanceNumber = await storageService.getData('distanceNumber');
      if (distanceNumber !== null) {
        setDistance(distanceNumber);
      }
      const distanceTankSize = await storageService.getData('distanceTankSize');
      if (distanceTankSize !== null) {
        setTankSize(distanceTankSize);
      }
      const FuelPrice = await storageService.getData('FuelPrice');
      if (FuelPrice !== null) {
        setFuelPrice(FuelPrice);
      }
      const DistanceFuelUnit = await storageService.getData('DistanceFuelUnit');
      if (DistanceFuelUnit !== null) {
        setFuelUnit(DistanceFuelUnit);
      }
      const DistanceFuelMilage = await storageService.getData('DistanceFuelMilage');
      if (DistanceFuelMilage !== null) {
        setFuelMilage(DistanceFuelMilage);
      }
      const DistanceExtra = await storageService.getData('DistanceExtra');
      if (DistanceExtra !== null) {
        setExtra(DistanceExtra);
      }
    };
    getData();
  }, []);

  return (
    <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
        <DistanceModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            distance={distance}
            costPerUnit={distanceUnit === 'km' ? costPerKm : costPerMi}
            costOneWay={distanceUnit === 'km' ? costOneWayKm : costOneWayMi}
            costBothWays={distanceUnit === 'km' ? costBothWaysKm : costBothWaysMi}
            distanceUnit={distanceUnit}
            refillMessage={refillMessage}
            distancePerTank={distancePerTank}
        />

        <View style={styles.header}>
        <Text style={styles.headerText}>{translations[language].typeIn}</Text>
        <Picker
            selectedValue={distanceUnit}
            onValueChange={(itemValue) => {
              setDistanceUnit(itemValue);
              storageService.saveData('distanceUnit', itemValue);
            }}

            style={styles.picker}
        >
            <Picker.Item label={translations[language].kilometers} value="km" />
            <Picker.Item label={translations[language].miles} value="mi" />
        </Picker>
        </View>
        <TextInput
        value={distance}
        onChangeText={(text) => {
          setDistance(text);
          storageService.saveData('distanceNumber', text);
        }}
        keyboardType="numeric"
        placeholder={`${translations[language].enterDistance} ${distanceUnit}`}
        style={styles.input}
        />
        <CalculateButton onPress={handleCalculate} />

        <View style={styles.grid}>
        <View style={styles.gridItem}>
            <Text style={styles.gridItemLabel}>{translations[language].tankSize}</Text>
            <TextInput
            value={tankSize}
            onChangeText={(text) => {
              setTankSize(text);
              storageService.saveData('distanceTankSize', text);
            }}
            keyboardType="numeric"
            placeholder={translations[language].enterTankSize}
            style={styles.input}
            />
        </View>
        <View style={styles.gridItem}>
            <Text style={styles.gridItemLabel}>{translations[language].fuelPrice}</Text>
            <TextInput
            value={fuelPrice}
            onChangeText={(text) => {
              setFuelPrice(text);
              storageService.saveData('FuelPrice', text);
            }}
            keyboardType="numeric"
            placeholder={translations[language].enterFuelPrice}
            style={styles.input}
            />
        </View>
        <View style={styles.gridItem}>
            <Picker
            selectedValue={fuelUnit}
            onValueChange={(itemValue) => {
              setFuelUnit(itemValue);
              storageService.saveData('DistanceFuelUnit', itemValue);
            }}
            style={styles.gridItemLabel}
            >
            <Picker.Item label="L/mile" value="L/mi" />
            <Picker.Item label="L/100km" value="L/100km" />
            <Picker.Item label="M/Gallon" value="mi/gal" />
            </Picker>
            <TextInput
            value={fuelMilage}
            keyboardType="numeric"
            onChangeText={(text) => {
              setFuelMilage(text);
              storageService.saveData('DistanceFuelMilage', text);
            }}
            placeholder={`${translations[language].fuelEfficiency}`}
            style={styles.input}
            />
        </View>
        <View style={[styles.gridItem,{paddingTop: 34}]} >
          <Text style={styles.gridItemLabel}>{translations[language].extra} </Text> 
            <TextInput
            value={extra}
            onChangeText={(text) => {
              setExtra(text);
              storageService.saveData('DistanceExtra', text);
            }}
            keyboardType="numeric"
            placeholder={`${translations[language].enterExtraFees}`}
            style={styles.input}
            />
        </View>
      </View>
      <BackButton />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inner: {
      padding: 16,
      flex: 1,
      justifyContent: 'space-around',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginRight: 8,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 8,
      marginBottom: 16,
      borderRadius: 4,
      textAlign: 'center',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      verticalAlign: 'middle',
      marginBottom: 100,
    },
    picker: {
      width: '50%',
    },
    gridItem: {
      justifyContent: 'center',
      textAlign: 'center',
      width: '48%',
    },
    gridItemLabel: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 4,
      textAlign: 'center',
    },
  });

  export default DistancePage;