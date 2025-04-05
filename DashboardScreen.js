import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { db } from './firebaseConfig';

const DashboardScreen = () => {
    const [todaysSalesCount, setTodaysSalesCount] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [topProducts, setTopProducts] = useState([]);
    const [recentSales, setRecentSales] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);

    

    

  
  useEffect(() => {
    const fetchDashboardData = async () => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
  
      try {
        const snapshot = await db.collection('salesHistory')
          .orderBy('timestamp', 'desc')
          .get();
  
        const allSales = snapshot.docs.map(doc => doc.data());
  
        // ✅ Total Sales Count
        setTotalSales(allSales.length);
  
        // ✅ Today's Sales Count
        const todaySales = allSales.filter(sale => {
          const time = sale.timestamp?.toDate?.(); // Optional chaining
          return time && time >= startOfDay && time <= endOfDay;
        });
        setTodaysSalesCount(todaySales.length);
  
        // ✅ Top Selling Products
        const productCountMap = {};
        allSales.forEach(sale => {
          if (sale.product) {
            productCountMap[sale.product] = (productCountMap[sale.product] || 0) + 1;
          }
        });
        const sortedProducts = Object.entries(productCountMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3); // Top 3
  
        setTopProducts(sortedProducts);
  
        // ✅ Recent Sales
        setRecentSales(snapshot.docs.slice(0, 5).map(doc => doc.data()));
      } catch (error) {
        console.error("🔥 Error loading dashboard:", error);
      }
    };
  
    // 🔄 Live inventory sync for stock alerts
    const unsubscribe = db.collection('inventory').onSnapshot(snapshot => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const lowStock = items.filter(item => item.stock < 5);
      setLowStockItems(lowStock);
    });
  
    fetchDashboardData();
  
    return () => unsubscribe();
  }, []);
  
  

  return (
    
    <View style={{ padding: 16 }}>
     <Text>📅 Today's Sales: {todaysSalesCount}</Text>
     <Text>📈 Total Sales: {totalSales}</Text>

     <Text style={{ marginTop: 10 }}>🏆 Top Products:</Text>
         {topProducts.map(([name, count], idx) => (
          <Text key={idx}>• {name}: {count} sold</Text>
        ))}

     <Text style={{ marginTop: 10 }}>🕒 Recent Sales:</Text>
         {recentSales.map((sale, idx) => (
         <Text key={idx}>• {sale.product} - {sale.timestamp?.toDate?.().toLocaleString()}</Text>
        ))}
      
   
     {lowStockItems.length > 0 && (
     <View style={{ marginTop: 20 }}>
      <Text style={{ color: 'red', fontWeight: 'bold' }}>⚠️ Low Stock Items:</Text>
         {lowStockItems.map(item => (
         <Text key={item.id}>• {item.name}: {item.stock} left</Text>
         ))}
     </View>
)}

    </View>
    
  );
};

export default DashboardScreen;
