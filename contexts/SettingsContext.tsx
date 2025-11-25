import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CharacterType = 'HAMSTER' | 'CAT' | 'DRAGON' | 'SHIBUSAWA';
export type ThemeType = 'LIGHT' | 'DARK';

interface SettingsContextType {
    character: CharacterType;
    setCharacter: (char: CharacterType) => void;
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    focusDuration: number;
    setFocusDuration: (duration: number) => void;
    isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [character, setCharacter] = useState<CharacterType>('HAMSTER');
    const [theme, setTheme] = useState<ThemeType>('LIGHT');
    const [focusDuration, setFocusDuration] = useState<number>(25);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const storedCharacter = await AsyncStorage.getItem('settings_character');
            const storedTheme = await AsyncStorage.getItem('settings_theme');
            const storedDuration = await AsyncStorage.getItem('settings_duration');

            if (storedCharacter) setCharacter(storedCharacter as CharacterType);
            if (storedTheme) setTheme(storedTheme as ThemeType);
            if (storedDuration) setFocusDuration(parseInt(storedDuration, 10));
        } catch (e) {
            console.error('Failed to load settings', e);
        } finally {
            setIsLoading(false);
        }
    };

    const saveSetting = async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (e) {
            console.error(`Failed to save ${key}`, e);
        }
    };

    const handleSetCharacter = (char: CharacterType) => {
        setCharacter(char);
        saveSetting('settings_character', char);
    };

    const handleSetTheme = (t: ThemeType) => {
        setTheme(t);
        saveSetting('settings_theme', t);
    };

    const handleSetFocusDuration = (d: number) => {
        setFocusDuration(d);
        saveSetting('settings_duration', d.toString());
    };

    return (
        <SettingsContext.Provider
            value={{
                character,
                setCharacter: handleSetCharacter,
                theme,
                setTheme: handleSetTheme,
                focusDuration,
                setFocusDuration: handleSetFocusDuration,
                isLoading,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
