// =====================================================
// 🦷 DİŞ KAHRAMANI - TOOTH ICON COMPONENT
// SVG diş ikonu
// =====================================================

import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import Svg, { Path, G, Circle } from 'react-native-svg';
import { COLORS } from '../../utils/constants';

const AnimatedG = Animated.createAnimatedComponent(G);

const ToothIcon = ({
    size = 60,
    color = COLORS.toothWhite,
    outlineColor = COLORS.primary,
    animated = false,
    healthy = true,
}) => {
    const sparkleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (animated) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(sparkleAnim, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(sparkleAnim, {
                        toValue: 0,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [animated]);

    const sparkleOpacity = sparkleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 1],
    });

    const toothColor = healthy ? color : COLORS.toothWarning;

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 100 100">
                {/* Tooth Body */}
                <Path
                    d="M50 10
             C30 10 20 25 20 40
             C20 55 25 65 30 80
             C32 86 35 90 38 90
             C42 90 44 85 46 75
             C47 70 49 68 50 68
             C51 68 53 70 54 75
             C56 85 58 90 62 90
             C65 90 68 86 70 80
             C75 65 80 55 80 40
             C80 25 70 10 50 10
             Z"
                    fill={toothColor}
                    stroke={outlineColor}
                    strokeWidth="3"
                />

                {/* Tooth Highlights */}
                <Path
                    d="M35 30
             C35 30 40 25 50 25
             C55 25 58 27 58 27"
                    fill="none"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="4"
                    strokeLinecap="round"
                />

                {/* Eyes (when healthy/happy) */}
                {healthy && (
                    <>
                        <Circle cx="38" cy="40" r="4" fill={outlineColor} />
                        <Circle cx="62" cy="40" r="4" fill={outlineColor} />
                        <Circle cx="40" cy="38" r="1.5" fill="white" />
                        <Circle cx="64" cy="38" r="1.5" fill="white" />
                    </>
                )}

                {/* Smile */}
                {healthy && (
                    <Path
                        d="M40 52 Q50 62 60 52"
                        fill="none"
                        stroke={outlineColor}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                )}

                {/* Sparkle effects */}
                {animated && (
                    <AnimatedG style={{ opacity: sparkleOpacity }}>
                        <Path
                            d="M15 20 L18 25 L15 30 L12 25 Z"
                            fill={COLORS.accent}
                        />
                        <Path
                            d="M85 15 L88 20 L85 25 L82 20 Z"
                            fill={COLORS.accent}
                        />
                        <Path
                            d="M10 55 L12 58 L10 61 L8 58 Z"
                            fill={COLORS.accent}
                        />
                    </AnimatedG>
                )}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ToothIcon;
