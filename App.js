import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InventoryScreen from './InventoryScreen';
import SalesScreen from './SalesScreen';
import OrderHistoryScreen from './OrderHistoryScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Inventory" component={InventoryScreen} />
        <Stack.Screen name="Sales" component={SalesScreen} />
        <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

