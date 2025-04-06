import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Platform } from 'react-native';
import { db } from './firebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const fetchFilteredOrders = async () => {
    try {
      const snapshot = await db.collection('salesHistory')
        .where('timestamp', '>=', startDate)
        .where('timestamp', '<=', new Date(endDate.getTime() + 86400000)) // include end date full day
        .orderBy('timestamp', 'desc')
        .get();

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      }));
      setOrders(data);
    } catch (error) {
      console.error('❌ Error fetching filtered sales:', error);
    }
  };

  useEffect(() => {
    fetchFilteredOrders();
  }, [startDate, endDate]);

  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>📅 Filter Sales by Date Range</Text>

      <View style={{ marginVertical: 10 }}>
        <Button title={`Start Date: ${startDate.toDateString()}`} onPress={() => setShowStartPicker(true)} />
        <Button title={`End Date: ${endDate.toDateString()}`} onPress={() => setShowEndPicker(true)} />
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}

      {orders.length === 0 ? (
        <Text style={{ marginTop: 20 }}>No orders found in this range.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ padding: 10 }}>
              <Text>🛒 {item.product} - {item.timestamp.toLocaleString()}</Text>
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
*/