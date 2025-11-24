import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing
} from 'react-native-reanimated';
import { TimerMode } from '../hooks/useTimer';

interface CharacterViewProps {
    mode: TimerMode;
    isActive: boolean;
}

export const CharacterView: React.FC<CharacterViewProps> = ({ mode, isActive }) => {
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);

    useEffect(() => {
        if (isActive) {
            // Breathing animation for Focus
            scale.value = withRepeat(
                withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            );
        } else {
            scale.value = withTiming(1);
        }
    }, [isActive]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.characterPlaceholder, animatedStyle]}>
                <Text style={styles.emoji}>
                    {mode === 'FOCUS' ? (isActive ? '😤' : '😐') : '☕️'}
                </Text>
            </Animated.View>
            <Text style={styles.statusText}>
                {mode === 'FOCUS' ? 'Focus Time' : 'Break Time'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
    },
    characterPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E1E1E1',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emoji: {
        fontSize: 60,
    },
    statusText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
    },
});
