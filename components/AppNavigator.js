import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CustomHeader from './CustomHeader';
import HomePage from './HomePage';
import DistancePage from './DistancePage';
import FillUpPage from './FillUpPage';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={{
          header: (props) => <CustomHeader {...props} />,
        }}
      />
      {/* Add the DistancePage screen */}
      <Stack.Screen
        name="DistancePage"
        component={DistancePage}
        options={{
          header: (props) => <CustomHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="FillUpPage"
        component={FillUpPage}
        options={{
          header: (props) => <CustomHeader {...props} />,
        }}
      />
    </Stack.Navigator>
    
  );
};

export default AppNavigator;
