// =====================================================
// 🦷 DİŞ KAHRAMANI - ANIMATED TOOTH COMPONENT
// Premium 3D-style animated tooth visualization
// =====================================================

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, {
    Path,
    G,
    Defs,
    LinearGradient as SvgLinearGradient,
    Stop,
    Circle,
    Ellipse,
} from 'react-native-svg';

const AnimatedG = Animated.createAnimatedComponent(G);

// 8 Bölgeli Diş Fırçalama Haritası
export const BRUSHING_ZONES = [
    { id: 'upper_outer_right', name: 'Üst Sağ Dış', duration: 15, position: 'upper-right-outer', instruction: 'Dıştan içe doğru dairesel hareketlerle fırçala' },
    { id: 'upper_outer_left', name: 'Üst Sol Dış', duration: 15, position: 'upper-left-outer', instruction: 'Aynı şekilde sol tarafı fırçala' },
    { id: 'upper_inner_right', name: 'Üst Sağ İç', duration: 15, position: 'upper-right-inner', instruction: 'Fırçayı dikey tutarak yukarı aşağı hareketlerle' },
    { id: 'upper_inner_left', name: 'Üst Sol İç', duration: 15, position: 'upper-left-inner', instruction: 'İç yüzeyleri nazikçe temizle' },
    { id: 'lower_outer_right', name: 'Alt Sağ Dış', duration: 15, position: 'lower-right-outer', instruction: 'Alt dişlerin dış yüzeylerini fırçala' },
    { id: 'lower_outer_left', name: 'Alt Sol Dış', duration: 15, position: 'lower-left-outer', instruction: 'Sol alt dıştan devam et' },
    { id: 'lower_inner_right', name: 'Alt Sağ İç', duration: 15, position: 'lower-right-inner', instruction: 'Alt iç yüzeyleri temizle' },
    { id: 'lower_inner_left', name: 'Alt Sol İç', duration: 15, position: 'lower-left-inner', instruction: 'Son bölge! Bitirmek üzeresin' },
];

