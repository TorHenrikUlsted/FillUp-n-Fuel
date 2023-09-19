import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LanguageService } from './utils/LanguageService';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <LanguageService>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </LanguageService>
  );
};

export default App;
