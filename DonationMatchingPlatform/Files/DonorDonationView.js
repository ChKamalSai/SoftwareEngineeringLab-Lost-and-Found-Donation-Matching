import  { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity,Alert} from 'react-native';
// import axios from 'axios';

const CharityRequests = ({ route }) => {
  const { donationId } = route.params;
  const [requests, setRequests] = useState([]);
  
  useEffect(() => {
    fetchRequests();
    const intervalId = setInterval(fetchRequests, 30000); 

    return () => clearInterval(intervalId); 
  }, [donationId]);

  // useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`http://192.168.31.78:9090/donation/view/${donationId}/requests`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setRequests(data.results);
        console.log(data.results);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    // fetchRequests();
  // }, [donationId]);

  const handleAcceptRequest = async (requestId) => {
    console.log(donationId);
    try {
      const response = await fetch(`http://192.168.80.124:9090/donation/view/accept-request/${requestId}`, {
        method: 'POST',
        body:JSON.stringify({id:donationId}),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      // if(dat?a)
      // if(data.success===true){
        fetchRequests();
      // }
      console.log('Request accepted:', data);
      
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };
  
  const handleDenyRequest = async (requestId) => {
    try {
      const response = await fetch(`http://192.168.80.124:9090/donation/view/deny-request/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if(data.success===true){
        fetchRequests();
      }
      console.log('Request denied:', data);
    } catch (error) {
      console.error('Error denying request:', error);
    }
  };
  
  const renderRequestItem = ({ item }) => (
    <View style={styles.requestItem}>
      <Text>Email: {item.Email}</Text>
      <Text>Quantity Requested: {item.QuantityRequested}</Text>
      <Text>Request Status: {item.RequestStatus}</Text>
      <Text>Order Taken: {item.OrderTaken}</Text>
      {item.RequestStatus==='pending'?(<View>
        <TouchableOpacity onPress={() => handleAcceptRequest(item.ID)} style={[styles.button, styles.acceptButton]}>
        <Text style={styles.buttonText}>Accept Request</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDenyRequest(item.ID)} style={[styles.button, styles.denyButton]}>
        <Text style={styles.buttonText}>Deny Request</Text>
      </TouchableOpacity>
      </View>
      ):null}
      
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRequestItem}
        ListEmptyComponent={<Text>No donations found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  requestItem: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: 'blue',
  },
  denyButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default CharityRequests;