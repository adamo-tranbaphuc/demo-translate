import React from "react";
import {Text, View} from "react-native";
import styles from "./style";
import {capitalizeFirstLetter} from "../../../utils/helpers";

const ResultTranslate = React.memo(({textResult = [], showLine}) => {
    return (
        <View style={styles.container}>
            {textResult.map((itemText)=>(
                <Text style={styles.txtResult}>
                    {capitalizeFirstLetter(itemText)}
                </Text>
            ))}

            {showLine ?
                <View style={styles.viewLine}/>
                :
                null
            }

        </View>
    );
});

export default ResultTranslate;
