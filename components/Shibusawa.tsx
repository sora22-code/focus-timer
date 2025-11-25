import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect, Circle, G, Ellipse } from 'react-native-svg';
import Animated, {
    useAnimatedProps,
    withRepeat,
    withSequence,
    withTiming,
    useSharedValue,
    Easing,
} from 'react-native-reanimated';

const AnimatedG = Animated.createAnimatedComponent(G);

interface ShibusawaProps {
    isActive: boolean;
    isDead: boolean;
}

export const Shibusawa: React.FC<ShibusawaProps> = ({ isActive, isDead }) => {
    const headTilt = useSharedValue(0);

    React.useEffect(() => {
        if (isActive && !isDead) {
            headTilt.value = withRepeat(
                withSequence(
                    withTiming(-2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                    withTiming(2, { duration: 1000, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                false
            );
        } else {
            headTilt.value = withTiming(0, { duration: 300 });
        }
    }, [isActive, isDead]);

    const headProps = useAnimatedProps(() => {
        return {
            transform: [{ rotate: `${headTilt.value}deg` }],
        };
    });

    return (
        <View style={{ width: 150, height: 200, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width="150" height="200" viewBox="0 0 150 200">
                {/* Kimono body */}
                <Path
                    d="M 50 80 L 45 120 L 40 180 L 60 180 L 60 160 L 75 160 L 90 160 L 90 180 L 110 180 L 105 120 L 100 80 Z"
                    fill={isDead ? "#555" : "#2c3e50"}
                    stroke={isDead ? "#333" : "#1a252f"}
                    strokeWidth="2"
                />

                {/* Belt/Obi */}
                <Rect
                    x="45"
                    y="100"
                    width="60"
                    height="15"
                    fill={isDead ? "#444" : "#8B4513"}
                    stroke={isDead ? "#222" : "#654321"}
                    strokeWidth="1"
                />

                {/* Arms */}
                <Path
                    d="M 50 80 L 30 95 L 25 110"
                    fill="none"
                    stroke={isDead ? "#555" : "#2c3e50"}
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                <Path
                    d="M 100 80 L 120 95 L 125 110"
                    fill="none"
                    stroke={isDead ? "#555" : "#2c3e50"}
                    strokeWidth="8"
                    strokeLinecap="round"
                />

                {/* Hands */}
                <Circle cx="25" cy="110" r="6" fill={isDead ? "#aaa" : "#f4c2a0"} />
                <Circle cx="125" cy="110" r="6" fill={isDead ? "#aaa" : "#f4c2a0"} />

                <AnimatedG animatedProps={headProps} origin="75, 60">
                    {/* Head */}
                    <Circle
                        cx="75"
                        cy="50"
                        r="22"
                        fill={isDead ? "#999" : "#f4c2a0"}
                        stroke={isDead ? "#666" : "#d4a574"}
                        strokeWidth="1"
                    />

                    {/* Hair (traditional style) */}
                    <Path
                        d="M 55 45 Q 55 30 75 28 Q 95 30 95 45"
                        fill={isDead ? "#333" : "#1a1a1a"}
                    />
                    <Ellipse
                        cx="75"
                        cy="35"
                        rx="20"
                        ry="12"
                        fill={isDead ? "#333" : "#1a1a1a"}
                    />

                    {/* Face */}
                    {isDead ? (
                        <>
                            {/* Dead eyes (X marks) */}
                            <Path d="M 63 48 L 69 54 M 69 48 L 63 54" stroke="#000" strokeWidth="2" />
                            <Path d="M 81 48 L 87 54 M 87 48 L 81 54" stroke="#000" strokeWidth="2" />
                        </>
                    ) : (
                        <>
                            {/* Eyes */}
                            <Circle cx="66" cy="50" r="2" fill="#000" />
                            <Circle cx="84" cy="50" r="2" fill="#000" />
                        </>
                    )}

                    {/* Mustache */}
                    <Path
                        d="M 65 58 Q 70 60 75 59 Q 80 60 85 58"
                        fill="none"
                        stroke={isDead ? "#555" : "#3a3a3a"}
                        strokeWidth="2"
                        strokeLinecap="round"
                    />

                    {/* Gentle smile */}
                    {!isDead && (
                        <Path
                            d="M 67 62 Q 75 65 83 62"
                            fill="none"
                            stroke="#000"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    )}
                </AnimatedG>
            </Svg>
        </View>
    );
};
