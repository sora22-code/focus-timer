import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Path, G } from 'react-native-svg';

interface MoneyStackProps {
    progress: number;
}

export const MoneyStack: React.FC<MoneyStackProps> = ({ progress }) => {
    const maxBills = 20;
    const billCount = Math.floor(progress * maxBills);

    const bills = [];
    for (let i = 0; i < billCount; i++) {
        const yOffset = 150 - (i * 6); // Stack from bottom up
        const xOffset = (i % 2) * 2; // Slight alternating offset for realism

        bills.push(
            <G key={i} transform={`translate(${75 + xOffset}, ${yOffset})`}>
                {/* Bill body */}
                <Rect
                    x="0"
                    y="0"
                    width="50"
                    height="25"
                    fill={i % 3 === 0 ? "#85bb65" : i % 3 === 1 ? "#b8d4a0" : "#9dca7a"}
                    stroke="#5a7a3f"
                    strokeWidth="1"
                />
                {/* 万 character */}
                <Path
                    d="M 20 8 L 30 8 M 25 5 L 25 20 M 18 12 L 32 12 M 20 16 L 30 16"
                    stroke="#3d5228"
                    strokeWidth="1.5"
                    fill="none"
                />
            </G>
        );
    }

    return (
        <View style={{ width: 200, height: 200, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width="200" height="200" viewBox="0 0 200 200">
                {/* Base/Platform */}
                <Rect
                    x="60"
                    y="160"
                    width="80"
                    height="8"
                    fill="#8B7355"
                    rx="2"
                />

                {/* Money stack */}
                {bills}
            </Svg>
        </View>
    );
};
