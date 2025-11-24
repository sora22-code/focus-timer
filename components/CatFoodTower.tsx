import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Ellipse, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withSpring,
    withDelay
} from 'react-native-reanimated';

const AnimatedG = Animated.createAnimatedComponent(G);

interface CatFoodTowerProps {
    progress: number; // 0 to 1
}

// Helper to create a single can
const CatCan = ({ x, y, scale = 1, delay = 0, show }: { x: number, y: number, scale?: number, delay?: number, show: boolean }) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(-50); // Drop from above

    useEffect(() => {
        if (show) {
            opacity.value = withDelay(delay, withSpring(1));
            translateY.value = withDelay(delay, withSpring(0));
        } else {
            opacity.value = withSpring(0);
            translateY.value = withSpring(-50);
        }
    }, [show]);

    const animatedStyle = useAnimatedProps(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }, { scale }],
    }));

    return (
        <AnimatedG x={x} y={y} animatedProps={animatedStyle}>
            {/* Can Body */}
            <Rect x="-15" y="-20" width="30" height="25" fill="url(#canGrad)" />
            <Ellipse cx="0" cy="5" rx="15" ry="5" fill="#B0BEC5" /> {/* Bottom Rim */}
            <Ellipse cx="0" cy="-20" rx="15" ry="5" fill="#ECEFF1" /> {/* Top Lid */}

            {/* Label */}
            <Rect x="-15" y="-15" width="30" height="15" fill="#FFAB91" opacity="0.8" />
            {/* Fish Icon on Label */}
            <Path d="M -5 -8 L 5 -8 L 0 -2 Z" fill="#D84315" />
        </AnimatedG>
    );
};

export const CatFoodTower: React.FC<CatFoodTowerProps> = ({ progress }) => {
    // Calculate how many cans to show based on progress (max 10 cans for a 4-3-2-1 pyramid)
    // Actually let's do a simpler stack or a 3-2-1 pyramid (6 cans) or 4-3-2-1 (10 cans)
    // Let's aim for 10 cans max.
    const totalCans = 10;
    const cansToShow = Math.floor(progress * totalCans);

    return (
        <View style={styles.container}>
            <Svg height="300" width="300" viewBox="0 0 300 300">
                <Defs>
                    <LinearGradient id="canGrad" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor="#CFD8DC" />
                        <Stop offset="0.5" stopColor="#ECEFF1" />
                        <Stop offset="1" stopColor="#B0BEC5" />
                    </LinearGradient>
                </Defs>

                {/* Base Row (4 cans) */}
                <CatCan x={100} y={280} show={cansToShow >= 1} delay={0} />
                <CatCan x={135} y={280} show={cansToShow >= 2} delay={100} />
                <CatCan x={170} y={280} show={cansToShow >= 3} delay={200} />
                <CatCan x={205} y={280} show={cansToShow >= 4} delay={300} />

                {/* Second Row (3 cans) */}
                <CatCan x={117} y={255} show={cansToShow >= 5} delay={400} />
                <CatCan x={152} y={255} show={cansToShow >= 6} delay={500} />
                <CatCan x={187} y={255} show={cansToShow >= 7} delay={600} />

                {/* Third Row (2 cans) */}
                <CatCan x={135} y={230} show={cansToShow >= 8} delay={700} />
                <CatCan x={170} y={230} show={cansToShow >= 9} delay={800} />

                {/* Top Row (1 can) */}
                <CatCan x={152} y={205} show={cansToShow >= 10} delay={900} />

            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: -20,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -1, // Behind cat
    },
});
