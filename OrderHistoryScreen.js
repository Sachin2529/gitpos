import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { db } from './firebaseConfig';

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]); // ✅ Define setOrders

  useEffect(() => {
    const unsubscribe = db.collection('salesHistory')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        if (!snapshot.empty) {
          setOrders(snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date(), // ✅ Ensure timestamp is converted
          })));
        } else {
          setOrders([]);
        }
      }, error => {
        console.error("🔥 Firestore error:", error);
      });

    return () => unsubscribe();
  }, []);

  return (
    <View>
      {orders.length === 0 ? (
        <Text>No Order History Available</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ padding: 10 }}>
              <Text>{item.product} - {item.timestamp.toLocaleString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default OrderHistoryScreen;


/*import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { db } from './firebaseConfig';

const OrderHistoryScreen = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection('salesHistory')
      .orderBy('timestamp', 'desc') // Sort by latest sales
      .onSnapshot(snapshot => {
        if (!snapshot || snapshot.empty) {  
          console.warn("⚠️ No order history found!");
          setHistory([]);  // ✅ Set empty array to avoid errors
        } else {
          setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      }, error => {
        console.error("🔥 Firestore error:", error);
      });

    return () => unsubscribe();
  }, []);

  return (
    <View>
      {history.length === 0 ? (
        <Text>No Order History Available</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ padding: 10 }}>
              <Text>{item.product} - Sold at: {new Date(item.timestamp.toDate()).toLocaleString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default OrderHistoryScreen;
29-03

*/