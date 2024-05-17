import { useState } from 'react';

// Define the custom hook
const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  // Retrieve initial value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window !== 'undefined') {
        // Get stored value from localStorage
        const item = window.localStorage.getItem(key);
        // Parse and return stored JSON value or return initialValue if not found
        return item ? JSON.parse(item) : initialValue;
      } else {
        return initialValue;
      }
    } catch (error) {
      console.error(`Error retrieving ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Function to update the value in localStorage and state
  const setValue = (value: T) => {
    try {
      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(value));
      // Update state
      setStoredValue(value);
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
