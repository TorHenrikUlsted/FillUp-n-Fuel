import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { useLanguage } from '../LanguageProvider';

const translations = {
    en: {
        calculate: 'Calculate',
    },
    no: {
        calculate: 'Beregn'
    },
  };

const CalculateButton = ({ onPress }) => {
    const { language } = useLanguage();
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.text}>{translations[language].calculate}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 70,
    backgroundColor: '#00b300',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    marginBottom: 100,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CalculateButton;
