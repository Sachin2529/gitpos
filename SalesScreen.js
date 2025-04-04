import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { db } from './firebaseConfig';

const SalesScreen = () => {
  const [products, setProducts] = useState([]);  

  useEffect(() => {
    const unsubscribe = db.collection('inventory') // ✅ Correct Firestore Collection
      .onSnapshot(snapshot => {
        if (!snapshot || snapshot.empty) {  
          console.warn("⚠️ No products found in inventory!");
          setProducts([]);  
        } else {
          setProducts(snapshot.docs.map(doc => ({
            id: doc.id, 
            ...doc.data(),
          })));
        }
      }, error => {
        console.error("🔥 Firestore error:", error);
      });

    return () => unsubscribe();
  }, []);

  const sellProduct = async (id, stock, name) => {
    if (stock > 0) {
      try {
        // ✅ Update Inventory Stock
        await db.collection('inventory').doc(id).update({ stock: stock - 1 });
  
        // ✅ Add Sale Record to salesHistory Collection
        await db.collection('salesHistory').add({
          product: name,
          timestamp: new Date(), // ✅ Ensure timestamp exists
        });
  
        alert(`✅ Sold 1 ${name}`);
      } catch (error) {
        console.error("🔥 Error recording sale:", error);
        alert("❌ Error processing sale. Try again!");
      }
    } else {
      alert("❌ Out of stock!");
    }
  };
  
  /*const sellProduct = async (id, stock, name) => {  
    if (stock > 0) {
      try {
        await db.collection('inventory').doc(id).update({ stock: stock - 1 });

        // ✅ Correctly adding sale record to `salesHistory`
        await db.collection('salesHistory').add({
          product: name,
          timestamp: new Date(),
        });

        console.log(`✅ Sale recorded: ${name}`);
        alert(`✅ Sold 1 ${name}`);
      } catch (error) {
        console.error("❌ Firestore error:", error);
        alert("❌ Error recording sale.");
      }
    } else {
      alert("❌ Out of stock!");
    }
  };*/

  return (
    <View>
      {products.length === 0 ? (
        <Text>No Products Available</Text>  
      ) : (
        <FlatList
          data={products}  
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ padding: 10 }}>
              <Text>{item.name} - Stock: {item.stock}</Text>
              <Button title="Sell" onPress={() => sellProduct(item.id, item.stock, item.name)} />
            </View>
          )}
        />
      )}
    </View>
  );
};

export default SalesScreen;

/*import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { db } from './firebaseConfig';

const SalesScreen = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection('inventory').onSnapshot(snapshot => {
      if (snapshot && !snapshot.empty) {
        setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        setProducts([]);  // Prevent errors if Firestore is empty
      }
    });

    return () => unsubscribe();
  }, []);

  const sellProduct = async (id, stock, name) => {
    if (stock > 0) {
      try {
        await db.collection('inventory').doc(id).update({ stock: stock - 1 });
  
        // ✅ Add sale record to salesHistory
        await db.collection('salesHistory').add({
          product: name,
          timestamp: new Date(),
        });
  
        console.log(`✅ Sale recorded: ${name}`);
        alert(`✅ Sold 1 ${name}`);
      } catch (error) {
        console.error("❌ Firestore error:", error);
        alert("❌ Error recording sale.");
      }
    } else {
      alert("❌ Out of stock!");
    }


  };
  

 /* const sellProduct = async (id, stock) => {
    if (stock > 0) {
      await db.collection('inventory').doc(id).update({ stock: stock - 1 });
    } else {
      alert("❌ Out of stock!");
    }
  };*/

 /* const sellProduct = async (id, stock, name) => {
    if (stock > 0) {
      await db.collection('inventory').doc(id).update({ stock: stock - 1 });
  
      // ✅ Store sales history in Firestore
      await db.collection('salesHistory').add({
        product: name,
        timestamp: new Date(),
      });
  
      alert(`✅ Sold 1 ${name}`);
    } else {
      alert("❌ Out of stock!");
    }
  };
  

  return (
    <View>
      <FlatList
        data={products}  // ✅ Fetch from inventory
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text>{item.name} - Stock: {item.stock}</Text>
            <Button title="Sell" onPress={() => sellProduct(item.id, item.stock)} />
          </View>
        )}
      />
    </View>
  );
};

export default SalesScreen;*/