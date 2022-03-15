import React from 'react';
import {Text, View} from "react-native";
import styles from "./style";
import Header from "../../components/header";


const User = () => {
    return (
        <View style={styles.container}>
            <Header title={"User"}/>
            <Text style={{flex: 1, textAlignVertical: 'center'}}>User screen</Text>
        </View>
    )

}

export default User;