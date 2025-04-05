import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { db } from './firebaseConfig';
import auth from '@react-native-firebase/auth';

const InventoryScreen = ({ navigation })  => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection('inventory').onSnapshot((snapshot) => {
      setInventory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const updateStock = async (id, stock) => {
    await db.collection('inventory').doc(id).update({ stock: stock + 1 }); 
  };

  const handleLogout = () => {
    auth().signOut();
  };

  return (
    <View>
      <Button title="Go to Sales" onPress={() => navigation.navigate('Sales')} />
      <Button title="Go to SALEShistory" onPress={() => navigation.navigate('OrderHistoryScreen')} />
      <Button title="Dashboard" onPress={() => navigation.navigate('Dashboard')} />
      <Button title="Logout" onPress={handleLogout} />   
      <FlatList
        data={inventory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text>{item.name} - Stock: {item.stock}</Text>
            <Button title="Update Stock" onPress={() => updateStock(item.id, item.stock)} />
          </View>
        )}
      />
      <Button title="Logout" onPress={handleLogout} />  
    </View>
  );
};

export default InventoryScreen;