import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, Path, G, Defs, RadialGradient, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withRepeat,
    withTiming,
    Easing,
    withSequence
} from 'react-native-reanimated';

const AnimatedG = Animated.createAnimatedComponent(G);

interface HamsterProps {
    isActive: boolean;
    isDead?: boolean;
}

export const Hamster: React.FC<HamsterProps> = ({ isActive, isDead }) => {
    const armRotation = useSharedValue(0);
    const bodyBounce = useSharedValue(0);
    const headTilt = useSharedValue(0);
    const bodyRotation = useSharedValue(0); // For falling over

    useEffect(() => {
        if (isDead) {
            // Death animation: Fall over
            armRotation.value = withTiming(180, { duration: 500 });
            bodyBounce.value = withTiming(20, { duration: 500 }); // Drop down
            headTilt.value = withTiming(-45, { duration: 500 });
            bodyRotation.value = withTiming(90, { duration: 500, easing: Easing.bounce });
        } else if (isActive) {
            // Complex building motion
            bodyRotation.value = withTiming(0);
            armRotation.value = withRepeat(
                withSequence(
                    withTiming(-60, { duration: 300, easing: Easing.cubic }),
                    withTiming(10, { duration: 150, easing: Easing.out(Easing.back(1.5)) }),
                    withTiming(0, { duration: 300 })
                ),
                -1,
                false
            );

            bodyBounce.value = withRepeat(
                withSequence(
                    withTiming(-3, { duration: 300 }),
                    withTiming(0, { duration: 300 })
                ),
                -1,
                true
            );

            headTilt.value = withRepeat(
                withSequence(
                    withTiming(5, { duration: 1000 }),
                    withTiming(-5, { duration: 1000 })
                ),
                -1,
                true
            );
        } else {
            bodyRotation.value = withTiming(0);
            armRotation.value = withTiming(0);
            bodyBounce.value = withTiming(0);
            headTilt.value = withTiming(0);
        }
    }, [isActive, isDead]);

    const armStyle = useAnimatedProps(() => ({
        transform: [{ rotate: `${armRotation.value}deg` }, { translateY: bodyBounce.value }],
    }));

    const bodyStyle = useAnimatedProps(() => ({
        transform: [{ translateY: bodyBounce.value }, { rotate: `${bodyRotation.value}deg` }],
    }));

    const headStyle = useAnimatedProps(() => ({
        transform: [{ rotate: `${headTilt.value}deg` }],
    }));

    return (
        <View style={styles.container}>
            <Svg height="220" width="220" viewBox="0 0 200 200">
                <Defs>
                    <RadialGradient id="furGrad" cx="50%" cy="50%" r="50%">
                        <Stop offset="0%" stopColor="#F4A460" />
                        <Stop offset="80%" stopColor="#CD853F" />
                        <Stop offset="100%" stopColor="#8B4513" />
                    </RadialGradient>
                    <LinearGradient id="bellyGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor="#FFF" />
                        <Stop offset="100%" stopColor="#EEE8AA" />
                    </LinearGradient>
                    <RadialGradient id="cheekGrad" cx="50%" cy="50%" r="50%">
                        <Stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.6" />
                        <Stop offset="100%" stopColor="#FFB6C1" stopOpacity="0" />
                    </RadialGradient>
                </Defs>

                {/* Shadow */}
                <Ellipse cx="100" cy="180" rx="50" ry="10" fill="rgba(0,0,0,0.15)" />

                <AnimatedG animatedProps={bodyStyle}>
                    {/* Main Body - Simple Round Egg Shape */}
                    {/* Grey Top */}
                    <Path d="M 50 140 A 50 50 0 1 1 150 140 L 150 150 A 50 30 0 1 1 50 150 Z" fill="#CFD8DC" />

                    {/* White Belly - Large and soft */}
                    <Path d="M 50 140 Q 100 190 150 140 L 150 150 Q 100 200 50 150 Z" fill="#FFF" />
                    <Ellipse cx="100" cy="150" rx="45" ry="40" fill="#FFF" />

                    {/* Feet - Tiny nubs */}
                    <Ellipse cx="70" cy="180" rx="10" ry="6" fill="#FFCCBC" />
                    <Ellipse cx="130" cy="180" rx="10" ry="6" fill="#FFCCBC" />
                </AnimatedG>

                {/* Head Group */}
                <AnimatedG x="100" y="100" animatedProps={headStyle}>
                    {/* Head Shape - Integrated */}
                    {/* Grey Top */}
                    <Path d="M -50 20 A 50 45 0 1 1 50 20 L 50 40 A 50 20 0 1 1 -50 40 Z" fill="#CFD8DC" />

                    {/* White Face Mask - Bottom half */}
                    <Path d="M -50 20 Q 0 50 50 20 L 50 40 Q 0 70 -50 40 Z" fill="#FFF" />

                    {/* Ears - Round and cute */}
                    <G>
                        <Circle cx="-40" cy="-30" r="15" fill="#CFD8DC" />
                        <Circle cx="-40" cy="-30" r="10" fill="#FFCCBC" />
                    </G>
                    <G>
                        <Circle cx="40" cy="-30" r="15" fill="#CFD8DC" />
                        <Circle cx="40" cy="-30" r="10" fill="#FFCCBC" />
                    </G>

                    {/* Eyes - Wide set, low, simple */}
                    {isDead ? (
                        <>
                            {/* Dead Eyes (X X) */}
                            <Path d="M -25 -5 L -15 5" stroke="#555" strokeWidth="3" strokeLinecap="round" />
                            <Path d="M -15 -5 L -25 5" stroke="#555" strokeWidth="3" strokeLinecap="round" />

                            <Path d="M 15 -5 L 25 5" stroke="#555" strokeWidth="3" strokeLinecap="round" />
                            <Path d="M 25 -5 L 15 5" stroke="#555" strokeWidth="3" strokeLinecap="round" />
                        </>
                    ) : (
                        <>
                            {/* Kawaii Eyes - Simple black dots with highlights */}
                            <Circle cx="-25" cy="0" r="7" fill="#263238" />
                            <Circle cx="-27" cy="-2" r="2.5" fill="#FFF" />

                            <Circle cx="25" cy="0" r="7" fill="#263238" />
                            <Circle cx="23" cy="-2" r="2.5" fill="#FFF" />
                        </>
                    )}

                    {/* Nose & Mouth - Tiny */}
                    <Ellipse cx="0" cy="8" rx="3" ry="2" fill="#FFCCBC" />
                    <Path d="M -3 12 Q 0 14 3 12" stroke="#8D6E63" strokeWidth="1.5" fill="none" strokeLinecap="round" />

                    {/* Cheeks - Soft Pink */}
                    <Circle cx="-40" cy="10" r="8" fill="#FFAB91" opacity="0.4" />
                    <Circle cx="40" cy="10" r="8" fill="#FFAB91" opacity="0.4" />
                </AnimatedG>

                {/* Active Arm (Hammering) */}
                <AnimatedG x="130" y="130" animatedProps={armStyle}>
                    {/* Hands - Tiny nubs */}
                    <Circle cx="0" cy="0" r="6" fill="#FFCCBC" />

                    {/* Golden Hammer */}
                    {isActive && !isDead && (
                        <G transform="rotate(-45)">
                            <Rect x="-3" y="-20" width="6" height="25" fill="#8D6E63" rx="2" />
                            <Rect x="-10" y="-30" width="20" height="12" fill="#FFD700" rx="2" stroke="#FBC02D" strokeWidth="1" />
                        </G>
                    )}
                </AnimatedG>

                {/* Passive Arm */}
                <AnimatedG animatedProps={bodyStyle}>
                    <Circle cx="70" cy="130" r="6" fill="#FFCCBC" />
                </AnimatedG>

            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 220,
        height: 220,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10, // In front of castle
    },
});

