import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Ellipse, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface TreasureHoardProps {
    progress: number; // 0 to 1
}

const Coin = ({ x, y, scale = 1 }: { x: number, y: number, scale?: number }) => (
    <G transform={`translate(${x}, ${y}) scale(${scale})`}>
        <Ellipse cx="0" cy="0" rx="10" ry="4" fill="#FFD700" stroke="#FBC02D" strokeWidth="1" />
        <Ellipse cx="0" cy="-2" rx="10" ry="4" fill="#FFEB3B" />
    </G>
);

const Gem = ({ x, y, color }: { x: number, y: number, color: string }) => (
    <Path d={`M ${x} ${y} L ${x - 5} ${y - 8} L ${x + 5} ${y - 8} Z`} fill={color} stroke="white" strokeWidth="0.5" />
);

export const TreasureHoard: React.FC<TreasureHoardProps> = ({ progress }) => {
    // Calculate pile size
    const pileSize = Math.floor(progress * 20); // Max 20 items visible

    return (
        <View style={styles.container}>
            <Svg height="200" width="300" viewBox="0 0 300 200">
                <Defs>
                    <LinearGradient id="goldGlow" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#FFF" stopOpacity="0.5" />
                        <Stop offset="1" stopColor="#FFD700" stopOpacity="0" />
                    </LinearGradient>
                </Defs>

                {/* Base Pile (Always visible slightly) */}
                <Ellipse cx="150" cy="180" rx="80" ry="20" fill="#FFC107" opacity="0.3" />

                {/* Dynamic Coins */}
                {Array.from({ length: pileSize }).map((_, i) => {
                    // Random-ish positions based on index to form a pile
                    const row = Math.floor(i / 5);
                    const col = i % 5;
                    const x = 150 + (col - 2) * 20 + (Math.random() * 10 - 5);
                    const y = 180 - row * 10 + (Math.random() * 5);
                    return <Coin key={i} x={x} y={y} />;
                })}

                {/* Gems at milestones */}
                {progress > 0.3 && <Gem x={130} y={170} color="#F44336" />} // Ruby
                {progress > 0.6 && <Gem x={170} y={160} color="#2196F3" />} // Sapphire
                {progress > 0.9 && <Gem x={150} y={140} color="#4CAF50" />} // Emerald

                {/* Sparkles */}
                {progress > 0 && (
                    <Circle cx="150" cy="150" r="30" fill="url(#goldGlow)" />
                )}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: -10,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -1,
    },
});
