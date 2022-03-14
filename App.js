import React, {useEffect, useState} from 'react';

import Home from "./src/containers/home";
import Setting from "./src/containers/setting";
import User from "./src/containers/user";

import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {PermissionsAndroid, Platform} from "react-native";
import {METHOD} from "./src/utils/consts/languages";

const Stack = createNativeStackNavigator();


export const MainLanguageContext = React.createContext();

function App() {

    const [mainLanguage, setMainLanguage] = useState('en-US');
    const [method, setMethod] = useState(METHOD[0]);
    const value = { mainLanguage, setMainLanguage, method, setMethod };

    useEffect(()=>{
        let askPermission = async ()=>{
            if (Platform.OS === 'android') {
                try {
                    const grants = await PermissionsAndroid.requestMultiple([
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    ]);

                    if (
                        grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                        PermissionsAndroid.RESULTS.GRANTED &&
                        grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                        PermissionsAndroid.RESULTS.GRANTED &&
                        grants['android.permission.RECORD_AUDIO'] ===
                        PermissionsAndroid.RESULTS.GRANTED
                    ) {
                        console.log('permissions granted');
                    } else {
                        console.log('All required permissions not granted');
                        return;
                    }
                } catch (err) {
                    console.warn(err);
                    return;
                }
            }
        }

        askPermission();
    },[])

    return (
        <MainLanguageContext.Provider value={value}>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName={"Home"}
                    screenOptions={{
                        header: () => null
                    }}>
                    <Stack.Screen name="Home" component={Home}/>
                    <Stack.Screen name="Setting" component={Setting}/>
                    <Stack.Screen name="User" component={User}/>
                </Stack.Navigator>
            </NavigationContainer>
        </MainLanguageContext.Provider>

    );
}

export default App;
