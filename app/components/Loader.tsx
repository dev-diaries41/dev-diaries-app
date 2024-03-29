import { StyleSheet, Text, View } from 'react-native';
import React from 'react'
import { MotiView } from 'moti';
import Spacer from './Spacer';
import { sizes, themes } from '../constants/layout';

interface LoaderProps {
    size: number;
    loaderText?: string;
    color?: string
}

const Loader = ({ 
    size, 
    loaderText = 'Loading...', 
    color=themes.dark.primary ,
}: LoaderProps) => {
    return (
        <View style={styles.container}>
            <MotiView
                style={[
                    styles.loader,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: size / 10,
                        borderColor: themes.dark.primary,
                    },
                ]}
                from={{ transform: [{ scaleX: 1 }, { scaleY: 1 }], opacity: 1 }}
                animate={{
                    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
                    opacity: 0.5,
                }}
                transition={{
                    type: 'spring',
                    damping: 16,
                    stiffness: 60,
                    mass: 1,
                    overshootClamping: false,
                    loop: true,
                }}
            />
            <Spacer/>
            <Text style={[styles.text, {color}]}>{loaderText}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {

    },
    text: {
        margin: sizes.layout.medium,
        fontSize: sizes.font.medium,
    fontWeight:'500',        textAlign:'center',
    },
});

export default Loader;