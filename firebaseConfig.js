import { getFirestore, collection, addDoc } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Firestore Database
const db = getFirestore(); // ✅ Modular Firestore Initialization

// Function to Add Products to Firestore (Run Once)
const addProductsToFirestore = async () => {
  const products = [
    { name: "Burger", stock: 0 },
    { name: "Pizza", stock: 0 },
    { name: "Fries", stock: 0 },
    { name: "Pasta", stock: 0 }
  ];

  try {
    for (const product of products) {
      await addDoc(collection(db, "inventory"), product);
    }
    console.log("✅ Products Added to Firestore with Stock = 0");
  } catch (error) {
    console.error("❌ Error adding products:", error);
  }
  const sellProduct = async (id, stock, name) => {
    if (stock > 0) {
      await db.collection('inventory').doc(id).update({ stock: stock - 1 });
  
      // ✅ Add sale record to salesHistory
      await db.collection('salesHistory').add({
        product: name,
        timestamp: new Date(),
      });
    } else {
      alert("Out of stock!");
    }
  };
  
};
// Firebase Authentication
export { db, auth };

// Uncomment this line, run once, then comment it back
// addProductsToFirestore();
/* import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Firestore Database
const db = firestore();

// Firebase Authentication
export { db, auth };

// Function to Add Products to Firestore (Run Once)
const addProductsToFirestore = async () => {
  const products = [
    { name: "Burger", stock: 0 },
    { name: "Pizza", stock: 0 },
    { name: "Fries", stock: 0 },
    { name: "Pasta", stock: 0 }
  ];

  products.forEach(async (product) => {
    await db.collection('inventory').add(product);
  });

  console.log("✅ Products Added to Firestore with Stock = 0");
};

// Uncomment this line, run once, then comment it back
 //addProductsToFirestore(); */

