import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

interface SpeechBubbleProps {
    text: string;
    visible: boolean;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({ text, visible }) => {
    if (!visible) return null;

    return (
        <Animated.View entering={ZoomIn.springify()} style={styles.container}>
            <View style={styles.bubble}>
                <Text style={styles.text}>{text}</Text>
            </View>
            <Svg width="20" height="20" viewBox="0 0 20 20" style={styles.tail}>
                <Path d="M 0 0 L 10 20 L 20 0 Z" fill="#FFF" />
            </Svg>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: -60,
        alignItems: 'center',
        zIndex: 100,
    },
    bubble: {
        backgroundColor: '#FFF',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FF0000', // Red border for anger
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    text: {
        color: '#FF0000',
        fontWeight: 'bold',
        fontSize: 14,
    },
    tail: {
        marginTop: -2,
    },
});
