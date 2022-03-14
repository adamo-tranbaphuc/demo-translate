import React, {useContext, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import styles from "./style";
import Header from "../../components/header";
import {MainLanguageContext} from "../../../App";
import DropDownPicker from "react-native-dropdown-picker";
import Icon from "react-native-vector-icons/Entypo";
import {LANGUAGES} from "../../utils/consts/languages";
import {azureDetectLanguage} from "../../services/api";


const User = () => {

    const {mainLanguage, setMainLanguage} = useContext(MainLanguageContext);
    const [mainLanguageValue, setMainLanguageValue] = useState(mainLanguage);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(LANGUAGES);

    useEffect(() => {
        setMainLanguage(mainLanguageValue)
    }, [mainLanguageValue])

    const press = async () =>{
        await azureDetectLanguage()
    }

    return (
        <View style={styles.container}>
            <Header title={"User"}/>

            {/*<Text style={{flex:1, textAlignVertical:'center'}}>User screen</Text>*/}

            <TouchableOpacity onPress={press}>
                <Text>chon file ne</Text>
            </TouchableOpacity>

        </View>
    )

}

export default User;