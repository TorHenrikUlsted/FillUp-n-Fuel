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
      }, 200); // reduced debounce time to 200ms for better responsiveness

      return () => clearTimeout(timeoutId); // this will clear Timeout
                                            // if useEffect is run again within 200ms
    }
  }, [value]);

  return [value, setValue, saveDataNow];
};
