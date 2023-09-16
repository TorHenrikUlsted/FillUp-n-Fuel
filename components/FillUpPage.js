import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,  Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import storageService from './StorageService';
import Gauge from './Gauge';
import BackButton from './buttons/BackButton';
import CalculateButton from './buttons/CalculateButton';
import NumberInput from './inputs/NumberInput';
import FillUpModal from './modals/FillUpModal';
import { useLanguage } from './LanguageProvider';

const translations = {
    en: {

        tankSize: 'Tank Size (L)',
        fuelPrice: 'Fuel Price',
        currentFuelLevel: 'Current Fuel Level (L)',
        cost: 'Cost',
    },
    no: {
        tankSize: 'Tankstørrelse (L)',
        fuelPrice: 'Drivstoffpris',
        currentFuelLevel: 'Nåværende drivstoffnivå (L)',
        cost: 'Kostnad',
    },
  };

const FillUpPage = () => {
    const { language } = useLanguage();
    const [tankSize, setTankSize] = useState(0);
    const [fuelPrice, setFuelPrice] = useState(0);
    const [currentFuelLevel, setCurrentFuelLevel] = useState([1, '/', 2]);
    const [cost, setCost] = useState(0);
    const [litersNeeded, setLitersNeeded] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);

  const handleTankSizeChange = (text) => {
    const value = parseFloat(text);
    setTankSize(value);
    storageService.saveData('tankSize', value);
  };

  const handleFuelPriceChange = (text) => {
    const value = parseFloat(text);
    if (isNaN(value)) {
        setFuelPrice('');
    } else {
        setFuelPrice(value);
        storageService.saveData('FuelPrice', value);
    }
};

useEffect(() => {
  const getData = async () => {
    const tankSize = await storageService.getData('tankSize');
    if (tankSize !== null) {
      setTankSize(tankSize);
    }
    const FuelPrice = await storageService.getData('FuelPrice');
    if (FuelPrice !== null) {
      setFuelPrice(FuelPrice);
    }
    const currentFuelLevel = await storageService.getData('currentFuelLevel');
    if (currentFuelLevel !== null) {
      setCurrentFuelLevel(currentFuelLevel);
    }
  };
  getData();
}, []);

const handleCalculate = () => {
  // Convert the current fuel level from a fraction to a number
  const [numerator, _, denominator] = currentFuelLevel;
  let currentFuelLevelInLiters;
  if (denominator === 0) {
      currentFuelLevelInLiters = 0;
  } else {
      currentFuelLevelInLiters = (numerator / denominator) * tankSize;
  }

  // Calculate the cost of filling up the tank
  const cost = (tankSize - currentFuelLevelInLiters) * fuelPrice;
  setCost(cost);

  // Calculate the number of liters needed to fill up the tank
  setLitersNeeded(tankSize - currentFuelLevelInLiters);

  // Show the modal
  setIsModalVisible(true);
};


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
        <View style={styles.inner}>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.inputLabel}>{translations[language].tankSize}</Text>
              <NumberInput
                style={styles.input}
                value={tankSize ? tankSize.toString(): ''}
                onChangeText={handleTankSizeChange}
              />

          </View>
          <View style={styles.gridItem}>
            <Text style={styles.inputLabel}>{translations[language].fuelPrice}</Text>
            <NumberInput
              style={styles.input}
              value={fuelPrice ? fuelPrice.toString(): ''}
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
            storageService.saveData('currentFuelLevel', currentFuelLevel)
          }}
          />
        </View>    
        
        <CalculateButton onPress={handleCalculate} />
        <BackButton />

        <FillUpModal
          isVisible={isModalVisible}
          cost={cost}
          litersNeeded={litersNeeded}
          onClose={() => setIsModalVisible(false)}
        />
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
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      fontSize: 18,
        textAlign: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    gridItem: {
        flex: 1,
        paddingHorizontal: 5,
        marginBottom: 16,
        height: 100,
        
    },
    gaugeContainer: {
      alignItems: 'center',
      paddingVertical: 30,
      paddingBottom: 1,
      marginBottom: 50,
    },
  });

export default FillUpPage;
