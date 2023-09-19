import AsyncStorage from "@react-native-async-storage/async-storage";

const storageService = {
  saveData: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  },
  getData: async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return JSON.parse(value);
      }
    } catch (error) {
      console.error(`Error fetching data for key: ${key}`, error);
    }
  },
};

export default storageService;
