import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const RightArrowButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Svg width="50" height="50" viewBox="0 0 30 24">
        <Path d="M18 2 L28 12 L18 22 M28 12 L-2 12" fill="none" stroke="black" stroke-width="1" />
      </Svg>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RightArrowButton;
