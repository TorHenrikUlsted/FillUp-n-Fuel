import React, { useState, createContext, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import storageService from './StorageService';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Retrieve the saved language from AsyncStorage when the component is mounted
    const getSavedLanguage = async () => {
      try {
        const savedLanguage = await storageService.getData('language');
        if (savedLanguage) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSavedLanguage();
  }, []);

  const handleLanguageChange = async (newLanguage) => {
    // Save the selected language to AsyncStorage using storageService
    try {
      await storageService.saveData('language', newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, handleLanguageChange }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export const LanguageSelector = () => {
  const { handleLanguageChange } = useLanguage();

  return (
    <View style={styles.flags}>
      <TouchableOpacity onPress={() => handleLanguageChange('no')}>
        <Text style={styles.flagText}>🇳🇴</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleLanguageChange('en')}>
        <Text style={styles.flagText}>🇬🇧</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  flags: {
    flexDirection: 'row',
  },
  flagText: {
    fontSize: 21,
    marginHorizontal: 10,
    marginTop: 40,
  },
});