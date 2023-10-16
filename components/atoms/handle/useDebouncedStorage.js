import { useState, useEffect } from 'react';
import storageService from '../../../utils/StorageService';

export const useDebouncedStorage = (key, initialValue) => {
  const [value, setValue] = useState(initialValue);
  const [lastSavedValue, setLastSavedValue] = useState(initialValue);

  const saveDataNow = () => {
    return new Promise((resolve) => {
      resolve(value);
    });
  };

  useEffect(() => {
    if (lastSavedValue !== value) {
      const timeoutId = setTimeout(() => {
        storageService.saveData(key, value);
        setLastSavedValue(value);
      }, 500); // debounce time is 500ms

      return () => clearTimeout(timeoutId); // this will clear Timeout
                                            // if useEffect is run again within 500ms
    }
  }, [value]);

  return [value, setValue, saveDataNow];
};
