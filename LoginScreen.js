import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { auth } from './firebaseConfig';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.replace('Inventory');  // redirect on success
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'white' }}>
      <Text>Email</Text>
      <TextInput
        placeholder="Enter email"
        onChangeText={setEmail}
        value={email}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Text>Password</Text>
      <TextInput
        placeholder="Enter password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Login" onPress={login} />
    </View>
  );
};

export default LoginScreen;

