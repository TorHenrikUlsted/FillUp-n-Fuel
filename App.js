import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LanguageProvider } from './components/LanguageProvider';
import AppNavigator from './components/AppNavigator';

const App = () => {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </LanguageProvider>
  );
};

export default App;
