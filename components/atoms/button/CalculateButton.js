import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../../utils/LanguageService';


const CalculateButton = ({ isUpdating, onPress }) => {
    const { language, translations } = useLanguage();
  return (
    <TouchableOpacity 
      disabled={isUpdating} 
      onPress={onPress} 
      style={styles.button}
    >
      <Text style={styles.text}>{translations.calculate}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 70,
    backgroundColor: '#a8bfad',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    marginBottom: 20,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CalculateButton;
