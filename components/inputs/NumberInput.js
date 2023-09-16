import React from 'react';
import { TextInput } from 'react-native';

const NumberInput = (props) => {
  const handleOnChangeText = (text) => {
    // Call the parent's onChangeText, if it exists
    if (props.onChangeText) {
      props.onChangeText(text);
    }
  };

  return (
    <TextInput
      {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
      keyboardType='numeric'
      onChangeText={handleOnChangeText}
    />
  );
};

export default NumberInput;
