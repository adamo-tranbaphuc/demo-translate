import React from "react";
import {Pressable, Text, View} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import styles from "./style";
import {useNavigation} from "@react-navigation/native";


function Header({
                    title = "",
                    iconLeft = "arrow-left",
                    iconRight,
                    onPressLeft,
                    onPressRight = () => {
                    }
                }) {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <Pressable style={[styles.button, {marginLeft: 8}]}
                           onPress={onPressLeft || (() => navigation.goBack())}>
                    <Icon name={iconLeft} size={28}
                          color={'#00BCD4'}/>
                </Pressable>

                <Text numberOfLines={1} ellipsizeMode={"tail"} allowFontScaling={false}
                      style={styles.txtHeader}>{title}</Text>

                {iconRight ? <Pressable style={[styles.button, {marginRight: 8}]} onPress={onPressRight}>
                        <Icon name={iconRight} size={28}
                              color={'#00BCD4'}/>
                    </Pressable>
                    :
                    <View style={[styles.button, {marginRight: 8}]}/>}
            </View>

        </View>
    );
}

export default React.memo(Header);