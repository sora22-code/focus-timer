import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Dog } from './Dog';
import { Castle } from './Castle';
import { Cat } from './Cat';
import { CatFoodTower } from './CatFoodTower';
import { Dragon } from './Dragon';
import { TreasureHoard } from './TreasureHoard';
import { SpeechBubble } from './SpeechBubble';
import { SUCCESS_QUOTES } from '../constants/successQuotes';

interface CharacterProgressViewProps {
    character: 'HAMSTER' | 'CAT' | 'DRAGON';
    progress: number;
    isActive: boolean;
    mode: 'FOCUS' | 'BREAK';
    isDead: boolean;
    isSuccess: boolean;
    onCalmDown: () => void;
    onClearSuccess: () => void;
}

const DEATH_TEXTS = [
    "死んでしまった...",
    "集中力が切れた...",
    "お城が崩れた...",
    "またやり直しだ...",
    "無念..."
];

export const CharacterProgressView: React.FC<CharacterProgressViewProps> = ({
    character,
    progress,
    isActive,
    mode,
    isDead,
    isSuccess,
    onCalmDown,
    onClearSuccess
}) => {
    const [deathText, setDeathText] = useState("");
    const [successText, setSuccessText] = useState("");

    useEffect(() => {
        if (isDead) {
            const randomText = DEATH_TEXTS[Math.floor(Math.random() * DEATH_TEXTS.length)];
            setDeathText(randomText);
        }
    }, [isDead]);

    useEffect(() => {
        if (isSuccess) {
            const quotes = SUCCESS_QUOTES[character];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            setSuccessText(randomQuote);
        }
    }, [isSuccess, character]);

    const handlePress = () => {
        if (isDead) {
            onCalmDown();
        } else if (isSuccess) {
            onClearSuccess();
        }
    };

    return (
        <TouchableOpacity activeOpacity={1} onPress={handlePress} style={styles.container}>
            <SpeechBubble text={deathText} visible={isDead} />
            <SpeechBubble text={successText} visible={isSuccess} />

            {character === 'HAMSTER' ? (
                <>
                    <Castle progress={isDead ? 0 : progress} />
                    <Dog isActive={isActive && mode === 'FOCUS'} isDead={isDead} />
                </>
            ) : character === 'CAT' ? (
                <>
                    <CatFoodTower progress={isDead ? 0 : progress} />
                    <Cat isActive={isActive && mode === 'FOCUS'} isDead={isDead} />
                </>
            ) : (
                <>
                    <TreasureHoard progress={isDead ? 0 : progress} />
                    <Dragon isActive={isActive && mode === 'FOCUS'} isDead={isDead} />
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        width: '100%',
    },
    sceneContainer: {
        width: 300,
        height: 250,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 16,
    },
    statusText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#666',
    },
});
