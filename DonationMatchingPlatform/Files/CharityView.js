import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import moment from 'moment';

const CharityView = ({ navigation, route }) => {
  const { emailID, userType } = route.params;
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`http://192.168.31.78:9090/donation/charity/donation/requests/${emailID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setRequests(data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.requestItem}>
      <Text style={styles.itemText}>Donation ID: {item.DonationId}</Text>
      <Text style={styles.itemText}>Quantity Requested: {item.QuantityRequested}</Text>
      <Text style={styles.itemText}>Request Status: {item.RequestStatus}</Text>
      <Text style={styles.itemText}>Donation Details:</Text>
      <Text style={styles.itemText}>Item Name: {item.ItemName}</Text>
      <Text style={styles.itemText}>Quantity: {item.Quantity}</Text>
      <Text style={styles.itemText}>Date of Production: {moment(item.DateandTimeOfProduction).format('MMMM Do YYYY, h:mm:ss a')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Donation Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.DonationId.toString()}
        renderItem={renderRequestItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text>No requests found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  requestItem: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 18,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
});

export default CharityView;
