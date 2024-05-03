import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import moment from 'moment';
const CharityDonation = ({ navigation, route }) => {
    const { emailID, userType } = route.params;
    const [donations, setDonations] = useState([]);
    const [quantityRequested, setQuantityRequested] = useState('');

    useEffect(() => {
        fetchDonations();
        const intervalId = setInterval(fetchDonations, 30000);
        console.log("yes")
        return () => clearInterval(intervalId);
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await fetch(`http://192.168.31.78:9090/donation/charity/donations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setDonations(data.result);
            //   const response = await request.json();
            //   console.log(response.r)
            //   setDonations(response.result);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch donations. Please try again.');
        }
    };

    const handleRequestDonation = (donationId) => {
        if (!quantityRequested) {
            Alert.alert('Error', 'Please enter the quantity.');
            return;
        }


        fetch('http://192.168.31.78:9090/donation/charity/donation/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emailID: emailID,
                userType: userType,
                donationId: donationId,
                quantityRequested: quantityRequested,
            }),
        })
            .then((response) => response.json())
            .then((data) => {

                console.log(data);
                Alert.alert('Success', 'Donation request sent successfully.');

            })
            .catch((error) => {
                console.error('Error:', error);
                Alert.alert('Error', 'Failed to send donation request. Please try again.');
            });
    };

    const handleDeleteDonation = (donationId) => {
        fetch(`http://192.168.31.78:9090/donation/delete/${donationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                Alert.alert('Success', 'Donation deleted successfully.');
                // Refresh donations list after deletion
                fetchDonations();
            })
            .catch((error) => {
                console.error('Error:', error);
                Alert.alert('Error', 'Failed to delete donation. Please try again.');
            });
    };

    const renderDonationItem = ({ item }) => (
        <View style={styles.donationItem}>

            <Text style={styles.cardText}>Donor: {item.Messname}{item.StudentID}</Text>
            <Text style={styles.cardText}>Item Name: {item.ItemName}</Text>
            <Text style={styles.cardText}>Quantity: {item.Quantity} {item.QuantityType}</Text>
            <Text style={styles.cardText}>Date and Time of Production:{moment(item.DateandTimeOfProduction).format('MMMM Do YYYY, h:mm:ss a')}</Text>
            <Text style={styles.cardText}>Date and Time of Entry: {moment(item.DateandTimeOfProduction).format('MMMM Do YYYY, h:mm:ss a')}</Text>

            <TouchableOpacity style={styles.requestButton} onPress={() => handleRequestDonation(item.ID)}>
                <Text style={styles.buttonText}>Request Donation</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={donations}
                keyExtractor={(item) => item.ID.toString()}
                renderItem={renderDonationItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={<Text>No donations found</Text>}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter Quantity"
                onChangeText={(text) => setQuantityRequested(text)}
                keyboardType="numeric"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    // donationItem: {
    //     padding: 16,
    //     backgroundColor: '#f0f0f0',
    //     borderRadius: 8,
    //     marginBottom: 8,
    //     // color:'black'
    // },
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
    donationItem: {
        backgroundColor: '#f0f0f0',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    itemText: {
        fontSize: 18,
    },
    requestButton: {
        backgroundColor: 'blue',
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
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 8,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
});

export default CharityDonation;
