import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import styles from "./style";
import Header from "../../components/header";
import {MainLanguageContext} from "../../../App";
import DropDownPicker from "react-native-dropdown-picker";
import Icon from "react-native-vector-icons/Entypo";
import IconMa from "react-native-vector-icons/MaterialCommunityIcons";
import {LANGUAGES, METHOD} from "../../utils/consts/languages";


const Setting = () => {

    const {mainLanguage, setMainLanguage, method, setMethod} = useContext(MainLanguageContext);
    const [mainLanguageValue, setMainLanguageValue] = useState(mainLanguage);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(LANGUAGES);

    useEffect(() => {
        setMainLanguage(mainLanguageValue)
    }, [mainLanguageValue])

    const renderRadio = useCallback((itemMethod) => {
        return (
            <TouchableOpacity key={itemMethod.name} style={styles.touchRadio} onPress={() => setMethod(itemMethod)}>
                <IconMa name={method.name === itemMethod.name ? "radiobox-marked" : "radiobox-blank"} color={"#00BCD4"}
                        size={24}/>
                <Text
                    style={[styles.txtRadio, {fontWeight: method.name === itemMethod.name ? "bold" : "normal"}]}>{itemMethod.name}</Text>
            </TouchableOpacity>
        )
    }, [method])

    return (
        <View style={styles.container}>
            <Header title={"Setting"}/>

            <View style={styles.viewInfor}>
                <Text style={styles.title}>Detection method</Text>
                <View>
                    {METHOD.map(renderRadio)}
                </View>
            </View>

            <View style={[styles.viewInfor, {flex: 1}]}>
                <Text style={styles.title}>Main language</Text>
                <DropDownPicker
                    // zIndex={2}
                    style={styles.pickerStyle}
                    dropDownContainerStyle={styles.dropdownContainerStyles}
                    ArrowDownIconComponent={({style}) => <Icon style={style} name={"chevron-down"}
                                                               color={"#00BCD4"} size={20}/>}
                    ArrowUpIconComponent={({style}) => <Icon style={style} name={"chevron-up"}
                                                             color={"#00BCD4"} size={20}/>}
                    TickIconComponent={({style}) => <Icon style={style} name={"check"}
                                                          color={"#00BCD4"} size={20}/>}
                    containerStyle={styles.dropdownContainer}
                    labelStyle={styles.txtLabel}
                    textStyle={styles.txtDropdownStyle}
                    itemKey={"value"}
                    open={open}
                    value={mainLanguageValue}
                    items={items}
                    setOpen={setOpen}
                    setValue={setMainLanguageValue}
                    setItems={setItems}
                />
            </View>
        </View>
    )

}

export default Setting;