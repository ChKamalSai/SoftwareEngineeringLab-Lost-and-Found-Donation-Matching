import { StyleSheet,StatusBar } from "react-native"
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        // paddingTop: StatusBar.currentHeight,
        justifyContent: "center",
        // alignItems:"center"
    },
    form: {
        backgroundColor: "white",
        padding: 20,
        margin: "5%",
        // width:useWindowDimensions().width,
        justifyContent:"center",
      //  borderRadius: 10,
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
        // fontSize:useWindowDimensions().width>500?50:24
    },
    label: {
        fontWeight: "bold",
        marginBottom: 5,
        fontSize: 20
    },
    input: {
        height: 50,
        borderColor: "black",
        borderWidth: 1,
        marginBottom: 15,
        padding: 10,
        borderRadius: 5,
        fontSize: 20
    },
    button: {
        backgroundColor: "#007bff",
        padding: 10,
    },
    buttonText: {
        fontSize: 20,
        textAlign: "center",
        color: "white"
    },
    register: {
        padding: 0,
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20
    },
    registerText: {
        fontSize: 16,
        textAlign: "center",
        color: "#007bff"
    },
    errorText: {
        color: "red",
        marginBottom: 10
    }
})

export default styles