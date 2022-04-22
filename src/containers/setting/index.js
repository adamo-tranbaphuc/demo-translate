import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import styles from "./style";
import Header from "../../components/header";
import {MainLanguageContext} from "../../../App";
import DropDownPicker from "react-native-dropdown-picker";
import Icon from "react-native-vector-icons/Entypo";
import IconMa from "react-native-vector-icons/MaterialCommunityIcons";
import {LANGUAGES, METHOD} from "../../utils/consts/languages";
import {GENDER_VOICE_ARRAY} from "../../utils/consts";
import {Slider} from "@miblanchard/react-native-slider";


const Setting = () => {

    const {
        mainLanguage,
        setMainLanguage,
        method,
        setMethod,
        gender,
        setGender,
        timeCut,
        setTimeCut,
        sensitivity,
        setSensitivity
    } = useContext(MainLanguageContext);
    const [mainLanguageValue, setMainLanguageValue] = useState(mainLanguage);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(LANGUAGES);

    useEffect(() => {
        setMainLanguage(mainLanguageValue)
    }, [mainLanguageValue])

    const renderRadioMethod = useCallback((itemMethod) => {
        return (
            <TouchableOpacity key={itemMethod.name} style={styles.touchRadio} onPress={() => setMethod(itemMethod)}>
                <IconMa name={method.name === itemMethod.name ? "radiobox-marked" : "radiobox-blank"} color={"#00BCD4"}
                        size={24}/>
                <Text
                    style={[styles.txtRadio, {fontWeight: method.name === itemMethod.name ? "bold" : "normal"}]}>{itemMethod.name}</Text>
            </TouchableOpacity>
        )
    }, [method])

    const renderRadioGender = useCallback((itemGender) => {
        return (
            <TouchableOpacity key={itemGender} style={styles.touchRadio} onPress={() => setGender(itemGender)}>
                <IconMa name={gender === itemGender ? "radiobox-marked" : "radiobox-blank"} color={"#00BCD4"}
                        size={24}/>
                <Text
                    style={[styles.txtRadio, {fontWeight: gender === itemGender ? "bold" : "normal"}]}>{itemGender}</Text>
            </TouchableOpacity>
        )
    }, [gender])
    console.log(timeCut)
    return (
        <View style={styles.container}>
            <Header title={"Setting"}/>

            <View style={[styles.viewInfor, {flexDirection: 'column'}]}>
                <Text style={styles.title}>Sentence break time (millisecond)</Text>
                <Text
                    style={[styles.title, {alignSelf: 'center', fontWeight: 'bold'}]}>{timeCut + " millisecond"}</Text>
                <Slider
                    maximumTrackTintColor={"#E1F5FE"}
                    minimumTrackTintColor={"#00BCD4"}
                    thumbTintColor={"#039BE5"}
                    step={200}
                    value={timeCut}
                    onValueChange={value => setTimeCut(value[0])}
                    maximumValue={3000}
                    minimumValue={600}
                />
            </View>

            <View style={[styles.viewInfor, {flexDirection: 'column'}]}>
                <Text style={styles.title}>Sensitivity to sound</Text>
                <Text style={[styles.title, {
                    alignSelf: 'center',
                    fontWeight: 'bold'
                }]}>{sensitivity === 20 ? "normal" : (sensitivity === 15 ? "low" : "high")}</Text>
                <Slider
                    containerStyle={{width: '80%', alignSelf: 'center'}}
                    maximumTrackTintColor={"#E1F5FE"}
                    minimumTrackTintColor={"#00BCD4"}
                    thumbTintColor={"#039BE5"}
                    step={5}
                    value={sensitivity}
                    onValueChange={value => setSensitivity(value[0])}
                    maximumValue={25}
                    minimumValue={15}
                />
            </View>

            <View style={styles.viewInfor}>
                <Text style={styles.title}>Detection method</Text>
                <View>
                    {METHOD.map(renderRadioMethod)}
                </View>
            </View>

            <View style={styles.viewInfor}>
                <Text style={styles.title}>Gender voice</Text>
                <View>
                    {GENDER_VOICE_ARRAY.map(renderRadioGender)}
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
