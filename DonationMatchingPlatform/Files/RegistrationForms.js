import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Pressable,
    SafeAreaView,
    ActivityIndicator,
    Alert
} from 'react-native';
import styles from './FormStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
export const CharitableAssociationForm = ({ navigation }) => {
    const [organizationName, setOrganizationName] = useState('');
    const [organizationNameError, setOrganizationNameError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState('');
    const [contactDetails, setContactDetails] = useState('');
    const [contactDetailsError, setContactDetailsError] = useState('');
    const [googleMapLink, setGoogleMapLink] = useState('');
    const [googleMapLinkError, setGoogleMapLinkError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [formError, setFormError] = useState('');
    const [isloading, setIsLoading] = useState(false);
    const validateForm = () => {
        let hasNoErrors = true;


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        clearErrors()

        if (!organizationName || !email || !address || !contactDetails || !googleMapLink || !password || !confirmPassword) {
            setFormError('All fields are required');
            hasNoErrors = false;
        }
        if (!emailRegex.test(email)) {
            setEmailError('Invalid email format');
            hasNoErrors = false;
        }
        if (organizationName.length > 50) {
            setOrganizationNameError('Organization name should be less than 50 characters');
            hasNoErrors = false;
        }
        if (address.length > 100) {
            setAddressError('Address should be less than 100 characters');
            hasNoErrors = false;
        }
        if (contactDetails.length !== 10 || !/^\d+$/.test(contactDetails)) {
            setContactDetailsError('Contact details should be exactly 10 characters');
            hasNoErrors = false;
        }
        if (googleMapLink.length > 100) {
            setGoogleMapLinkError('Google Map link should be less than 100 characters');
            hasNoErrors = false;
        }
        if (password.length < 8 || password.length > 20) {
            setPasswordError('Password should be between 8 to 20 characters');
            hasNoErrors = false;
        }
        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            hasNoErrors = false;
        }

        return hasNoErrors;
    };
    const clearErrors = () => {
        setOrganizationNameError('');
        setEmailError('');
        setAddressError('');
        setContactDetailsError('');
        setGoogleMapLinkError('');
        setPasswordError('');
        setConfirmPasswordError('');
        setFormError('');
    }
    const clearForm = () => {
        setOrganizationName('');
        setEmail('');
        setAddress('');
        setContactDetails('');
        setGoogleMapLink('');
        setPassword('');
        setConfirmPassword('');
    };
    const fetchResult = async () => {
        clearErrors()
        try {
            setIsLoading(true)
            const request = await fetch("http://192.168.31.78:9090/donation/register/charity", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    organizationName: organizationName,
                    email: email,
                    address: address,
                    contactDetails: contactDetails,
                    googleMapLink: googleMapLink,
                    password: password
                })
            })

            const response = await request.json();
            setIsLoading(false)
            if (response.success) {
                Alert.alert('Success', 'You have successfully submitted the response', [
                    { text: 'OK', onPress: afterSubmit() }
                ]);
            } else if (response.failure) {
                setFormError(response.failure);
            }
            else {
                setFormError(response.error);
            }
        } catch (error) {
            console.error(error)
            setFormError('An error occurred while submitting the form');
        }
    }
    const handleSubmit = () => {
        if (validateForm()) {
            fetchResult()
        }
    }
    const afterSubmit = () => {
        clearForm();
        navigation.navigate("Login")
    }
    if (isloading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="black"></ActivityIndicator>
            </SafeAreaView>
        );
    }
    return (
        <ScrollView>
            <View>
                <Text style={styles.label}>Organization Name</Text>
                <TextInput
                    style={styles.input}
                    value={organizationName.trim()}
                    onChangeText={setOrganizationName}
                    placeholder="Enter organization name"
                />
                {organizationNameError ? <Text style={styles.errorText}>{organizationNameError}</Text> : null}

                <Text style={styles.label}>Organization Email</Text>
                <TextInput
                    style={styles.input}
                    value={email.trim()}
                    onChangeText={setEmail}
                    placeholder="Enter email"
                    keyboardType="email-address"
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                <Text style={styles.label}>Address</Text>
                <TextInput
                    style={styles.input}
                    value={address.trim()}
                    onChangeText={setAddress}
                    placeholder="Enter address"
                />
                {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}

                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    value={contactDetails.trim()}
                    onChangeText={setContactDetails}
                    placeholder="Enter contact details"
                    keyboardType="phone-pad"
                />
                {contactDetailsError ? <Text style={styles.errorText}>{contactDetailsError}</Text> : null}

                <Text style={styles.label}>Google Map Link</Text>
                <TextInput
                    style={styles.input}
                    value={googleMapLink.trim()}
                    onChangeText={setGoogleMapLink}
                    placeholder="Enter Google map link"
                />
                {googleMapLinkError ? <Text style={styles.errorText}>{googleMapLinkError}</Text> : null}

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={password.trim()}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    placeholder="Enter password"
                />
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    value={confirmPassword.trim()}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={true}
                    placeholder="Confirm password"
                />
                {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
                {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
                <Pressable style={styles.button} onPress={() => { handleSubmit() }}>
                    <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
};

export const MessSupervisorForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [id, setId] = useState('');
    const [supervisingMess, setSupervisingMess] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [idError, setIdError] = useState('');
    const [supervisingMessError, setSupervisingMessError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [formError, setFormError] = useState('');
    const [isloading, setIsLoading] = useState(false);
    const validateForm = () => {
        let hasErrors = false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        clearErrors();

        if (!name || !email || !phoneNumber || !id || !supervisingMess || !password || !confirmPassword) {
            setFormError('All fields are required');
            hasErrors = true;
        }
        if (!emailRegex.test(email)) {
            setEmailError('Invalid email format');
            hasErrors = true;
        }
        if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
            setPhoneNumberError('Phone number should be exactly 10 digits');
            hasErrors = true;
        }

        if (id.length !== 6 || !/^\d+$/.test(id)) {
            setIdError('ID should be exactly 6 digits');
            hasErrors = true;
        }

        if (supervisingMess.length > 50) {
            setSupervisingMessError('Currently supervising mess should be less than 50 characters');
            hasErrors = true;
        }
        // You can add further validations for other fields in a similar manner

        // Validate password
        if (password.length < 8 || password.length > 20 || password.trim().length !== password.length) {
            setPasswordError('Password should be between 8 to 20 characters and cannot consist of only spaces');
            hasErrors = true;
        }
        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            hasErrors = true;
        }

        return !hasErrors;
    };
    const clearErrors = () => {
        setNameError('');
        setEmailError('');
        setPhoneNumberError('');
        setIdError('');
        setSupervisingMessError('');
        setPasswordError('');
        setConfirmPasswordError('');
        setFormError('');
    };
    const clearForm = () => {
        setName('');
        setEmail('');
        setPhoneNumber('');
        setId('');
        setSupervisingMess('');
        setPassword('');
        setConfirmPassword('');
    }
    const fetchResult = async () => {
        clearErrors()
        try {
            setIsLoading(true)
            const request = await fetch("http://192.168.31.78:9090/donation/register/supervisor", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phoneNumber: phoneNumber,
                    id: id,
                    supervisingMess: supervisingMess,
                    password: password,
                })
            })

            const response = await request.json();
            setIsLoading(false)
            if (response.success) {
                Alert.alert('Success', 'You have successfully submitted the response', [
                    { text: 'OK', onPress: clearForm() }
                ]);
            } else if (response.failure) {
                setFormError(response.failure);
            }
            else {
                setFormError(response.error);
            }
        } catch (error) {
            console.error(error)
            setFormError('An error occurred while submitting the form');
        }
    }
    const handleSubmit = () => {
        if (validateForm()) {
            fetchResult()
        }
    }

    if (isloading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="black"></ActivityIndicator>
            </SafeAreaView>
        );
    }
    return (
        <ScrollView>
            <View>
                <Text style={styles.label}>Name</Text>
                <TextInput style={styles.input}
                    value={name.trim()}
                    onChangeText={setName}
                    placeholder="Enter name"
                />
                {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

                <Text style={styles.label}>Phone Number</Text>
                <TextInput style={styles.input}
                    value={phoneNumber.trim()}
                    onChangeText={setPhoneNumber}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                />
                {phoneNumberError ? <Text style={styles.errorText}>{phoneNumberError}</Text> : null}

                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input}
                    value={email.trim()}
                    onChangeText={setEmail}
                    placeholder="Enter email"
                    keyboardType='email-address'
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                <Text style={styles.label}>ID</Text>
                <TextInput style={styles.input}
                    value={id.trim()}
                    onChangeText={setId}
                    placeholder="Enter ID"
                />
                {idError ? <Text style={styles.errorText}>{idError}</Text> : null}

                <Text style={styles.label}>Currently Supervising Mess</Text>
                <TextInput style={styles.input}
                    value={supervisingMess.trim()}
                    onChangeText={setSupervisingMess}
                    placeholder="Enter currently supervising mess"
                />
                {supervisingMessError ? <Text style={styles.errorText}>{supervisingMessError}</Text> : null}

                <Text style={styles.label}>Password</Text>
                <TextInput style={styles.input}
                    value={password.trim()}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    placeholder="Enter password"
                />
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                <Text style={styles.label}>Confirm Password</Text>
                <TextInput style={styles.input}
                    value={confirmPassword.trim()}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={true}
                    placeholder="Confirm password"
                />
                {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

                {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

                <Pressable style={styles.button} onPress={() => { handleSubmit() }}>
                    <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
            </View>

        </ScrollView>
    );
};

export const StudentOrganizingEventForm = ({ navigation }) => {
    const [studentName, setStudentName] = useState('');
    const [organizingGroup, setOrganizingGroup] = useState('');
    const [proofsOfOrganizingEvent, setProofsOfOrganizingEvent] = useState('');
    const [contactDetails, setContactDetails] = useState('');
    const [dateOfEvent, setDateOfEvent] = useState('');
    const [email, setEmail] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [studentNameError, setStudentNameError] = useState('');
    const [organizingGroupError, setOrganizingGroupError] = useState('');
    const [proofsOfOrganizingEventError, setProofsOfOrganizingEventError] = useState('');
    const [contactDetailsError, setContactDetailsError] = useState('');
    const [dateOfEventError, setDateOfEventError] = useState('');
    const [timeError, setTimeError] = useState('');
    const [locationError, setLocationError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [formError, setFormError] = useState('');
    const [isloading, setIsLoading] = useState(false);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('')
    const onChange = (e, selectedDate) => {
        setDate(selectedDate);
        setMode('');
    };

    const clearErrors = () => {
        setStudentNameError('');
        setOrganizingGroupError('');
        setProofsOfOrganizingEventError('');
        setContactDetailsError('');
        setDateOfEventError('');
        setTimeError('');
        setLocationError('');
        setPasswordError('');
        setConfirmPasswordError('');
        setFormError('');
    };
    const clearForm = () => {
        setStudentName('');
        setEmail('');
        setOrganizingGroup('');
        setProofsOfOrganizingEvent('');
        setContactDetails('');
        setDateOfEvent('');
        setTime('');
        setLocation('');
        setPassword('');
        setConfirmPassword('');
        setFormError('');
    };
    const validateForm = () => {
        let hasNoErrors = true;

        const emailRegex = /^[^\s@]+@uohyd.ac.in$/;

        clearErrors();


        if (!email || !organizingGroup || !proofsOfOrganizingEvent || !contactDetails || !location || !password || !confirmPassword) {
            setFormError('All fields are required');
            hasNoErrors = false;
        }

        if (!emailRegex.test(email)) {
            setEmailError('Invalid email format');
            hasNoErrors = false;
        }

        if (organizingGroup.length > 100) {
            setOrganizingGroupError('Organizing group should be less than 100 characters');
            hasNoErrors = false;
        }

        if (proofsOfOrganizingEvent.length > 1000) {
            setProofsOfOrganizingEventError('Proofs of organizing event should be less than 1000 characters');
            hasNoErrors = false;
        }

        if (contactDetails.length !== 10 || !/^\d+$/.test(contactDetails)) {
            setContactDetailsError('Contact details should be exactly 10 digits');
            hasNoErrors = false;
        }

        if (password.length < 8 || password.length > 20) {
            setPasswordError('Password should be between 8 to 20 characters');
            hasNoErrors = false;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            hasNoErrors = false;
        }
        console.log(hasNoErrors)
        return hasNoErrors;

    }

    const fetchResult = async () => {
        clearErrors()
        // clearForm()
        try {
            // setIsLoading(true)
            const request = await fetch("http://192.168.80.124:9090/donation/register/student", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    // studentName: studentName,
                    email: email,
                    organizingGroup: organizingGroup,
                    proofsOfOrganizingEvent: proofsOfOrganizingEvent,
                    contactDetails: contactDetails,
                    date: date,
                    location: location,
                    password: password
                })
            })

            const response = await request.json();
            // setIsLoading(false)
            console.log(response);
            if (response.result === true) {
                Alert.alert('Success', 'You have successfully submitted the response', [
                    { text: 'OK', onPress: afterSubmit() }
                ]);
            } else {
                setFormError(response.result);
            }
        } catch (error) {
            console.error(error)
            setFormError('An error occurred while submitting the form');
        }
    }
    const handleSubmit = () => {
        if (validateForm()) {
            fetchResult()
        }
    }
    const afterSubmit = () => {
        clearForm();
        navigation.navigate("Login")
    }

    return (
        <ScrollView>
            {/* <KeyboardAvoidingView behavior="padding"> */}
            <View>
                {/* <Text style={styles.label}>Student Name</Text>
                <TextInput
                    style={styles.input}
                    value={studentName.trim()}
                    onChangeText={setStudentName}
                    placeholder="Enter student name"
                />
                {studentNameError && <Text style={styles.errorText}>{studentNameError}</Text>} */}

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email.trim()}
                    onChangeText={setEmail}
                    placeholder="Enter email"
                />
                {emailError && <Text style={styles.errorText}>{emailError}</Text>}

                <Text style={styles.label}>Organizing Group</Text>
                <TextInput
                    style={styles.input}
                    value={organizingGroup.trim()}
                    onChangeText={setOrganizingGroup}
                    placeholder="Enter organizing group"
                />
                {organizingGroupError && <Text style={styles.errorText}>{organizingGroupError}</Text>}

                <Text style={styles.label}>Proofs of Organizing Event</Text>
                <TextInput
                    style={styles.input}
                    value={proofsOfOrganizingEvent.trim()}
                    onChangeText={setProofsOfOrganizingEvent}
                    placeholder="Enter proofs of organizing event"
                />
                {proofsOfOrganizingEventError ? (<Text style={styles.errorText}>{proofsOfOrganizingEventError}</Text>) : (<Text style={styles.errorText}>* provide google drive link, merging all relevant documents</Text>)}

                <Text style={styles.label}>Contact Details</Text>
                <TextInput
                    style={styles.input}
                    value={contactDetails.trim()}
                    onChangeText={setContactDetails}
                    placeholder="Enter contact details"
                    keyboardType='numeric'
                />
                {contactDetailsError && <Text style={styles.errorText}>{contactDetailsError}</Text>}

                <Text style={styles.label} >Select Date</Text>
                <Pressable style={[styles.button, { backgroundColor: 'white' }]} onPress={() => setMode('date')}>
                    <Text style={styles.input}> {date.toLocaleDateString()}</Text>
                </Pressable>

                <Text style={styles.label} >Select Time</Text>
                <Pressable style={[styles.button, { backgroundColor: 'white' }]} onPress={() => setMode('time')}>
                    <Text style={styles.input}>{date.toLocaleTimeString()}</Text>
                </Pressable>

                {mode && (<DateTimePicker
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    minimumDate={new Date()}
                    onChange={onChange}
                />)}

                <Text style={styles.label}>Location</Text>
                <TextInput
                    style={styles.input}
                    value={location.trim()}
                    onChangeText={setLocation}
                    placeholder="Enter location"
                />
                {locationError && <Text style={styles.errorText}>{locationError}</Text>}

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={password.trim()}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    placeholder="Enter password"
                />
                {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    value={confirmPassword.trim()}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={true}
                    placeholder="Confirm password"
                />
                {confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}

                {formError && <Text style={styles.errorText}>{formError}</Text>}

                <Pressable style={styles.button} onPress={() => { handleSubmit() }}>
                    <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
            </View>
            {/* </KeyboardAvoidingView> */}
        </ScrollView>
    );
};

