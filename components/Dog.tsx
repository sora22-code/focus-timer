import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Ellipse, G, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
    withSpring
} from 'react-native-reanimated';

const AnimatedG = Animated.createAnimatedComponent(G);

interface DogProps {
    isActive: boolean;
    isDead: boolean;
}

export const Dog: React.FC<DogProps> = ({ isActive, isDead }) => {
    const bodyRotation = useSharedValue(0);
    const armRotation = useSharedValue(0);
    const tailRotation = useSharedValue(0);
    const headTilt = useSharedValue(0);

    useEffect(() => {
        if (isDead) {
            // Death animation: Fall over
            armRotation.value = withTiming(180, { duration: 500 });
            headTilt.value = withTiming(-45, { duration: 500 });
            bodyRotation.value = withTiming(90, { duration: 500, easing: Easing.bounce });
            tailRotation.value = withTiming(0);
        } else if (isActive) {
            // Building motion (Hammering)
            bodyRotation.value = withTiming(0);
            armRotation.value = withRepeat(
                withSequence(
                    withTiming(-45, { duration: 200 }),
                    withTiming(45, { duration: 100, easing: Easing.bounce }), // Hit!
                    withTiming(0, { duration: 200 })
                ),
                -1,
                true
            );

            // Tail Wagging - Fast when working!
            tailRotation.value = withRepeat(
                withSequence(
                    withTiming(15, { duration: 100 }),
                    withTiming(-15, { duration: 100 })
                ),
                -1,
                true
            );

            headTilt.value = withRepeat(
                withSequence(
                    withTiming(5, { duration: 500 }),
                    withTiming(-5, { duration: 500 })
                ),
                -1,
                true
            );
        } else {
            // Idle
            bodyRotation.value = withTiming(0);
            armRotation.value = withTiming(0);
            headTilt.value = withTiming(0);

            // Slow tail wag
            tailRotation.value = withRepeat(
                withSequence(
                    withTiming(5, { duration: 1000 }),
                    withTiming(-5, { duration: 1000 })
                ),
                -1,
                true
            );
        }
    }, [isActive, isDead]);

    const bodyStyle = useAnimatedProps(() => ({
        transform: [{ rotate: `${bodyRotation.value}deg` }],
        originX: 100,
        originY: 180,
    }));

    const armStyle = useAnimatedProps(() => ({
        transform: [{ rotate: `${armRotation.value}deg` }],
        originX: 130,
        originY: 130,
    }));

    const headStyle = useAnimatedProps(() => ({
        transform: [{ rotate: `${headTilt.value}deg` }],
        originX: 100,
        originY: 100,
    }));

    const tailStyle = useAnimatedProps(() => ({
        transform: [{ rotate: `${tailRotation.value}deg` }],
        originX: 100,
        originY: 160,
    }));

    return (
        <View style={styles.container}>
            <Svg height="200" width="200" viewBox="0 0 200 200">
                <Defs>
                    <LinearGradient id="dogFur" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor="#D7CCC8" />
                        <Stop offset="1" stopColor="#A1887F" />
                    </LinearGradient>
                </Defs>

                {/* Shadow */}
                <Ellipse cx="100" cy="185" rx="60" ry="10" fill="rgba(0,0,0,0.15)" />

                <AnimatedG animatedProps={bodyStyle}>
                    {/* Tail */}
                    <AnimatedG animatedProps={tailStyle}>
                        <Path d="M 100 160 Q 130 140 140 110" stroke="#A1887F" strokeWidth="12" strokeLinecap="round" fill="none" />
                    </AnimatedG>

                    {/* Body - Pear Shape */}
                    <Path d="M 60 180 Q 50 120 80 100 L 120 100 Q 150 120 140 180 Z" fill="url(#dogFur)" />

                    {/* White Belly */}
                    <Path d="M 80 180 Q 80 130 100 130 Q 120 130 120 180 Z" fill="#FFF" />

                    {/* Feet */}
                    <Ellipse cx="70" cy="185" rx="12" ry="8" fill="#FFF" />
                    <Ellipse cx="130" cy="185" rx="12" ry="8" fill="#FFF" />
                </AnimatedG>

                {/* Head Group */}
                <AnimatedG x="100" y="90" animatedProps={headStyle}>
                    {/* Head Shape */}
                    <Ellipse cx="0" cy="0" rx="45" ry="40" fill="url(#dogFur)" />

                    {/* Ears - Floppy */}
                    <Path d="M -35 -10 Q -60 0 -50 40 Q -40 50 -30 30" fill="#8D6E63" />
                    <Path d="M 35 -10 Q 60 0 50 40 Q 40 50 30 30" fill="#8D6E63" />

                    {/* Face Mask/Muzzle */}
                    <Ellipse cx="0" cy="15" rx="25" ry="20" fill="#FFF" />

                    {/* Eyes */}
                    {isDead ? (
                        <>
                            <Path d="M -25 -5 L -15 5" stroke="#555" strokeWidth="3" strokeLinecap="round" />
                            <Path d="M -15 -5 L -25 5" stroke="#555" strokeWidth="3" strokeLinecap="round" />
                            <Path d="M 15 -5 L 25 5" stroke="#555" strokeWidth="3" strokeLinecap="round" />
                            <Path d="M 25 -5 L 15 5" stroke="#555" strokeWidth="3" strokeLinecap="round" />
                        </>
                    ) : (
                        <>
                            <Circle cx="-20" cy="-5" r="6" fill="#3E2723" />
                            <Circle cx="-22" cy="-7" r="2" fill="#FFF" />
                            <Circle cx="20" cy="-5" r="6" fill="#3E2723" />
                            <Circle cx="18" cy="-7" r="2" fill="#FFF" />
                        </>
                    )}

                    {/* Nose */}
                    <Ellipse cx="0" cy="10" rx="6" ry="4" fill="#3E2723" />

                    {/* Mouth */}
                    <Path d="M -5 20 Q 0 25 5 20" stroke="#3E2723" strokeWidth="2" fill="none" strokeLinecap="round" />

                    {/* Cheeks */}
                    <Circle cx="-30" cy="15" r="6" fill="#FFAB91" opacity="0.5" />
                    <Circle cx="30" cy="15" r="6" fill="#FFAB91" opacity="0.5" />
                </AnimatedG>

                {/* Active Arm (Hammering) */}
                <AnimatedG x="130" y="130" animatedProps={armStyle}>
                    <Circle cx="0" cy="0" r="8" fill="#FFF" />
                    {isActive && !isDead && (
                        <G transform="rotate(-45)">
                            <Rect x="-3" y="-25" width="6" height="30" fill="#8D6E63" rx="2" />
                            <Rect x="-10" y="-35" width="20" height="12" fill="#FFD700" rx="2" stroke="#FBC02D" strokeWidth="1" />
                        </G>
                    )}
                </AnimatedG>

                {/* Passive Arm */}
                <AnimatedG animatedProps={bodyStyle}>
                    <Circle cx="70" cy="130" r="8" fill="#FFF" />
                </AnimatedG>

            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
