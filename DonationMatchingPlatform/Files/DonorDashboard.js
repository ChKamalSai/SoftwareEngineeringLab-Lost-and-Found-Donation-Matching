import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,StatusBar } from 'react-native';
import Header from './Header';
import { SafeAreaView } from 'react-native-safe-area-context';
const DonorDashboard = ({ navigation,route }) => {
const {emailID,userType}=route.params;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor='black' />
      {/* <View style={{ flex: 1 }}> */}
      <Header emailID={emailID} userType={userType} />
        <View style={styles.container}>
          <TouchableOpacity
            style={[styles.option, styles.viewOption]}
          onPress={() => navigation.navigate('DonorUpload',{emailID:emailID,userType:userType})}
          >
            <Text style={styles.optionText}>Upload</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, styles.viewOption]}
          onPress={() => navigation.navigate('DonorView',{emailID:emailID,userType:userType})}
          >
            <Text style={styles.optionText}>View</Text>
          </TouchableOpacity>

        </View>
      {/* </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "#f5f5f5"
  },
  option: {
    width: 400,
    height: 100,
    marginBottom: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
  optionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  viewOption: {
    backgroundColor: '#3498db',
  },
  uploadOption: {
    backgroundColor: '#2ecc71',
  },
});

export default DonorDashboard;
