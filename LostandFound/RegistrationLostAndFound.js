import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const RegistrationLostAndFound = ({ navigation }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');

 
  const handleRegistration = async () => {
    try {
     
      if (!name || !mobile || !email || !gender || !password || !reenterPassword) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        Alert.alert('Error', 'Please enter a strong password. Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.');
        return;
      }
      if (password !== reenterPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
  
      
      const emailRegex = /^[^\s@]+@uohyd\.ac\.in$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Please enter a valid University of Hyderabad email address ending with uohyd.ac.in');
        return;
      }
  
     
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(mobile)) {
        Alert.alert('Error', 'Please enter a valid 10-digit phone number');
        return;
      }
      
      
      const checkEmailResponse = await fetch('http://10.5.1.77:3001/lostAndFound/checkEmailLostAndFound', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      
     
      if (!checkEmailResponse.ok) {
        throw new Error('Failed to check email availability');
      }
      
      const contentType = checkEmailResponse.headers.get('content-type');
      let checkEmailData;
      if (contentType && contentType.includes('application/json')) {
      
        checkEmailData = await checkEmailResponse.json();
       
      } else {
       
        const text = await checkEmailResponse.text();
        throw new Error(`Server responded with non-JSON data: ${text}`);
      }
          
      if (checkEmailData.exists) {
        Alert.alert('Error', 'Email is already registered');
        return;
      }
  
      const registerResponse = await fetch('http://10.5.1.77:3001/lostAndFound/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          mobile: mobile,
          email: email,
          gender: gender,
          password: password,
        }),
      });
  
      if (!registerResponse.ok) {
        throw new Error('Failed to register user');
      }
  
      const registerData = await registerResponse.json();
  
      Alert.alert('Registration Successful', registerData.message);
   
      navigation.navigate('Login'); 
    } catch (error) {
     
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'An error occurred');
    }
  };
  
  
  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>User Registration</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        onChangeText={setName}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        onChangeText={setMobile}
        value={mobile}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="University Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />
      <View style={styles.genderContainer}>
        <Text style={styles.genderLabel}>Gender:</Text>
        <TouchableOpacity
          style={[styles.genderOption, gender === 'Male' && styles.selectedOption]}
          onPress={() => setGender('Male')}
        >
          <Text style={styles.optionText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderOption, gender === 'Female' && styles.selectedOption]}
          onPress={() => setGender('Female')}
        >
          <Text style={styles.optionText}>Female</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderOption, gender === 'Others' && styles.selectedOption]}
          onPress={() => setGender('Others')}
        >
          <Text style={styles.optionText}>Others</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Re-enter Password"
        onChangeText={setReenterPassword}
        value={reenterPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegistration}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 15,
    },
    genderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    genderLabel: {
      marginRight: 10,
    },
    genderOption: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#007bff',
      marginRight: 10,
    },
    selectedOption: {
      backgroundColor: '#C0D9E8',
      
    },
    optionText: {
      color: '#007bff',
    },
    button: {
      width: '100%',
      height: 50,
      backgroundColor: '#007bff',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  
  export default RegistrationLostAndFound;
  