// Premium 3D Diş Modeli
const AnimatedTooth = ({ activeZone, isRunning }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const brushAnim = useRef(new Animated.Value(0)).current;

    // Pulse animation for active zone
    useEffect(() => {
        if (isRunning && activeZone !== null) {
            // Pulse effect
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 600,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 600,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Glow effect
            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: false,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0.3,
                        duration: 800,
                        useNativeDriver: false,
                    }),
                ])
            ).start();

            // Brushing motion animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(brushAnim, {
                        toValue: 1,
                        duration: 400,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(brushAnim, {
                        toValue: 0,
                        duration: 400,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
            glowAnim.setValue(0);
            brushAnim.setValue(0);
        }

        return () => {
            pulseAnim.stopAnimation();
            glowAnim.stopAnimation();
            brushAnim.stopAnimation();
        };
    }, [isRunning, activeZone]);

    // Zone colors based on active state
    const getZoneColor = (zoneIndex) => {
        if (!isRunning) return '#E8F5E9';
        if (zoneIndex < activeZone) return '#4CAF50'; // Completed - green
        if (zoneIndex === activeZone) return '#FFB703'; // Active - orange/gold
        return 'rgba(255,255,255,0.3)'; // Upcoming - faded
    };

    const getZoneOpacity = (zoneIndex) => {
        if (!isRunning) return 0.5;
        if (zoneIndex < activeZone) return 1;
        if (zoneIndex === activeZone) return 1;
        return 0.3;
    };

    const brushOffset = brushAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 8],
    });

    return (
        <View style={styles.container}>
            {/* Glow effect behind tooth */}
            {isRunning && (
                <Animated.View
                    style={[
                        styles.glowEffect,
                        {
                            opacity: glowAnim,
                            transform: [{ scale: pulseAnim }],
                        }
                    ]}
                />
            )}

            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Svg width={280} height={320} viewBox="0 0 280 320">
                    <Defs>
                        {/* Tooth gradient - white to slight cream */}
                        <SvgLinearGradient id="toothGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <Stop offset="0%" stopColor="#FFFFFF" />
                            <Stop offset="50%" stopColor="#F5F5F5" />
                            <Stop offset="100%" stopColor="#E8E8E8" />
                        </SvgLinearGradient>

                        {/* Active zone gradient */}
                        <SvgLinearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <Stop offset="0%" stopColor="#FFD54F" />
                            <Stop offset="100%" stopColor="#FFB703" />
                        </SvgLinearGradient>

                        {/* Completed zone gradient */}
                        <SvgLinearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <Stop offset="0%" stopColor="#81C784" />
                            <Stop offset="100%" stopColor="#4CAF50" />
                        </SvgLinearGradient>

                        {/* Gum gradient */}
                        <SvgLinearGradient id="gumGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <Stop offset="0%" stopColor="#FFB6C1" />
                            <Stop offset="100%" stopColor="#FF9AA2" />
                        </SvgLinearGradient>
                    </Defs>

                    {/* ===== UPPER JAW ===== */}
                    <G>
                        {/* Upper Gum Line */}
                        <Ellipse cx="140" cy="60" rx="120" ry="35" fill="url(#gumGradient)" />

                        {/* Upper Teeth Row */}
                        <G>
                            {/* Upper Right Outer Teeth (Zone 0) */}
                            <G opacity={getZoneOpacity(0)}>
                                <Path
                                    d="M200 55 L210 90 Q210 110 200 115 L190 110 Q185 95 190 60 Z"
                                    fill={activeZone === 0 ? 'url(#activeGradient)' : (activeZone > 0 ? 'url(#completedGradient)' : 'url(#toothGradient)')}
                                    stroke={activeZone === 0 ? '#FB8500' : '#DDD'}
                                    strokeWidth={activeZone === 0 ? 2 : 1}
                                />
                                <Path
                                    d="M220 60 L235 100 Q235 115 225 120 L210 115 Q205 95 210 65 Z"
                                    fill={activeZone === 0 ? 'url(#activeGradient)' : (activeZone > 0 ? 'url(#completedGradient)' : 'url(#toothGradient)')}
                                    stroke={activeZone === 0 ? '#FB8500' : '#DDD'}
                                    strokeWidth={activeZone === 0 ? 2 : 1}
                                />
                            </G>

                            {/* Upper Left Outer Teeth (Zone 1) */}
                            <G opacity={getZoneOpacity(1)}>
                                <Path
                                    d="M80 55 L70 90 Q70 110 80 115 L90 110 Q95 95 90 60 Z"
                                    fill={activeZone === 1 ? 'url(#activeGradient)' : (activeZone > 1 ? 'url(#completedGradient)' : 'url(#toothGradient)')}
                                    stroke={activeZone === 1 ? '#FB8500' : '#DDD'}
                                    strokeWidth={activeZone === 1 ? 2 : 1}
                                />
                                <Path
                                    d="M60 60 L45 100 Q45 115 55 120 L70 115 Q75 95 70 65 Z"
                                    fill={activeZone === 1 ? 'url(#activeGradient)' : (activeZone > 1 ? 'url(#completedGradient)' : 'url(#toothGradient)')}
                                    stroke={activeZone === 1 ? '#FB8500' : '#DDD'}
                                    strokeWidth={activeZone === 1 ? 2 : 1}
                                />
                            </G>

                            {/* Upper Front Teeth (Center) */}
                            <G>
                                <Path
                                    d="M115 50 L110 85 Q110 100 120 105 L135 105 Q145 100 145 85 L140 50 Z"
                                    fill="url(#toothGradient)"
                                    stroke="#DDD"
                                    strokeWidth={1}
                                />
                                <Path
                                    d="M145 50 L140 85 Q140 100 150 105 L165 105 Q175 100 175 85 L170 50 Z"
                                    fill="url(#toothGradient)"
                                    stroke="#DDD"
                                    strokeWidth={1}
                                />
                            </G>

                            {/* Zones 2-3: Upper Inner (shown as shading overlay) */}
                            {(activeZone === 2 || activeZone === 3) && (
                                <G>
                                    <Ellipse
                                        cx={activeZone === 2 ? 195 : 85}
                                        cy="80"
                                        rx="25"
                                        ry="15"
                                        fill="url(#activeGradient)"
                                        opacity={0.7}
                                    />
                                </G>
                            )}
                        </G>
                    </G>

                    {/* ===== CENTER DIVIDER ===== */}
                    <Path
                        d="M40 160 Q140 175 240 160"
                        fill="none"
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth={2}
                        strokeDasharray="5,5"
                    />

                    {/* ===== LOWER JAW ===== */}
                    <G>
                        {/* Lower Gum Line */}
                        <Ellipse cx="140" cy="260" rx="120" ry="35" fill="url(#gumGradient)" />

                        {/* Lower Teeth Row */}
                        <G>
                            {/* Lower Right Outer Teeth (Zone 4) */}
                            <G opacity={getZoneOpacity(4)}>
                                <Path
                                    d="M200 265 L210 230 Q210 210 200 205 L190 210 Q185 225 190 260 Z"
                                    fill={activeZone === 4 ? 'url(#activeGradient)' : (activeZone > 4 ? 'url(#completedGradient)' : 'url(#toothGradient)')}
                                    stroke={activeZone === 4 ? '#FB8500' : '#DDD'}
                                    strokeWidth={activeZone === 4 ? 2 : 1}
                                />
                                <Path
                                    d="M220 260 L235 220 Q235 205 225 200 L210 205 Q205 225 210 255 Z"
                                    fill={activeZone === 4 ? 'url(#activeGradient)' : (activeZone > 4 ? 'url(#completedGradient)' : 'url(#toothGradient)')}
                                    stroke={activeZone === 4 ? '#FB8500' : '#DDD'}
                                    strokeWidth={activeZone === 4 ? 2 : 1}
                                />
                            </G>

                            {/* Lower Left Outer Teeth (Zone 5) */}
                            <G opacity={getZoneOpacity(5)}>
                                <Path
                                    d="M80 265 L70 230 Q70 210 80 205 L90 210 Q95 225 90 260 Z"
                                    fill={activeZone === 5 ? 'url(#activeGradient)' : (activeZone > 5 ? 'url(#completedGradient)' : 'url(#toothGradient)')}
                                    stroke={activeZone === 5 ? '#FB8500' : '#DDD'}
                                    strokeWidth={activeZone === 5 ? 2 : 1}
                                />
                                <Path
                                    d="M60 260 L45 220 Q45 205 55 200 L70 205 Q75 225 70 255 Z"
                                    fill={activeZone === 5 ? 'url(#activeGradient)' : (activeZone > 5 ? 'url(#completedGradient)' : 'url(#toothGradient)')}
                                    stroke={activeZone === 5 ? '#FB8500' : '#DDD'}
                                    strokeWidth={activeZone === 5 ? 2 : 1}
                                />
                            </G>

                            {/* Lower Front Teeth (Center) */}
                            <G>
                                <Path
                                    d="M115 270 L110 235 Q110 220 120 215 L135 215 Q145 220 145 235 L140 270 Z"
                                    fill="url(#toothGradient)"
                                    stroke="#DDD"
                                    strokeWidth={1}
                                />
                                <Path
                                    d="M145 270 L140 235 Q140 220 150 215 L165 215 Q175 220 175 235 L170 270 Z"
                                    fill="url(#toothGradient)"
                                    stroke="#DDD"
                                    strokeWidth={1}
                                />
                            </G>

                            {/* Zones 6-7: Lower Inner (shown as shading overlay) */}
                            {(activeZone === 6 || activeZone === 7) && (
                                <G>
                                    <Ellipse
                                        cx={activeZone === 6 ? 195 : 85}
                                        cy="240"
                                        rx="25"
                                        ry="15"
                                        fill="url(#activeGradient)"
                                        opacity={0.7}
                                    />
                                </G>
                            )}
                        </G>
                    </G>

                    {/* Brushing indicator arrow for active zone */}
                    {isRunning && activeZone !== null && (
                        <G>
                            <Animated.View style={{ transform: [{ translateX: brushOffset }] }}>
                                {/* This would be animated brush indicator */}
                            </Animated.View>
                        </G>
                    )}
                </Svg>
            </Animated.View>

            {/* Animated Toothbrush */}
            {isRunning && (
                <Animated.View
                    style={[
                        styles.toothbrush,
                        {
                            transform: [
                                {
                                    translateX: brushOffset.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-10, 10],
                                    })
                                },
                                {
                                    rotate: brushOffset.interpolate({
                                        inputRange: [0, 0.5, 1],
                                        outputRange: ['-5deg', '5deg', '-5deg'],
                                    })
                                },
                            ],
                            top: activeZone < 4 ? 60 : 200,
                            left: activeZone % 2 === 0 ? 200 : 30,
                        }
                    ]}
                >
                    <Svg width={60} height={120} viewBox="0 0 30 80">
                        {/* Brush handle */}
                        <Path
                            d="M10 30 L10 75 Q15 80 20 75 L20 30 Z"
                            fill="#4FC3F7"
                            stroke="#0288D1"
                            strokeWidth={1}
                        />
                        {/* Brush head */}
                        <Path
                            d="M8 5 L8 32 Q15 35 22 32 L22 5 Q15 2 8 5 Z"
                            fill="#E1F5FE"
                            stroke="#0288D1"
                            strokeWidth={1}
                        />
                        {/* Bristles */}
                        <G stroke="#FFFFFF" strokeWidth={1.5}>
                            <Path d="M10 8 L10 28" />
                            <Path d="M15 6 L15 30" />
                            <Path d="M20 8 L20 28" />
                        </G>
                    </Svg>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 280,
        height: 320,
        alignItems: 'center',
        justifyContent: 'center',
    },
    glowEffect: {
        position: 'absolute',
        width: 300,
        height: 340,
        borderRadius: 170,
        backgroundColor: 'rgba(255, 183, 3, 0.3)',
    },
    toothbrush: {
        position: 'absolute',
    },
});

export default AnimatedTooth;
