import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ControlButtonsProps {
    isActive: boolean;
    onToggle: () => void;
    onReset: () => void;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
    isActive,
    onToggle,
    onReset,
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={onReset}
            >
                <Ionicons name="refresh" size={24} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.mainButton, isActive ? styles.activeButton : styles.inactiveButton]}
                onPress={onToggle}
            >
                <Ionicons
                    name={isActive ? 'pause' : 'play'}
                    size={32}
                    color="#fff"
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        marginTop: 20,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
    mainButton: {
        width: 80,
        height: 80,
        backgroundColor: '#007AFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    activeButton: {
        backgroundColor: '#FF9500', // Orange for pause
    },
    inactiveButton: {
        backgroundColor: '#007AFF', // Blue for play
    },
    resetButton: {
        width: 50,
        height: 50,
        backgroundColor: '#F2F2F7',
    },
});
