import React, { useEffect, useState } from "react";
import { TextInput } from "react-native";

const FuelConverterInput = ({ fuelUnit, value, onChangeText, ...props }) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    let conversionFactor = 1;
    if (fuelUnit === "L/mi") {
      conversionFactor = 0.4;
    } else if (fuelUnit === "L/100km") {
      conversionFactor = 4;
    } else if (fuelUnit === "mi/gal") {
      conversionFactor = 0.264172;
    }

    const numericText = parseFloat(value) * conversionFactor;
    setInternalValue(numericText.toString());
  }, [fuelUnit, value]);

  const handleOnChangeText = (text) => {
    let conversionFactor = 1;
    if (fuelUnit === "L/mi") {
      conversionFactor = 0.4;
    } else if (fuelUnit === "L/100km") {
      conversionFactor = 4;
    } else if (fuelUnit === "mi/gal") {
      conversionFactor = 0.264172;
    }

    const numericText = parseFloat(text) * conversionFactor;

    // Call the parent's onChangeText, if it exists
    if (onChangeText) {
      onChangeText(numericText.toString());
    }
  };

  return (
    <TextInput
      {...props}
      keyboardType="numeric"
      value={internalValue}
      onChangeText={handleOnChangeText}
    />
  );
};

export default FuelConverterInput;
