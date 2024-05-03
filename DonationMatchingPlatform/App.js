import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DonationLogin from "./Files/DonationLogin";
import DonationRegistration from "./Files/DonationRegistration";
import DonorDashboard from "./Files/DonorDashboard";
import DonorUploadForm from './Files/DonorUploadForm'
import DonorView from './Files/DonorView'
import DonorDonationView from "./Files/DonorDonationView"
import CharityDashboard from "./Files/CharityDashboard"
import CharityView from "./Files/CharityView"
import CharityDonation from "./Files/CharityDonation"
export default function App(){
  const stack=createNativeStackNavigator()
  return (
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen name="Login" component={DonationLogin}/>
        <stack.Screen name="Registration" component={DonationRegistration}/>
        <stack.Screen name="DonorView" component={DonorView}/>
        <stack.Screen name="DonorDonationView" component={DonorDonationView}/>
        <stack.Screen name="DonorUpload" component={DonorUploadForm}/>
        <stack.Screen name="DonorDashboard" component={DonorDashboard} options={{ headerShown: false }}/>
        <stack.Screen name="CharityDonation" component={CharityDonation}/>
        <stack.Screen name="CharityView" component={CharityView}/>
        <stack.Screen name="CharityDashboard" component={CharityDashboard} options={{ headerShown: false }}/>
        
      </stack.Navigator>
    </NavigationContainer>
  );
}