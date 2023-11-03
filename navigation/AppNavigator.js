import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CustomHeader from "../components/organisms/header/Header";
import HomePage from "../components/pages/HomePage";
import DistancePage from "../components/pages/DistancePage";
import FillUpPage from "../components/pages/FillUpPage";
import InfoPage from "../components/pages/InfoPage";

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

      <Stack.Screen
        name="InfoPage"
        component={InfoPage}
        options={{
          header: (props) => <CustomHeader {...props} />,
        }}
      />

    </Stack.Navigator>
  );
};

export default AppNavigator;
