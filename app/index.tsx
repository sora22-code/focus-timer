import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTimer } from '../hooks/useTimer';
import { TimerDisplay } from '../components/TimerDisplay';
import { ControlButtons } from '../components/ControlButtons';
import { CharacterProgressView } from '../components/CharacterProgressView';
import { SettingsProvider, useSettings } from '../contexts/SettingsContext';
import { SettingsModal } from '../components/SettingsModal';

type CharacterType = 'HAMSTER' | 'CAT' | 'DRAGON';

const TimerApp = () => {
    const { character, theme, focusDuration } = useSettings();
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);

    const handleTimerComplete = (mode: 'FOCUS' | 'BREAK') => {
        alert(`${mode} session complete!`);
    };

    const {
        timeLeft,
        isActive,
        mode,
        progress,
        isDead,
        isSuccess,
        toggleTimer,
        resetTimer,
        switchMode,
        setIsDead
    } = useTimer({
        focusDuration: focusDuration,
        onTimerComplete: (completedMode) => {
            alert(`${completedMode} session complete!`);
        }
    });

    const isDark = theme === 'DARK';
    const bgStyle = isDark ? styles.containerDark : styles.containerLight;

    const handleClearSuccess = () => {
        // Just clicking clears the success message, no state change needed
        // The isSuccess will be cleared when user starts a new timer
    };

    return (
        <SafeAreaView style={[styles.container, bgStyle]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => setIsSettingsVisible(true)} style={styles.settingsButton}>
                    <Ionicons name="settings-outline" size={28} color={isDark ? '#fff' : '#333'} />
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                <CharacterProgressView
                    mode={mode}
                    isActive={isActive}
                    progress={progress}
                    character={character}
                    isDead={isDead}
                    isSuccess={isSuccess}
                    onCalmDown={() => setIsDead(false)}
                    onClearSuccess={handleClearSuccess}
                />

                <TimerDisplay secondsLeft={timeLeft} />

                <ControlButtons
                    isActive={isActive}
                    onToggle={toggleTimer}
                    onReset={resetTimer}
                />
            </View>

            <SettingsModal
                visible={isSettingsVisible}
                onClose={() => setIsSettingsVisible(false)}
            />
        </SafeAreaView>
    );
};

export default function App() {
    return (
        <SettingsProvider>
            <TimerApp />
        </SettingsProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerLight: {
        backgroundColor: '#fff',
    },
    containerDark: {
        backgroundColor: '#1a1a1a',
    },
    header: {
        paddingHorizontal: 20,
        alignItems: 'flex-end',
    },
    settingsButton: {
        padding: 8,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
});
