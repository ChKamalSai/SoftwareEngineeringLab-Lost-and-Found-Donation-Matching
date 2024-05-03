import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const Header =  ({ emailID, userType }) => {
  const [showOptions, setShowOptions] = useState(false);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
        <Text>Hl</Text>
        {/* <Image
          source={require('')}
          style={styles.logo}
        /> */}
      </TouchableOpacity>
      {showOptions && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={()=>{navigation.navigate('Login')}}>
            <Text style={styles.optionText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingRight:30,
    paddingTop:20,
    backgroundColor: 'white', // Header background color
  },
  logo: {
    width: 100,
    height: 40,
  },
  optionsContainer: {
    // flexDirection: 'row',
    // flex:1,
    position: 'absolute',
    // justifyContent: 'flex-end',
    right:20,
    top: 60, // Adjust as needed
    // left: 20, // Positioning at the top left
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 3,
    // zIndex: 2,
  },
  optionsContaner: {
    position: 'absolute',
    top: '100%', // Position it below the header
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 3,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Header;
