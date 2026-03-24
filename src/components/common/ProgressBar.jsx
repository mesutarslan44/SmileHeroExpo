// =====================================================
// 🦷 DİŞ KAHRAMANI - PROGRESS BAR COMPONENT
// Animasyonlu ilerleme çubuğu
// =====================================================

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../../utils/constants';

const ProgressBar = ({
    progress = 0, // 0 to 1
    color = COLORS.primary,
    backgroundColor = COLORS.primaryLight,
    height = 10,
    borderRadius,
    showPercentage = false,
    animated = true,
    style,
}) => {
    const animatedWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (animated) {
            Animated.timing(animatedWidth, {
                toValue: progress,
                duration: 600,
                useNativeDriver: false,
            }).start();
        } else {
            animatedWidth.setValue(progress);
        }
    }, [progress, animated]);

    const width = animatedWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
    });

    const calculatedBorderRadius = borderRadius !== undefined ? borderRadius : height / 2;

    return (
        <View style={[styles.container, style]}>
            <View
                style={[
                    styles.track,
                    {
                        backgroundColor,
                        height,
                        borderRadius: calculatedBorderRadius,
                    },
                ]}
            >
                <Animated.View
                    style={[
                        styles.fill,
                        {
                            backgroundColor: color,
                            width,
                            borderRadius: calculatedBorderRadius,
                        },
                    ]}
                />
            </View>
            {showPercentage && (
                <Text style={styles.percentage}>
                    {Math.round(progress * 100)}%
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    track: {
        width: '100%',
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
    },
    percentage: {
        position: 'absolute',
        right: 0,
        top: -20,
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
});

export default ProgressBar;
