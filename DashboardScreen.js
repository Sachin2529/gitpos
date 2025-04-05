import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { db } from './firebaseConfig';

const DashboardScreen = () => {
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection('salesHistory').onSnapshot(snapshot => {
      const data = snapshot.docs.map(doc => doc.data());
      setSalesData(data);
      setTotalSales(data.length);

      const productCount = {};
      data.forEach(sale => {
        productCount[sale.product] = (productCount[sale.product] || 0) + 1;
      });

      const sorted = Object.entries(productCount)
        .sort((a, b) => b[1] - a[1])
        .map(([product, count]) => ({ product, count }));

      setTopProducts(sorted);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>📊 Dashboard</Text>
      <Text>Total Sales: {totalSales}</Text>

      <Text style={{ marginTop: 16, fontWeight: 'bold' }}>Top Products:</Text>
      {topProducts.slice(0, 3).map((item, index) => (
        <Text key={index}>{item.product}: {item.count}</Text>
      ))}

      <Text style={{ marginTop: 16, fontWeight: 'bold' }}>Recent Sales:</Text>
      <FlatList
        data={salesData.slice(-5).reverse()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text>{item.product} - {new Date(item.timestamp?.seconds * 1000).toLocaleString()}</Text>
        )}
      />
    </View>
  );
};

export default DashboardScreen;
