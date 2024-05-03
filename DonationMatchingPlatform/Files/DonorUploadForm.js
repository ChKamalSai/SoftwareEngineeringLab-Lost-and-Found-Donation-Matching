import { useState, useRef, useTransition } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Pressable,ScrollView } from 'react-native';
import styles from './FormStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
const FormScreen = ({ navigation, route }) => {
  const {emailID, userType} = route.params;
  const [itemName, setItemName] = useState('');
  const [quantityType, setQuantityType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [errors, setErrors] = useState({});
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('')
  const onChange = (e, selectedDate) => {
    setDate(selectedDate);
    setMode('')
  };

  const validateForm = () => {
    const errors = {};

    if (!itemName.trim()) {
      errors.itemName = 'Item name is required';
    } else if (itemName.length > 30) {
      errors.itemName = 'Item name should not exceed 30 characters';
    }

    if (!quantityType.trim()) {
      errors.quantityType = 'Quantity type is required';
    } else if (quantityType.length > 30) {
      errors.quantityType = 'Quantity type should not exceed 30 characters';
    }

    if (!quantity.trim()) {
      errors.quantity = 'Quantity is required';
    } else if (isNaN(quantity) || parseInt(quantity) <= 0) {
      errors.quantity = 'Quantity should be a positive integer';
    }
    else if (quantity.length > 20) {
      errors.quantity = "Quantity should not exceed 20 characters"
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = () => {
    validateForm()
    fetchResult()
    setMode('');
  };

  const fetchResult = async () => {
    try {
      const request = await fetch(`http://192.168.31.78:9090/donation/upload/${userType}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: emailID,
          // userType:userType,
          itemName: itemName,
          quantityType: quantityType,
          quantity: quantity,
          date: date,
        })
      })
      const response = await request.json();
      console.log(response);
      if (response.success) {
        Alert.alert(response.success);
        navigation.navigate('DonorDashboard', { emailID: emailID, userType: userType })
      }
      else {
        Alert.alert(response.error)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Enter Item Name</Text>
        <TextInput
          style={styles.input}
          value={itemName}
          onChangeText={text => setItemName(text)}
        />
        {errors.itemName && <Text style={styles.error}>{errors.itemName}</Text>}

        <Text style={styles.label}>Enter Quantity Type</Text>
        <TextInput
          style={styles.input}
          value={quantityType}
          onChangeText={text => setQuantityType(text)}
        />
        {errors.quantityType && <Text style={styles.error}>{errors.quantityType}</Text>}

        <Text style={styles.label}>Enter Quantity</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={text => setQuantity(text)}
          keyboardType="numeric"
        />
        {errors.quantity && <Text style={styles.error}>{errors.quantity}</Text>}

        <Text style={styles.label} >Select Production Date</Text>
        <Pressable style={[styles.button, { backgroundColor: 'white' }]} onPress={() => setMode('date')}>
          <Text style={styles.input}> {date.toLocaleDateString()}</Text>
        </Pressable>

        <Text style={styles.label} >Select Production Time</Text>
        <Pressable style={[styles.button, { backgroundColor: 'white' }]} onPress={() => setMode('time')}>
          <Text style={styles.input}>{date.toLocaleTimeString()}</Text>
        </Pressable>

        {mode && (<DateTimePicker
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
          maximumDate={new Date()}
        />)}

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </View>
    </View>
    </ScrollView>
  );
};

export default FormScreen;
