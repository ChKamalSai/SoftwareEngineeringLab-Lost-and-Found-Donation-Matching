import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet ,Alert} from 'react-native';
import moment from 'moment'
// import axios from 'axios';

const DonationsList = ({ navigation, route }) => {
  const { emailID, userType } = route.params;
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchResult()
  }, []);

  const fetchResult = async () => {
    try {
      const request = await fetch(`http://192.168.31.78:9090/donation/view/${userType}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          emailID: emailID,
          userType: userType
        })
      })
      const response = await request.json();
      // console.log(response.r)
      setDonations(response.result);
    } catch (error) {
      console.error(error)
    }
  }

  const handleDonationPress = (donationId) => {
    navigation.navigate('DonorDonationView', { donationId: donationId, emailID: emailID, userType: userType });
  };
  const handleDeleteDonation = async (donationId) => {
    try {
      const response = await fetch(`http://192.168.31.78:9090/donation/view/delete/${donationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if(data.success==true){
      Alert.alert('Success', 'Donation deleted successfully.');
      fetchResult();}
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to delete donation. Please try again.');
    }
  };
  const renderDonationItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity  onPress={() => handleDonationPress(item.ID)}>
        <Text style={styles.cardText}>Item Name: {item.ItemName}</Text>
        <Text style={styles.cardText}>Quantity: {item.Quantity} {item.QuantityType}</Text>
        <Text style={styles.cardText}>Date and Time of Production:{moment(item.DateandTimeOfProduction).format('MMMM Do YYYY, h:mm:ss a')}</Text>
        <Text style={styles.cardText}>Date and Time of Entry: {moment(item.DateandTimeOfProduction).format('MMMM Do YYYY, h:mm:ss a')}</Text>
        <Text style={styles.cardText}>Remaining Quantity:{item.RemainingQuantity}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteDonation(item.ID)}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={donations}
        keyExtractor={(item) => item.ID.toString()}
        renderItem={renderDonationItem}
        ItemSeparatorComponent={
          <View
            style={{
              height: 16,
            }}
          />
        }
        ListEmptyComponent={<Text>No Items Found</Text>}
      // ListHeaderComponent={
      //   <Text style={styles.headerText}>View Lo</Text>
      // }
      // ListFooterComponent={
      //   <Text style={styles.footerText}>End of list</Text>
      // }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  donationItem: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
    // color:'black'
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    // marginBottom: 16,
    borderWidth: 1,
  },
  cardText: {
    fontSize: 18,
  },
  headerText: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 12,
  },
  footerText: {
    fontSize: 24,
    textAlign: "center",
    marginTop: 12,
  },
  sectionHeaderText: {
    backgroundColor: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DonationsList;