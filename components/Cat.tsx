import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Ellipse, Polygon, G, Rect } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withRepeat,
    withTiming,
    withSequence,
    Easing
} from 'react-native-reanimated';

const AnimatedG = Animated.createAnimatedComponent(G);

interface CatProps {
    isActive: boolean;
    isDead?: boolean;
}

export const Cat: React.FC<CatProps> = ({ isActive, isDead }) => {
    const handMove = useSharedValue(0);
    const headTilt = useSharedValue(0);
    const bodyRotation = useSharedValue(0);

    useEffect(() => {
        if (isDead) {
            // Death animation: Fall over
            handMove.value = withTiming(0);
            headTilt.value = withTiming(30, { duration: 500 });
            bodyRotation.value = withTiming(90, { duration: 500, easing: Easing.bounce });
        } else if (isActive) {
            // Stacking motion (Lift up and place down)
            bodyRotation.value = withTiming(0);
            handMove.value = withRepeat(
                withSequence(
                    withTiming(-20, { duration: 500, easing: Easing.out(Easing.quad) }), // Lift
                    withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) })   // Place
                ),
                -1,
                true
            );

            // Head bobbing (Watching the stack)
            headTilt.value = withRepeat(
                withSequence(
                    withTiming(-5, { duration: 1000 }),
                    withTiming(5, { duration: 1000 })
                ),
                -1,
                true
            );
        } else {
            bodyRotation.value = withTiming(0);
            handMove.value = withTiming(0);
            headTilt.value = withTiming(0);
        }
    }, [isActive, isDead]);

    const handStyle = useAnimatedProps(() => ({
        transform: [{ translateY: handMove.value }],
    }));

    const headStyle = useAnimatedProps(() => ({
        transform: [{ rotate: `${headTilt.value}deg` }],
    }));

    const bodyStyle = useAnimatedProps(() => ({
        transform: [{ rotate: `${bodyRotation.value}deg` }, { translateY: isDead ? 50 : 0 }],
        originY: 170, // Rotate around bottom
    }));

    return (
        <View style={styles.container}>
            <Svg height="200" width="200" viewBox="0 0 200 200">
                {/* Shadow */}
                <Ellipse cx="100" cy="180" rx="50" ry="10" fill="rgba(0,0,0,0.15)" />

                <AnimatedG animatedProps={bodyStyle}>
                    {/* Tail - Grey, curved up */}
                    <Path d="M 130 160 Q 160 140 150 100" stroke="#A9A9A9" strokeWidth="10" strokeLinecap="round" fill="none" />

                    {/* Body - Sitting Pose */}
                    {/* Back/Haunches (Grey) */}
                    <Ellipse cx="100" cy="150" rx="40" ry="35" fill="#A9A9A9" />

                    {/* White Chest/Belly */}
                    <Ellipse cx="100" cy="150" rx="25" ry="30" fill="#FFF" />

                    {/* Front Paws (White) */}
                    <Ellipse cx="85" cy="180" rx="10" ry="6" fill="#FFF" />
                    <Ellipse cx="115" cy="180" rx="10" ry="6" fill="#FFF" />

                    {/* Back Paws (Grey, slightly behind) */}
                    <Ellipse cx="65" cy="175" rx="10" ry="6" fill="#A9A9A9" />
                    <Ellipse cx="135" cy="175" rx="10" ry="6" fill="#A9A9A9" />

                    {/* Head */}
                    <AnimatedG x="100" y="95" animatedProps={headStyle}>
                        {/* Head Shape - Grey Top */}
                        <Path d="M -40 0 A 40 35 0 1 1 40 0 L 40 10 A 40 35 0 1 1 -40 10 Z" fill="#A9A9A9" />

                        {/* Face Mask - White (Bottom half and center) */}
                        <Path d="M -40 10 Q -20 40 0 10 Q 20 40 40 10 A 40 35 0 0 1 -40 10" fill="#FFF" />
                        <Path d="M 0 -15 L -15 10 L 15 10 Z" fill="#FFF" /> {/* White blaze on forehead */}

                        {/* Ears - Grey with Pink inside */}
                        <Path d="M -30 -25 L -40 -50 L -10 -30 Z" fill="#A9A9A9" stroke="#A9A9A9" strokeWidth="2" strokeLinejoin="round" />
                        <Path d="M 30 -25 L 40 -50 L 10 -30 Z" fill="#A9A9A9" stroke="#A9A9A9" strokeWidth="2" strokeLinejoin="round" />

                        <Path d="M -30 -28 L -38 -45 L -15 -32 Z" fill="#FFB6C1" />
                        <Path d="M 30 -28 L 38 -45 L 15 -32 Z" fill="#FFB6C1" />

                        {/* Face Details */}
                        {isDead ? (
                            <>
                                {/* Dead Eyes (X X) */}
                                <Path d="M -25 -5 L -10 10" stroke="#555" strokeWidth="3" strokeLinecap="round" />
                                <Path d="M -10 -5 L -25 10" stroke="#555" strokeWidth="3" strokeLinecap="round" />

                                <Path d="M 10 -5 L 25 10" stroke="#555" strokeWidth="3" strokeLinecap="round" />
                                <Path d="M 25 -5 L 10 10" stroke="#555" strokeWidth="3" strokeLinecap="round" />
                            </>
                        ) : (
                            <>
                                {/* Cute Eyes */}
                                <Circle cx="-20" cy="0" r="6" fill="#3E2723" />
                                <Circle cx="20" cy="0" r="6" fill="#3E2723" />
                                {/* Highlights */}
                                <Circle cx="-22" cy="-2" r="2" fill="#FFF" />
                                <Circle cx="18" cy="-2" r="2" fill="#FFF" />
                            </>
                        )}

                        {/* Nose & Mouth */}
                        <Polygon points="-3,12 3,12 0,15" fill="#FFB6C1" />
                        <Path d="M -3 15 Q -6 18 -3 20" stroke="#3E2723" strokeWidth="2" fill="none" />
                        <Path d="M 3 15 Q 6 18 3 20" stroke="#3E2723" strokeWidth="2" fill="none" />

                        {/* Whiskers */}
                        <Path d="M -45 5 L -60 0" stroke="#555" strokeWidth="1.5" />
                        <Path d="M -45 10 L -60 10" stroke="#555" strokeWidth="1.5" />
                        <Path d="M -45 15 L -60 20" stroke="#555" strokeWidth="1.5" />

                        <Path d="M 45 5 L 60 0" stroke="#555" strokeWidth="1.5" />
                        <Path d="M 45 10 L 60 10" stroke="#555" strokeWidth="1.5" />
                        <Path d="M 45 15 L 60 20" stroke="#555" strokeWidth="1.5" />

                        {/* Heart (Love) - Floating */}
                        {!isDead && isActive && (
                            <Path d="M 50 -20 Q 60 -30 70 -20 Q 80 -30 90 -20 Q 90 -10 70 10 Q 50 -10 50 -20" fill="#FF69B4" transform="scale(0.6)" />
                        )}
                    </AnimatedG>

                    {/* Hands Stacking (Only if active and not dead) */}
                    {!isDead && isActive && (
                        <AnimatedG animatedProps={handStyle}>
                            {/* Left Paw holding can */}
                            <Circle cx="85" cy="150" r="8" fill="#FFF" />

                            {/* The Can being held */}
                            <G x="85" y="130">
                                <Rect x="-10" y="-15" width="20" height="15" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="1" />
                                <Rect x="-10" y="-10" width="20" height="5" fill="#FFAB91" />
                            </G>

                            {/* Right Paw helping */}
                            <Circle cx="115" cy="150" r="8" fill="#FFF" />
                        </AnimatedG>
                    )}
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
