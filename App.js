import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './firebaseConfig';

import InventoryScreen from './InventoryScreen';
import SalesScreen from './SalesScreen';
import OrderHistoryScreen from './OrderHistoryScreen';
import LoginScreen from './LoginScreen';
import DashboardScreen from './DashboardScreen';


const Stack = createStackNavigator();


const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Inventory" component={InventoryScreen} />
            <Stack.Screen name="Sales" component={SalesScreen} />
            <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />

          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
