import AsyncStorage from "@react-native-async-storage/async-storage";

const storageService = {
  saveData: async (key, value) => {
    try {
      if (value !== undefined) {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } else {
        await AsyncStorage.setItem(key, JSON.stringify(0));
      }
    } catch (error) {
      console.log(`Error saving data for key: ${key}`, error);
    }
  },
  getData: async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return JSON.parse(value);
      } else {
        console.log(`No data found for key: ${key}, returning null`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching data for key: ${key}`, error);
      return null;
    }
  },
};

export default storageService;
