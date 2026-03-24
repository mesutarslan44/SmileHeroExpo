// =====================================================
// 🦷 DİŞ KAHRAMANI - PREMIUM SPLASH SCREEN
// Profesyonel açılış ekranı
// =====================================================

import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../utils/constants';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
    const logoScale = useRef(new Animated.Value(0.3)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const progressWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animasyon dizisi
        Animated.sequence([
            // Logo fade in ve scale
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    friction: 4,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
            // Text fade in
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            // Progress bar
            Animated.timing(progressWidth, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: false,
            }),
        ]).start(() => {
            if (onFinish) onFinish();
        });

        // Shimmer effect
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <LinearGradient
            colors={['#0077B6', '#00B4D8', '#48CAE4']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {/* Background Pattern */}
            <View style={styles.patternContainer}>
                {[...Array(6)].map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.patternCircle,
                            {
                                width: 100 + i * 80,
                                height: 100 + i * 80,
                                borderRadius: 50 + i * 40,
                                opacity: 0.03 + i * 0.01,
                            },
                        ]}
                    />
                ))}
            </View>

            {/* Logo */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: logoOpacity,
                        transform: [{ scale: logoScale }],
                    },
                ]}
            >
                <View style={styles.logoOuter}>
                    <View style={styles.logoInner}>
                        <Text style={styles.logoIcon}>🦷</Text>
                    </View>
                </View>

                {/* Shimmer Effect */}
                <Animated.View
                    style={[
                        styles.shimmer,
                        {
                            opacity: shimmerAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.3, 0.8],
                            }),
                        },
                    ]}
                />
            </Animated.View>

            {/* App Name */}
            <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
                <Text style={styles.appName}>Diş Kahramanı</Text>
                <Text style={styles.tagline}>Sağlıklı Gülüşler İçin</Text>
            </Animated.View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                    <Animated.View
                        style={[
                            styles.progressBar,
                            {
                                width: progressWidth.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '100%'],
                                }),
                            },
                        ]}
                    />
                </View>
                <Animated.Text style={[styles.loadingText, { opacity: textOpacity }]}>
                    Yükleniyor...
                </Animated.Text>
            </View>

            {/* Version */}
            <Text style={styles.version}>v1.0.0</Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    patternContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    patternCircle: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    logoContainer: {
        marginBottom: 40,
    },
    logoOuter: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    logoInner: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
    },
    logoIcon: {
        fontSize: 60,
    },
    shimmer: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    appName: {
        fontSize: 42,
        fontWeight: '900',
        color: COLORS.white,
        letterSpacing: 2,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 10,
        fontWeight: '500',
        letterSpacing: 1,
    },
    progressContainer: {
        width: width * 0.6,
        alignItems: 'center',
    },
    progressTrack: {
        width: '100%',
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: COLORS.white,
        borderRadius: 2,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
    },
    version: {
        position: 'absolute',
        bottom: 40,
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
    },
});

export default SplashScreen;
