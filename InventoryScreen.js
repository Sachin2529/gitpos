import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { db } from './firebaseConfig';

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

  return (
    <View>
      <Button title="Go to Sales" onPress={() => navigation.navigate('Sales')} />
      <Button title="Go to SALEShistory" onPress={() => navigation.navigate('OrderHistoryScreen')} />
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
    </View>
  );
};

export default InventoryScreen;