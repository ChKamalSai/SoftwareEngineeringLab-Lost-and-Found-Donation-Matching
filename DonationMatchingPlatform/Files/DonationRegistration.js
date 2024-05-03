import {
    View,
    Text,
    KeyboardAvoidingView
} from "react-native";
import { Picker } from "@react-native-picker/picker"
import styles from "./FormStyles"
import { useState } from "react";
import { CharitableAssociationForm, MessSupervisorForm, StudentOrganizingEventForm } from "./RegistrationForms";
export default function DonationRegistration({navigation}) {
    const [selectedForm, setSelectedForm] = useState("")
    const renderForm = () => {
        switch (selectedForm) {
            case "Charitable Association":
                return <CharitableAssociationForm navigation={navigation} />;
            // case "Mess Supervisor":
            //     return <MessSupervisorForm />;
            case "Student":
                return <StudentOrganizingEventForm navigation={navigation} />;
            default:
                return null;
        }
    }
    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={styles.form}>
                <Text style={styles.label}>Select</Text>
                <Picker style={styles.input} selectedValue={selectedForm} onValueChange={(itemValue) => setSelectedForm(itemValue)}>
                    <Picker.Item style={styles.input} label="Select from below" value="Select from below" />
                    <Picker.Item style={styles.input} label="Charitable Association" value="Charitable Association" />
                    {/* <Picker.Item style={styles.input} label="Mess Supervisor" value="Mess Supervisor" /> */}
                    <Picker.Item style={styles.input} label="Student" value="Student" />
                </Picker>
                {renderForm()}
            </View>
        </KeyboardAvoidingView>
    );
}