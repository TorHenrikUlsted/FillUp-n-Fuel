import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageService } from './utils/LanguageService';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <LanguageService>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </LanguageService>
    </SafeAreaProvider>
  );
};

export default App;
