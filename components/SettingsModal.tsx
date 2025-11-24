import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Switch, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings, CharacterType, ThemeType } from '../contexts/SettingsContext';

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
    const {
        character, setCharacter,
        theme, setTheme,
        focusDuration, setFocusDuration
    } = useSettings();

    const isDark = theme === 'DARK';

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView, isDark && styles.modalViewDark]}>
                    <View style={styles.header}>
                        <Text style={[styles.modalTitle, isDark && styles.textDark]}>Settings</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={isDark ? '#fff' : '#333'} />
                        </TouchableOpacity>
                    </View>

                    {/* Character Selection */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Character</Text>
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    character === 'HAMSTER' && styles.optionSelected
                                ]}
                                onPress={() => setCharacter('HAMSTER')}
                            >
                                <Text style={styles.optionEmoji}>🐶</Text>
                                <Text style={[styles.optionText, character === 'HAMSTER' && styles.optionTextSelected]}>Dog</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    character === 'CAT' && styles.optionSelected
                                ]}
                                onPress={() => setCharacter('CAT')}
                            >
                                <Text style={styles.optionEmoji}>🐱</Text>
                                <Text style={[styles.optionText, character === 'CAT' && styles.optionTextSelected]}>Cat</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    character === 'DRAGON' && styles.optionSelected
                                ]}
                                onPress={() => setCharacter('DRAGON')}
                            >
                                <Text style={styles.optionEmoji}>🐲</Text>
                                <Text style={[styles.optionText, character === 'DRAGON' && styles.optionTextSelected]}>Dragon</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Theme Selection */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Theme</Text>
                        <View style={styles.row}>
                            <Text style={[styles.label, isDark && styles.textDark]}>Dark Mode</Text>
                            <Switch
                                value={isDark}
                                onValueChange={(val) => setTheme(val ? 'DARK' : 'LIGHT')}
                            />
                        </View>
                    </View>

                    {/* Timer Duration */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Focus Duration (min)</Text>
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={styles.adjustButton}
                                onPress={() => setFocusDuration(Math.max(1, focusDuration - 1))}
                            >
                                <Ionicons name="remove" size={24} color={isDark ? '#fff' : '#333'} />
                            </TouchableOpacity>

                            <View style={styles.durationDisplay}>
                                <Text style={[styles.durationValue, isDark && styles.textDark]}>{focusDuration}</Text>
                                <Text style={[styles.durationUnit, isDark && styles.textDark]}>min</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.adjustButton}
                                onPress={() => setFocusDuration(focusDuration + 1)}
                            >
                                <Ionicons name="add" size={24} color={isDark ? '#fff' : '#333'} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        minHeight: 400,
    },
    modalViewDark: {
        backgroundColor: '#222',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    textDark: {
        color: '#fff',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: '#666',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    optionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    optionSelected: {
        borderColor: '#007AFF',
        backgroundColor: '#E3F2FD',
    },
    optionEmoji: {
        fontSize: 24,
        marginRight: 8,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    optionTextSelected: {
        color: '#007AFF',
    },
    label: {
        fontSize: 16,
    },
    adjustButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    durationDisplay: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    durationValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    durationUnit: {
        fontSize: 16,
        color: '#666',
    },
    durationBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    durationBtnSelected: {
        backgroundColor: '#007AFF',
    },
    durationText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    durationTextSelected: {
        color: '#fff',
    },
});
