import React, {useEffect, useRef} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import LottieView from 'lottie-react-native';
import styles from "./style";
import {useNavigation} from "@react-navigation/native";

const Header = React.memo(({mainLanguage, addLanguage, resetLanguage}) => {

    return (
        <View style={styles.container} >
            <Text style={[styles.textLanguage,{textAlign:'left'}]}>{mainLanguage.name}</Text>

            <TouchableOpacity onPress={resetLanguage}>
                <Icon name={'reload'} style={styles.iconReload}/>
            </TouchableOpacity>

            <Text style={[styles.textLanguage,{textAlign:'right'}]}>{addLanguage?.name || ""}</Text>
        </View>
    );
});

export default Header;