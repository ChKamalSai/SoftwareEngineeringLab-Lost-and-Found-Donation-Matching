import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLostAndFound, setIsLostAndFound] = useState(true);

  const handleToggle = () => {
    setIsLostAndFound(!isLostAndFound);
  };
  const handleLogin = async () => {
    try {
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('Is Lost and Found:', isLostAndFound);
  
      const loginEndpoint = isLostAndFound ? 'http://192.168.69.124:3001/lostAndFound/login' : 'http://192.168.69.124:3001/donationHub/login';
  
      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to log in');
      }
  
      const data = await response.json();
  
      console.log('Login response:', data);
  
      
      navigation.navigate(isLostAndFound ? 'ManageLostItem' : 'ManageDonationItem',{email:email});
    } catch (error) {
      console.error('Login error:', error.message || 'An error occurred');
    }
  };
  
  

  const handleRegister = () => {
    
    if (isLostAndFound) {
      navigation.navigate('RegistrationL'); 
    } else {
      navigation.navigate('RegistrationD'); 
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{isLostAndFound ? 'Lost and Found' : 'Donation Hub'}</Text>
      <TextInput
        style={styles.input}
        placeholder="University Email (uohyd.ac.in)"
        onChangeText={(text) => setEmail(text)}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={handleToggle}>
        <Text style={styles.toggleButton}>
          Switch to {isLostAndFound ? 'Donation Hub' : 'Lost and Found'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.registerButton}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  toggleButton: {
    marginTop: 10,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  registerButton: {
    marginTop: 20,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
