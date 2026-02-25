import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import { useLanguage } from '../../../utils/LanguageService';

const BackButton = () => {
  const navigation = useNavigation();
  const { translations } = useLanguage();
  const insets = useSafeAreaInsets();

  const handlePress = () => {
    navigation.navigate('Home')
  }

  return (
    <TouchableOpacity
      style={[styles.button, { paddingBottom: 20 + insets.bottom }]}
      onPress={handlePress}
    >
      <Text style={styles.text}>{translations.back}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    padding: 20,
    paddingBottom: 20,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0,
  },
  text: {
    color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
  },
});

export default BackButton;
