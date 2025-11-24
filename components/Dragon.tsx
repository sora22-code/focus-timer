import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Ellipse, G, Defs, LinearGradient, Stop, Polygon } from 'react-native-svg';
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

interface DragonProps {
    isActive: boolean;
    isDead: boolean;
}

export const Dragon: React.FC<DragonProps> = ({ isActive, isDead }) => {
    const bodyHover = useSharedValue(0);
    const wingFlap = useSharedValue(0);
    const headTilt = useSharedValue(0);
    const tailSway = useSharedValue(0);

    useEffect(() => {
        if (isDead) {
            // Death animation: Fall over
            bodyHover.value = withTiming(50, { duration: 500 }); // Drop down
            wingFlap.value = withTiming(90, { duration: 500 }); // Wings droop
            headTilt.value = withTiming(45, { duration: 500 });
            tailSway.value = withTiming(0);
        } else if (isActive) {
            // Active: Flying/Guarding (Fast flap)
            bodyHover.value = withRepeat(
                withSequence(
                    withTiming(-10, { duration: 500, easing: Easing.inOut(Easing.quad) }),
                    withTiming(0, { duration: 500, easing: Easing.inOut(Easing.quad) })
                ),
                -1,
                true
            );

            wingFlap.value = withRepeat(
                withSequence(
                    withTiming(-20, { duration: 150 }), // Flap Up
                    withTiming(20, { duration: 150 })   // Flap Down
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
            // Idle: Hovering (Slow flap)
            bodyHover.value = withRepeat(
                withSequence(
                    withTiming(-5, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
                    withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.quad) })
                ),
                -1,
                true
            );

            wingFlap.value = withRepeat(
                withSequence(
                    withTiming(-10, { duration: 500 }),
                    withTiming(10, { duration: 500 })
                ),
                -1,
                true
            );

            headTilt.value = withTiming(0);
        }
    }, [isActive, isDead]);

    const bodyStyle = useAnimatedProps(() => ({
        transform: [{ translateY: bodyHover.value }],
    }));

    const leftWingStyle = useAnimatedProps(() => ({
        transform: [{ rotate: `${wingFlap.value}deg` }],
        originX: 70,
        originY: 120,
    }));

    const rightWingStyle = useAnimatedProps(() => ({
        transform: [{ rotate: `${-wingFlap.value}deg` }], // Mirror rotation
        originX: 130,
        originY: 120,
    }));

    const headStyle = useAnimatedProps(() => ({
        transform: [{ rotate: `${headTilt.value}deg` }],
        originX: 100,
        originY: 100,
    }));

    return (
        <View style={styles.container}>
            <Svg height="250" width="250" viewBox="0 0 200 200">
                <Defs>
                    <LinearGradient id="dragonRed" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor="#EF5350" />
                        <Stop offset="1" stopColor="#C62828" />
                    </LinearGradient>
                    <LinearGradient id="wingGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#FFCDD2" />
                        <Stop offset="1" stopColor="#EF9A9A" />
                    </LinearGradient>
                </Defs>

                {/* Shadow */}
                <Ellipse cx="100" cy="190" rx="40" ry="8" fill="rgba(0,0,0,0.15)" />

                <AnimatedG animatedProps={bodyStyle}>
                    {/* Wings (Behind body) - Realistic Bat-like */}
                    <AnimatedG animatedProps={leftWingStyle}>
                        {/* Wing Membrane */}
                        <Path d="M 70 120 L 20 80 Q 10 100 30 110 Q 40 130 50 120 Q 60 140 70 130 Z" fill="url(#wingGrad)" stroke="#C62828" strokeWidth="1" />
                        {/* Wing Fingers/Bones */}
                        <Path d="M 70 120 L 20 80" stroke="#B71C1C" strokeWidth="2" />
                        <Path d="M 20 80 L 30 110" stroke="#B71C1C" strokeWidth="1" />
                        <Path d="M 20 80 L 50 120" stroke="#B71C1C" strokeWidth="1" />
                    </AnimatedG>
                    <AnimatedG animatedProps={rightWingStyle}>
                        {/* Wing Membrane */}
                        <Path d="M 130 120 L 180 80 Q 190 100 170 110 Q 160 130 150 120 Q 140 140 130 130 Z" fill="url(#wingGrad)" stroke="#C62828" strokeWidth="1" />
                        {/* Wing Fingers/Bones */}
                        <Path d="M 130 120 L 180 80" stroke="#B71C1C" strokeWidth="2" />
                        <Path d="M 180 80 L 170 110" stroke="#B71C1C" strokeWidth="1" />
                        <Path d="M 180 80 L 150 120" stroke="#B71C1C" strokeWidth="1" />
                    </AnimatedG>

                    {/* Tail */}
                    <Path d="M 100 160 Q 130 180 140 160" stroke="#C62828" strokeWidth="8" strokeLinecap="round" fill="none" />
                    <Polygon points="140,160 150,150 150,170" fill="#C62828" />

                    {/* Body */}
                    <Path d="M 70 170 Q 60 110 100 100 Q 140 110 130 170 Z" fill="url(#dragonRed)" />

                    {/* Belly Scales */}
                    <Path d="M 85 170 Q 85 120 100 120 Q 115 120 115 170 Z" fill="#FFEB3B" opacity="0.8" />
                    <Path d="M 85 130 L 115 130" stroke="#FBC02D" strokeWidth="1" />
                    <Path d="M 85 140 L 115 140" stroke="#FBC02D" strokeWidth="1" />
                    <Path d="M 85 150 L 115 150" stroke="#FBC02D" strokeWidth="1" />
                    <Path d="M 85 160 L 115 160" stroke="#FBC02D" strokeWidth="1" />

                    {/* Feet */}
                    <Ellipse cx="80" cy="175" rx="10" ry="6" fill="#C62828" />
                    <Ellipse cx="120" cy="175" rx="10" ry="6" fill="#C62828" />

                    {/* Head Group */}
                    <AnimatedG x="100" y="90" animatedProps={headStyle}>
                        {/* Head Shape */}
                        <Ellipse cx="0" cy="0" rx="35" ry="30" fill="url(#dragonRed)" />

                        {/* Horns */}
                        <Path d="M -20 -20 L -30 -40 L -10 -25 Z" fill="#FFECB3" />
                        <Path d="M 20 -20 L 30 -40 L 10 -25 Z" fill="#FFECB3" />

                        {/* Eyes */}
                        {isDead ? (
                            <>
                                <Path d="M -20 -5 L -10 5" stroke="#555" strokeWidth="3" strokeLinecap="round" />
                                <Path d="M -10 -5 L -20 5" stroke="#555" strokeWidth="3" strokeLinecap="round" />
                                <Path d="M 10 -5 L 20 5" stroke="#555" strokeWidth="3" strokeLinecap="round" />
                                <Path d="M 20 -5 L 10 5" stroke="#555" strokeWidth="3" strokeLinecap="round" />
                            </>
                        ) : (
                            <>
                                <Circle cx="-15" cy="-5" r="5" fill="#000" />
                                <Circle cx="-17" cy="-7" r="2" fill="#FFF" />
                                <Circle cx="15" cy="-5" r="5" fill="#000" />
                                <Circle cx="13" cy="-7" r="2" fill="#FFF" />
                            </>
                        )}

                        {/* Snout */}
                        <Ellipse cx="0" cy="10" rx="15" ry="10" fill="#EF9A9A" />
                        <Circle cx="-5" cy="8" r="2" fill="#B71C1C" />
                        <Circle cx="5" cy="8" r="2" fill="#B71C1C" />

                        {/* Fire Breath (Active Only) */}
                        {isActive && !isDead && (
                            <G>
                                <Circle cx="0" cy="25" r="5" fill="#FF5722" opacity="0.8" />
                                <Circle cx="-5" cy="30" r="3" fill="#FFC107" opacity="0.6" />
                                <Circle cx="5" cy="30" r="3" fill="#FFC107" opacity="0.6" />
                            </G>
                        )}
                    </AnimatedG>
                </AnimatedG>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 250,
        height: 250,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
