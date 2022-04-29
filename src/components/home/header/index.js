import React, {useEffect, useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import styles from "./style";
import DropDownPicker from "react-native-dropdown-picker";
import {LANGUAGES} from "../../../utils/consts/languages";

const Header = React.forwardRef(({mainLanguage, addLanguage, resetLanguage, setManualSecondLanguage}, ref) => {

    const [secondLanguageValue, setSecondLanguageValue] = useState(addLanguage?.value);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(LANGUAGES);

    React.useImperativeHandle(
        ref,
        () => ({
            closeDropdownPicker() {
                setOpen(false);
            }
        })
    );

    useEffect(() => {
        if(addLanguage){
            if(secondLanguageValue){
                if (addLanguage.value !== secondLanguageValue)
                    setManualSecondLanguage(secondLanguageValue);
            }
        }else {
            if(secondLanguageValue){
                setManualSecondLanguage(secondLanguageValue);
            }
        }
    }, [secondLanguageValue])

    useEffect(() => {
        if(addLanguage){
            if(secondLanguageValue){
                if (addLanguage.value !== secondLanguageValue)
                    setSecondLanguageValue(addLanguage.value);
            }else {
                setSecondLanguageValue(addLanguage.value);
            }
        }else {
            if(secondLanguageValue){
                setSecondLanguageValue(addLanguage);
            }
        }
    }, [addLanguage])

    return (
        <View style={styles.container}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.textLanguage, {textAlign: 'left'}]}>{mainLanguage.name}</Text>

            <TouchableOpacity onPress={resetLanguage}>
                <Icon name={'reload'} style={styles.iconReload}/>
            </TouchableOpacity>

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
                labelStyle={[styles.textLanguage, {textAlign: 'right'}]}
                placeholderStyle={{
                    textAlign: 'right'
                }}
                textStyle={styles.txtDropdownStyle}
                listItemContainerStyle={{
                    marginVertical:4
                }}
                itemKey={"value"}
                open={open}
                value={secondLanguageValue}
                items={items}
                setOpen={setOpen}
                setValue={setSecondLanguageValue}
                setItems={setItems}
                labelProps={{
                    numberOfLines: 1,
                    ellipsizeMode: "tail"
                }}
                placeholder="No Language"
                arrowIconContainerStyle={{
                    width:0,
                }}
            />
        </View>
    );
});

export default React.memo(Header);
