import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import RegistrationLostAndFound from './RegistrationLostAndFound';
import RegistrationDonationHub from './RegistrationDonationHub';
import ManageLostItemScreen from './ManageLostItemScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegistrationL" component={RegistrationLostAndFound} />
        <Stack.Screen name="RegistrationD" component={RegistrationDonationHub} />
        <Stack.Screen name="ManageLostItem" component={ManageLostItemScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
