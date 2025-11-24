import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

interface TimerDisplayProps {
    secondsLeft: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ secondsLeft }) => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;

    return (
        <View style={styles.container}>
            <Text style={styles.timeText}>{formattedTime}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    timeText: {
        fontSize: 80,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
        color: '#333',
    },
});
