import React, { useState, createContext, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import storageService from "./StorageService";
import en from "./lang/en";
import no from "./lang/no";

const LanguageContext = createContext();

export const LanguageService = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState(en);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const getSavedLanguage = async () => {
      try {
        const savedLanguage = await storageService.getData("language");
        if (savedLanguage) {
          setLanguage(savedLanguage);
          setTranslations(savedLanguage === "en" ? en : no);
        } else {
          const defaultLanguage = "en";
          setLanguage(defaultLanguage);
          setTranslations(defaultLanguage === "en" ? en : no);
        }
        setIsInitialized(true);
      } catch (error) {
        console.log(error);
        setIsInitialized(true);
      }
    };
    getSavedLanguage();
  }, []);

  const handleLanguageChange = async (newLanguage) => {
    try {
      await storageService.saveData("language", newLanguage);
      setLanguage(newLanguage);
      setTranslations(newLanguage === "en" ? en : no);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LanguageContext.Provider
      value={{ language, translations, handleLanguageChange }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export const LanguageSelector = () => {
  const { handleLanguageChange, language } = useLanguage();

  return (
    <View style={styles.flags}>
      <TouchableOpacity 
        style={[styles.flagButton, language === "no" && styles.activeFlag]} 
        onPress={() => handleLanguageChange("no")}
      >
        <FontAwesome name="flag" size={20} color={language === "no" ? "#fff" : "#666"} />
        <Text style={[styles.flagTextFallback, language === "no" && styles.activeText]}>NO</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.flagButton, language === "en" && styles.activeFlag]} 
        onPress={() => handleLanguageChange("en")}
      >
        <FontAwesome name="flag" size={20} color={language === "en" ? "#fff" : "#666"} />
        <Text style={[styles.flagTextFallback, language === "en" && styles.activeText]}>EN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  flags: {
    flexDirection: "row",
    alignItems: "center",
  },
  flagButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeFlag: {
    backgroundColor: "#a8bfad",
  },
  flagTextFallback: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#666",
    marginTop: 2,
  },
  activeText: {
    color: "#fff",
  },
});
