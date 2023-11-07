import React, { useState, createContext, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import storageService from "./StorageService";
import en from "./lang/en";
import no from "./lang/no";

const LanguageContext = createContext();

export const LanguageService = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState(en);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      } catch (error) {
        console.log(error);
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

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

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
  const { handleLanguageChange } = useLanguage();

  return (
    <View style={styles.flags}>
      <TouchableOpacity onPress={() => handleLanguageChange("no")}>
        <Text style={styles.flagText}>🇳🇴</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleLanguageChange("en")}>
        <Text style={styles.flagText}>🇬🇧</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  flags: {
    flexDirection: "row",
  },
  flagText: {
    fontSize: 30,
    marginHorizontal: 10,
  },
});
