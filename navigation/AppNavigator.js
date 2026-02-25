import React from "react";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import CustomHeader from "../components/organisms/header/Header";
import HomePage from "../components/pages/HomePage";
import DistancePage from "../components/pages/DistancePage";
import FillUpPage from "../components/pages/FillUpPage";
import InfoPage from "../components/pages/InfoPage";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        header: (props) => <CustomHeader {...props} />,
        cardStyleInterpolator: ({ current, layouts }) => ({
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        }),
      }}
    >

      <Stack.Screen
        name="Home"
        component={HomePage}
      />
    
      <Stack.Screen
        name="DistancePage"
        component={DistancePage}
      />

      <Stack.Screen
        name="FillUpPage"
        component={FillUpPage}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOSInverted,
        }}
      />

      <Stack.Screen
        name="InfoPage"
        component={InfoPage}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />

    </Stack.Navigator>
  );
};

export default AppNavigator;
