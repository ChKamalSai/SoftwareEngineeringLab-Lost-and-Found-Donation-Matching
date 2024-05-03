import React, { useState, useEffect } from 'react';
import { Linking } from 'react-native';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const ManageLostItemScreen = ({ route }) => {
  const { email } = route.params;
  const [selectedOption, setSelectedOption] = useState('upload');
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [location, setLocation] = useState('');
  const [lostItems, setLostItems] = useState([]);
  const [uploadOption, setUploadOption] = useState('ownLostItem');
  const [itemPhotoUri, setItemPhotoUri] = useState(null);
  const [imageSelected, setImageSelected] = useState(false);
  const [viewOption, setViewOption] = useState('yourUploads');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (selectedOption === 'view') {
      fetchItems();
    }
    
  }, [selectedOption, viewOption]);

 // Function to mark a notification as read
const markNotificationAsRead = async (notificationId) => {
  try {
    await axios.put(`http://192.168.69.124:3001/lostAndFound/notifications/${notificationId}`);
    fetchNotifications(); // Refresh the notifications to update the state
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

// Function to view a notification
const viewNotification = (notification) => {
  Alert.alert("Notification", notification.message, [{ text: 'OK', onPress: () => markNotificationAsRead(notification.id) }]);
};

// useEffect to fetch notifications
useEffect(() => {
  fetchNotifications();
}, [email]); // Assuming email changes signify a different user login

// Fetch Notifications
const fetchNotifications = async () => {
  try {
    const response = await axios.get(`http://192.168.69.124:3001/lostAndFound/notifications/${email}`);
    setNotifications(response.data);
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleUploadOptionChange = (itemValue) => {
    setUploadOption(itemValue);
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true
    });
    if (pickerResult.cancelled) {
      alert('You did not select any image.');
      setImageSelected(false);
      setItemPhotoUri(null);
    } else {
      const base64Image = `data:image/jpeg;base64,${pickerResult.base64}`;
      console.log(base64Image);
      setItemPhotoUri(base64Image);
      setImageSelected(true);
    }
  };

  const handleSubmission = async () => {
    // Determine the type based on the selected upload option
    const type = uploadOption === 'ownLostItem' ? 'own' : 'anonymous';
  
    // Prepare the item data including the determined type
    const itemData = {
      itemName,
      itemDescription,
      location,
      email,
      itemPhoto: itemPhotoUri,
      type // Set the type here
    };
  
    try {
      const response = await axios.post('http://192.168.69.124:3001/lostAndFound/items', itemData);
      if (response.status === 201) {
        alert('Item uploaded successfully');
        setItemName('');
        setItemDescription('');
        setLocation('');
        setItemPhotoUri(null);
        setImageSelected(false);
      } else {
        console.error('Failed to upload item');
      }
    } catch (error) {
      console.error('Error uploading item:', error);
    }
  };
  
  const andleFound = async (item) => {
    Alert.alert(
      'Confirm Found',
      'Have you found your item and cross-checked it?',
      [
        { text: 'Yes', onPress: () => markItemAsFound(item) },
        { text: 'No' }
      ],
      { cancelable: false }
    );
  };
  const markItemAsFound = async (item) => {
    Alert.alert("Confirmation", "Have you found your item and cross-checked it?",
        [
            {
                text: "Yes", onPress: async () => {
                    const response = await axios.put(`http://192.168.69.124:3001/lostAndFound/items/markFound/${item.item_id}`);
                    if (response.status === 200) {
                        alert('Item status updated to found!');
                        fetchItems(); // Refresh items list
                    } else {
                        alert('Failed to update item status.');
                    }
                }
            },
            { text: "No" }
        ]
    );
};
  const fetchItems = async () => {
    let viewOptionParam = viewOption === 'yourUploads' ? 'own' : 'others';
    const response = await axios.get(`http://192.168.69.124:3001/lostAndFound/items?view=${viewOptionParam}&email=${email}`);
    if (response.data) {
      setLostItems(response.data);
    }
  };

  const handleFound = async (item) => {
    try {
      const response = await axios.get(`http://192.168.69.124:3001/lostAndFound/contact/${item.email}`);
      if (response.data) {
        Alert.alert(
          'Contact Owner',
          'Select an action:',
          [
            {
              text: item.type === 'own' ? 'Call Owner' : 'Call User',
              onPress: () => Linking.openURL(`tel:${item.type === 'own' ? response.data.mobile : item.mobile}`)
            },
            {
              text: item.type === 'own' ? 'Email Owner' : 'Email User',
              onPress: () => Linking.openURL(`mailto:${item.type === 'own' ? response.data.email : item.email}`)
            },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      } else {
        Alert.alert('Error', 'Contact information not available');
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
      Alert.alert('Error', 'Failed to fetch contact information');
    }
  };
  

const handleFoundClick = async (item) => {
  console.log(item.item_id);
  try {
    const response = await axios.post(`http://192.168.69.124:3001/lostAndFound/found/${item.item_id}`, {
      finderEmail: email  // Make sure `email` is defined in your scope
    });
    if (response.status === 201) {
      // Fetch finder details
      const finderResponse = await axios.get(`http://192.168.69.124:3001/lostAndFound/contact/${email}`);
      if (finderResponse.data) {
        const finder = finderResponse.data;

        // Define subject and message based on item type
        let subject, message;
        if (item.type === 'own') {
          // Subject for owned item
          subject = 'Your item has been Found';
          message = `Your item "${item.item_name}" was found by ${finder.name} (${finder.mobile}, ${finder.email}).`;
        } else {
          // Subject for anonymous item
          subject = 'Owner found their item';
          message = `Looks like the owner found their item "${item.item_name}". Owner's details: Name - ${finder.name}, Email - (${finder.mobile}, Phone - ${finder.email})`;
        }

        // Prepare email options
        const mailOptions = {
          from: '21mcme10@uohyd.ac.in',
          to: item.email,
          subject: subject,
          text: message
        };

        // Send email
        const emailResponse = await axios.post(`http://192.168.69.124:3001/send-email`, mailOptions);

        if (emailResponse.status === 200) {
          alert('Notification sent to the owner.');
          fetchNotifications(); // Fetch notifications to update local state
        } else {
          console.log('Error sending email:', emailResponse.data);
          alert('Failed to send email notification.');
        }
      } else {
        alert('Finder details not found.');
      }
    } else {
      console.log('Response:', response.data.message);
    }
  } catch (error) {
    console.error('Error in handleFoundClick:', error);
    alert('Failed to create notification:', error.message);
  }
};




  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Manage Lost Items</Text>
      {notifications.length > 0 && (
        <TouchableOpacity style={styles.notificationIcon} onPress={() => viewNotification(notifications[0])}>
          <Text style={styles.notificationText}>🔴</Text>
        </TouchableOpacity>
      )}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionButton, selectedOption === 'upload' && styles.selectedOption]}
          onPress={() => handleOptionChange('upload')}
        >
          <Text style={styles.optionText}>UPLOAD</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, selectedOption === 'view' && styles.selectedOption]}
          onPress={() => handleOptionChange('view')}
        >
          <Text style={styles.optionText}>VIEW</Text>
        </TouchableOpacity>
      </View>

      {selectedOption === 'upload' && (
        <View style={styles.uploadForm}>
          <Picker
            selectedValue={uploadOption}
            style={styles.input}
            onValueChange={handleUploadOptionChange}
          >
            <Picker.Item label="Upload Own Lost Item" value="ownLostItem" />
            <Picker.Item label="Upload Anonymous Item" value="anonymousItem" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="1. Enter Item Name"
            onChangeText={setItemName}
            value={itemName}
          />
          <TouchableOpacity style={styles.input} onPress={handleImagePicker}>
            <Text>{itemPhotoUri ? "Photo selected" : "Select Item Photo"}</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.input, styles.largeInput]}
            placeholder="2. Enter Item Description"
            onChangeText={setItemDescription}
            value={itemDescription}
            multiline={true}
          />
          <TextInput
            style={styles.input}
            placeholder={uploadOption === 'anonymousItem' ? "3. Enter Location Where It Was Found" : "3. Enter Location Where It Was Lost"}
            onChangeText={setLocation}
            value={location}
          />
          <Button title="Submit" onPress={handleSubmission} />
        </View>
      )}

      {selectedOption === 'view' && (
        <View>
          <View style={styles.viewOptionsContainer}>
            <TouchableOpacity
              style={[styles.viewOptionButton, viewOption === 'yourUploads' && styles.selectedViewOption]}
              onPress={() => setViewOption('yourUploads')}
            >
              <Text style={[styles.optionText, viewOption === 'yourUploads' && styles.selectedOptionText]}>Your Uploads</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewOptionButton, viewOption === 'otherUploads' && styles.selectedViewOption]}
              onPress={() => setViewOption('otherUploads')}
            >
              <Text style={[styles.optionText, viewOption === 'otherUploads' && styles.selectedOptionText]}>Other Uploads</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={lostItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
               <Text style={styles.itemName}>Item Name: {item.item_name}</Text>
               <Text style={styles.itemDescription}>Item Description: {item.item_description}</Text>
                <Text style={styles.itemLocation}>
                   {item.type === 'own' ? 'Location Lost at: ' : 'Location found at: '}
                       {item.item_location}
                       </Text>

                {viewOption === 'yourUploads' && (
                  <Button title="Mark as Found" onPress={() => andleFound(item)} />
                )}
               {viewOption === 'otherUploads' && (
  <Button 
    title={item.type === 'anonymous' ? "I am the Owner?" : "Found?"} 
    onPress={() => handleFoundClick(item).then(() => handleFound(item))} 
  />
)}

              </View>
            )}
            style={styles.itemList}
          />
        </View>
      )}
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  optionButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  selectedOption: {
    backgroundColor: 'lightblue',
  },
  optionText: {
    fontWeight: 'bold',
    color: 'blue',
  },
  selectedOptionText: {
    color: 'black',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  largeInput: {
    height: 100,
  },
  picker: {
    borderColor: 'blue',
    borderWidth: 2,
    marginBottom: 10,
  },
  itemList: {
    width: '100%', // Ensure FlatList covers the full width
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 20, // Increased padding for more spacious feel
    marginBottom: 20, // Increased gap between items
    borderRadius: 10, // Optional: Adds rounded corners for a smoother look
    backgroundColor: '#fff', // Adds a background color to each item container
  },
  uploadForm: {
    width: '100%', // Updated to full width
  },
  imageSelectedText: {
    marginBottom: 10,
    color: 'green',
  },
  viewOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  viewOptionButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  selectedViewOption: {
    backgroundColor: 'lightblue',
  },
  notificationIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  notificationText: {
    color: 'white',
    fontSize: 24,
    lineHeight: 24,
  },
  modalContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalHighlight: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default ManageLostItemScreen;