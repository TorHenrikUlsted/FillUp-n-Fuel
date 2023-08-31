import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguage } from '../LanguageProvider';

const translations = {
  en: {
    youCanTravel: 'A full tank will get you',
    tankSizeRequiredForEstimate: 'Tank size is required in order to estimate travel distance.',
    itWillCost: 'It will cost',
    per: 'per',
    forOneWay: 'For one way',
    forBothWays: 'For Both ways',
    refill: 'Refill',
    close: 'Close',
    kilometers: 'kilometers',
  },
  no: {
    youCanTravel: 'En full tank vil gi deg',
    tankSizeRequiredForEstimate: 'Tankstørrelse er nødvendig for å estimere reiseavstand.',
    itWillCost: 'Det vil koste',
    per: 'per',
    forOneWay: 'For en vei',
    forBothWays: 'For begge veier',
    refill: 'Påfylling',
    close: 'Lukk',
    kilometers: 'kilometer',
  },
};


const DistanceModal = ({ 
  visible, 
  onClose, 
  distanceUnit, 
  costPerUnit, 
  costOneWay, 
  costBothWays, 
  distance, 
  refillMessage, 
  distancePerTank,
}) => {
  const { language } = useLanguage();
  
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View>
          <Text style = {[styles.heading, {fontSize: 30}]}>For{' '}
            <Text style={styles.cost}>{Number(distance).toFixed(2)}{' '}
              <Text style={{color: 'black'}}>{distanceUnit === 'km' ? translations[language].kilometers : 'Miles'}</Text>
            </Text>
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style = {[styles.faintText, styles.heading]}>{translations[language].youCanTravel}</Text>
          {!isNaN(distancePerTank) && (
            <View>
              <Text style={[styles.sectionText, styles.cost]}> {distancePerTank.toFixed(2)}{' '}
                <Text style={{color: 'black'}}>{distanceUnit === "km" ? translations[language].kilometers : "Miles"}
                </Text>
              </Text>
            </View>
          )}
          {isNaN(distancePerTank) && (
            <Text style={styles.sectionText}>{translations[language].tankSizeRequiredForEstimate}</Text>
          )}
          
        </View>

        <View style={styles.section}>
          <Text style={[styles.faintText, styles.heading]}>{translations[language].itWillCost}</Text>
          <Text style= {[styles.sectionText, styles.cost]}>{costPerUnit.toFixed(2)}{' '} 
            <Text style={styles.costTxt}>per 
              <Text style={{color: 'black'}}> {distanceUnit === "km" ? 'kilometer' : "Mile" }</Text>
            </Text>
          </Text>
          <Text style= {[styles.sectionText, styles.cost]}>{costOneWay.toFixed(2)}{' '} 
            <Text style={styles.costTxt}>{translations[language].forOneWay}</Text>
          </Text>
          <Text style= {[styles.sectionText, styles.cost]}>{costBothWays.toFixed(2)}{' '} 
            <Text style={styles.costTxt}>{translations[language].forBothWays}</Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style = {[styles.faintText, styles.heading]}>{translations[language].refill}</Text>
          <Text style= {styles.sectionText}>{refillMessage}</Text>
        </View>
        <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
          <Text style={styles.modalCloseBtnText}>{translations[language].close}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    padding: 16,
    alignItems: 'center',
  },
  faintText: {
    color: '#999',
    textAlign: 'center',
  },
  section: {
    marginTop: 50,
  },
  sectionText: {
    fontSize: 20,
    textAlign: 'center',
  },
  costTxt: {
    color: 'black',
  },
  heading: {
    marginBottom: 8,
    fontSize: 23,
    textAlign: 'center',
  },
  modalCloseBtn: {
    backgroundColor: '#00b300',
      paddingVertical: 20,
      paddingHorizontal: 100,
      borderRadius: 4,
      marginTop: 75,
  },
  modalCloseBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },

cost:{
color:'#00b300'
}
});

export default DistanceModal;
