import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Pressable,
    StatusBar,
    SafeAreaView,
    StyleSheet,
    KeyboardAvoidingView,
    useWindowDimensions,
    ActivityIndicator
} from "react-native"
import styles from "./FormStyles"
import { Picker } from "@react-native-picker/picker"
// const windowWidth=useWindowDimensions().width;
// const windowHeight=useWindowDimensions().height;
export default function DonationLogin({ navigation }) {
    const [emailID, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})
    const [result, setResult] = useState("")
    const [isloading, setIsLoading] = useState(false);
    const [selectedForm, setSelectedForm] = useState("")
    const validateForm = () => {
        let errors = {}
        if (!emailID) errors.emailID = "UserName is empty"
        if (!password) errors.password = "Password is empty"
        if (!selectedForm) errors.selectedForm = "Select the form"
        // if (selectedForm === "Select from below") errors.selectedForm = "invalid selection"
        // console.log(errors)
        setErrors(errors)
        return Object.keys(errors).length === 0
    }
    const fetchResult = async () => {
        try {
            // console.log?(`http://192.168.196.124:9090/donation/login/${selectedForm}`)
            // setIsLoading(true)
            const request = await fetch(`http://192.168.31.78:9090/donation/login/${selectedForm}`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    emailID: emailID,
                    password: password,
                })
            })
            console.log("form is ", emailID, password);
            const response = await request.json();
            console.log(response);
            // setIsLoading(false)
            // if (response.success === false) {
            //     setResult("invalid email/password");
            // }
            if (response.success === true) {
                if (selectedForm === 'charity') {
                    navigation.navigate('CharityDashboard', { emailID: emailID, userType: selectedForm })
                }
                else {
                    navigation.navigate('DonorDashboard', { emailID: emailID, userType: selectedForm })
                }
            }
            // else {
            //     setResult("An error occured. Please try again after some time")
            // }
            else {
                setResult(response);
            }
        } catch (error) {
            console.error(error)
        }
    }
    const handleSubmit = () => {
        if (validateForm()) {
            console.log("form is valid-", emailID, password);
            setUserName("")
            setPassword("")
            setErrors({})
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
        // <SafeAreaView style={styles.container} >
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={styles.form}>
                <Text style={styles.label}>Select</Text>
                <Picker style={styles.input} selectedValue={selectedForm} onValueChange={(itemValue) => setSelectedForm(itemValue)}>
                    <Picker.Item style={styles.input} label="Select from below" value="Select from below" />
                    <Picker.Item style={styles.input} label="Charitable Association" value="charity" />
                    <Picker.Item style={styles.input} label="Mess" value="supervisor" />
                    <Picker.Item style={styles.input} label="Student" value="student" />
                </Picker>
                {errors.selectedForm ? (<Text style={styles.errorText}>{errors.selectedForm}</Text>) : null}
                <Text style={[styles.label]}>EmailID </Text>
                <TextInput style={[styles.input]} value={emailID} placeholder="Enter your Email for mess enter user name" onChangeText={setUserName}></TextInput>
                {errors.emailID ? (<Text style={styles.errorText}>{errors.emailID}</Text>) : null}
                <Text style={[styles.label]}>Password</Text>
                <TextInput style={[styles.input]} value={password} placeholder="Enter your password" onChangeText={setPassword} secureTextEntry></TextInput>
                {errors.password ? (<Text style={styles.errorText}>{errors.password}</Text>) : null}
                <Pressable style={styles.button} onPress={() => { handleSubmit() }}>
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>
                {result ? (<Text style={styles.errorText}>{JSON.stringify(result)}</Text>) : null}
                <Pressable style={styles.register} onPress={() => { navigation.navigate("Registration") }} >
                    <Text style={styles.registerText}>if not registered? Sign-up</Text>
                </Pressable>
                {/* <Button style={styles.button} title="Login" /> */}
            </View>
        </KeyboardAvoidingView>
        // </SafeAreaView>
    );
}

