import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Polygon, G, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withSpring,
    withTiming,
    withDelay
} from 'react-native-reanimated';

const AnimatedG = Animated.createAnimatedComponent(G);

interface CastleProps {
    progress: number; // 0 to 1
}

export const Castle: React.FC<CastleProps> = ({ progress }) => {
    // Fix: Progress goes 0 -> 1, so we want 0 -> 100
    const buildProgress = progress * 100;

    // Animation values for different parts
    const baseScale = useSharedValue(0);
    const midTierScale = useSharedValue(0);
    const mainTowerScale = useSharedValue(0);
    const sideTowersScale = useSharedValue(0);
    const detailsScale = useSharedValue(0);

    useEffect(() => {
        // 0-20%: Base Foundation
        if (buildProgress > 5) baseScale.value = withSpring(1);
        else baseScale.value = withTiming(0);

        // 20-40%: Mid Tier Walls
        if (buildProgress > 20) midTierScale.value = withSpring(1);
        else midTierScale.value = withTiming(0);

        // 40-60%: Main Keep
        if (buildProgress > 40) mainTowerScale.value = withSpring(1);
        else mainTowerScale.value = withTiming(0);

        // 60-80%: Side Towers & Spires
        if (buildProgress > 60) sideTowersScale.value = withSpring(1);
        else sideTowersScale.value = withTiming(0);

        // 80-100%: Details (Flags, Windows, Sparkles)
        if (buildProgress > 80) detailsScale.value = withSpring(1);
        else detailsScale.value = withTiming(0);
    }, [buildProgress]);

    const baseStyle = useAnimatedProps(() => ({ transform: [{ scale: baseScale.value }], opacity: baseScale.value }));
    const midTierStyle = useAnimatedProps(() => ({ transform: [{ scale: midTierScale.value }], opacity: midTierScale.value }));
    const mainTowerStyle = useAnimatedProps(() => ({ transform: [{ scale: mainTowerScale.value }], opacity: mainTowerScale.value }));
    const sideTowersStyle = useAnimatedProps(() => ({ transform: [{ scale: sideTowersScale.value }], opacity: sideTowersScale.value }));
    const detailsStyle = useAnimatedProps(() => ({ transform: [{ scale: detailsScale.value }], opacity: detailsScale.value }));

    return (
        <View style={styles.container}>
            <Svg height="350" width="350" viewBox="0 0 400 400">
                <Defs>
                    <LinearGradient id="wallGrad" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor="#E3F2FD" />
                        <Stop offset="1" stopColor="#BBDEFB" />
                    </LinearGradient>
                    <LinearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#42A5F5" />
                        <Stop offset="1" stopColor="#1565C0" />
                    </LinearGradient>
                    <LinearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor="#FFD700" />
                        <Stop offset="1" stopColor="#FFA000" />
                    </LinearGradient>
                </Defs>

                {/* 1. Base Foundation (Wide) */}
                <AnimatedG x="200" y="350" animatedProps={baseStyle}>
                    <Rect x="-180" y="-20" width="360" height="40" fill="#78909C" rx="5" />
                    <Rect x="-160" y="-50" width="320" height="30" fill="url(#wallGrad)" />
                    {/* Drawbridge */}
                    <Path d="M -40 20 L -40 -30 Q 0 -50 40 -30 L 40 20 Z" fill="#5D4037" />
                </AnimatedG>

                {/* 2. Mid Tier Walls */}
                <AnimatedG x="200" y="280" animatedProps={midTierStyle}>
                    <Rect x="-120" y="-60" width="240" height="80" fill="url(#wallGrad)" />
                    {/* Battlements */}
                    <Rect x="-120" y="-70" width="20" height="10" fill="#BBDEFB" />
                    <Rect x="-80" y="-70" width="20" height="10" fill="#BBDEFB" />
                    <Rect x="-40" y="-70" width="20" height="10" fill="#BBDEFB" />
                    <Rect x="0" y="-70" width="20" height="10" fill="#BBDEFB" />
                    <Rect x="40" y="-70" width="20" height="10" fill="#BBDEFB" />
                    <Rect x="80" y="-70" width="20" height="10" fill="#BBDEFB" />
                </AnimatedG>

                {/* 3. Main Keep (Tall) */}
                <AnimatedG x="200" y="200" animatedProps={mainTowerStyle}>
                    <Rect x="-50" y="-100" width="100" height="140" fill="url(#wallGrad)" />
                    <Path d="M -60 -100 L 0 -180 L 60 -100 Z" fill="url(#roofGrad)" />
                    <Circle cx="0" cy="-60" r="20" fill="#1565C0" /> {/* Rose Window */}
                </AnimatedG>

                {/* 4. Side Towers (Many) */}
                <AnimatedG x="200" y="250" animatedProps={sideTowersStyle}>
                    {/* Far Left */}
                    <G x="-140" y="0">
                        <Rect x="-20" y="-80" width="40" height="100" fill="url(#wallGrad)" />
                        <Path d="M -25 -80 L 0 -130 L 25 -80 Z" fill="url(#roofGrad)" />
                    </G>
                    {/* Inner Left */}
                    <G x="-80" y="-20">
                        <Rect x="-25" y="-100" width="50" height="120" fill="url(#wallGrad)" />
                        <Path d="M -30 -100 L 0 -150 L 30 -100 Z" fill="url(#roofGrad)" />
                    </G>
                    {/* Inner Right */}
                    <G x="80" y="-20">
                        <Rect x="-25" y="-100" width="50" height="120" fill="url(#wallGrad)" />
                        <Path d="M -30 -100 L 0 -150 L 30 -100 Z" fill="url(#roofGrad)" />
                    </G>
                    {/* Far Right */}
                    <G x="140" y="0">
                        <Rect x="-20" y="-80" width="40" height="100" fill="url(#wallGrad)" />
                        <Path d="M -25 -80 L 0 -130 L 25 -80 Z" fill="url(#roofGrad)" />
                    </G>
                </AnimatedG>

                {/* 5. Details */}
                <AnimatedG x="200" y="100" animatedProps={detailsStyle}>
                    {/* Main Flag */}
                    <Rect x="-2" y="-180" width="4" height="60" fill="#555" />
                    <Path d="M 0 -180 L 60 -160 L 0 -140 Z" fill="url(#goldGrad)" />

                    {/* Side Flags */}
                    <G x="-80" y="0">
                        <Rect x="-1" y="-150" width="2" height="40" fill="#555" />
                        <Path d="M 0 -150 L 30 -140 L 0 -130 Z" fill="url(#goldGrad)" />
                    </G>
                    <G x="80" y="0">
                        <Rect x="-1" y="-150" width="2" height="40" fill="#555" />
                        <Path d="M 0 -150 L 30 -140 L 0 -130 Z" fill="url(#goldGrad)" />
                    </G>

                    {/* Sparkles */}
                    <Circle cx="-100" cy="-50" r="5" fill="white" opacity="0.8" />
                    <Circle cx="120" cy="-80" r="8" fill="white" opacity="0.6" />
                    <Circle cx="0" cy="-200" r="6" fill="white" opacity="0.9" />
                </AnimatedG>

            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: -20, // Lower it slightly
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -1, // Behind hamster
    },
});
