import {ActivityIndicator, Image, Text, TouchableOpacity, View,} from 'react-native';
import React from 'react';
import styles from './style';

interface ItemProps {
    isLoading?: boolean;
    isDisabled?: boolean;
    onPress?: () => void;
    style?: any;
    disabledStyle?: any;
    textStyle?: any;
    imgLeftSrc?: any;
    imgLeftStyle?: any;
    indicatorColor?: string;
    activeOpacity?: number;
}

const defaultProps: Partial<ItemProps> = {
    isLoading: false,
    isDisabled: false,
    style: styles.btn,
    textStyle: styles.txt,
    imgLeftStyle: styles.imgLeft,
    indicatorColor: 'white',
    activeOpacity: 0.5,
};

const Button = (props: ItemProps | any) => {

    const render = () => {
        if (props.isDisabled) {
            return (
                <View style={props.disabledStyle}>
                    <Text style={props.textStyle}>{props.children}</Text>
                </View>
            );
        }
        if (props.isLoading) {
            return (
                <View style={props.style}>
                    <ActivityIndicator size="small" color={props.indicatorColor}/>
                </View>
            );
        }

        return (
            <TouchableOpacity
                activeOpacity={props.activeOpacity}
                onPress={props.onPress}
            >
                <View style={props.style}>
                    {props.imgLeftSrc ? (
                        <Image
                            style={props.imgLeftStyle}
                            source={props.imgLeftSrc}
                        />
                    ) : null}
                    <Text style={props.textStyle}>{props.children}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return render();
}

export default Button;