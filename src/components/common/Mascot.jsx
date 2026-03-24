// =====================================================
// 🦷 DİŞ KAHRAMANI - MASCOT COMPONENT
// Konuşan diş maskotu (Dişko)
// =====================================================

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
} from 'react-native';
import { COLORS, MASCOT_MESSAGES } from '../../utils/constants';

const Mascot = ({
    mood = 'happy',
    messageType = 'greeting',
    onPress,
    size = 'medium',
    showBubble = true,
}) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const bubbleAnim = useRef(new Animated.Value(0)).current;
    const eyeBlinkAnim = useRef(new Animated.Value(1)).current;

    // Get random message based on type
    useEffect(() => {
        const messages = MASCOT_MESSAGES[messageType] || MASCOT_MESSAGES.greeting;
        const randomIndex = Math.floor(Math.random() * messages.length);
        setCurrentMessage(messages[randomIndex]);
    }, [messageType]);

    // Bounce animation
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: -8,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    // Bubble fade in
    useEffect(() => {
        if (showBubble) {
            Animated.timing(bubbleAnim, {
                toValue: 1,
                duration: 400,
                delay: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [showBubble, currentMessage]);

    // Eye blink animation
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            Animated.sequence([
                Animated.timing(eyeBlinkAnim, {
                    toValue: 0.1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(eyeBlinkAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();
        }, 3000);

        return () => clearInterval(blinkInterval);
    }, []);

    // Get face based on mood
    const getFace = () => {
        switch (mood) {
            case 'happy':
                return { eyes: '◕', mouth: '‿' };
            case 'excited':
                return { eyes: '★', mouth: 'D' };
            case 'sad':
                return { eyes: '◕', mouth: '︵' };
            case 'sleepy':
                return { eyes: '‿', mouth: '○' };
            default:
                return { eyes: '◕', mouth: '‿' };
        }
    };

    const face = getFace();
    const sizeConfig = {
        small: { container: 60, tooth: 50, fontSize: 14, bubbleWidth: 120 },
        medium: { container: 90, tooth: 75, fontSize: 18, bubbleWidth: 160 },
        large: { container: 120, tooth: 100, fontSize: 24, bubbleWidth: 200 },
    };
    const config = sizeConfig[size];

    return (
        <View style={styles.container}>
            {/* Speech Bubble */}
            {showBubble && currentMessage && (
                <Animated.View
                    style={[
                        styles.speechBubble,
                        {
                            opacity: bubbleAnim,
                            width: config.bubbleWidth,
                            transform: [{ scale: bubbleAnim }],
                        }
                    ]}
                >
                    <Text style={styles.speechText}>{currentMessage}</Text>
                    <View style={styles.bubbleArrow} />
                </Animated.View>
            )}

            {/* Mascot */}
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                disabled={!onPress}
            >
                <Animated.View
                    style={[
                        styles.mascotContainer,
                        {
                            width: config.container,
                            height: config.container,
                            transform: [{ translateY: bounceAnim }],
                        }
                    ]}
                >
                    {/* Tooth body */}
                    <View style={[styles.toothBody, { width: config.tooth, height: config.tooth }]}>
                        {/* Crown */}
                        <View style={styles.crown}>
                            <View style={styles.crownBump} />
                            <View style={[styles.crownBump, styles.crownBumpCenter]} />
                            <View style={styles.crownBump} />
                        </View>

                        {/* Face */}
                        <View style={styles.face}>
                            <View style={styles.eyes}>
                                <Animated.Text
                                    style={[
                                        styles.eye,
                                        { fontSize: config.fontSize, transform: [{ scaleY: eyeBlinkAnim }] }
                                    ]}
                                >
                                    {face.eyes}
                                </Animated.Text>
                                <Animated.Text
                                    style={[
                                        styles.eye,
                                        { fontSize: config.fontSize, transform: [{ scaleY: eyeBlinkAnim }] }
                                    ]}
                                >
                                    {face.eyes}
                                </Animated.Text>
                            </View>
                            <Text style={[styles.mouth, { fontSize: config.fontSize * 1.2 }]}>
                                {face.mouth}
                            </Text>
                        </View>

                        {/* Roots */}
                        <View style={styles.roots}>
                            <View style={styles.root} />
                            <View style={styles.root} />
                        </View>
                    </View>

                    {/* Sparkles */}
                    <Text style={[styles.sparkle, styles.sparkle1]}>✨</Text>
                    <Text style={[styles.sparkle, styles.sparkle2]}>⭐</Text>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    speechBubble: {
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    speechText: {
        fontSize: 14,
        color: COLORS.textPrimary,
        textAlign: 'center',
        fontWeight: '500',
    },
    bubbleArrow: {
        position: 'absolute',
        bottom: -8,
        left: '50%',
        marginLeft: -8,
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: COLORS.white,
    },
    mascotContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    toothBody: {
        backgroundColor: COLORS.toothWhite,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 2,
        borderColor: COLORS.primaryLight,
    },
    crown: {
        flexDirection: 'row',
        position: 'absolute',
        top: -5,
    },
    crownBump: {
        width: 12,
        height: 12,
        backgroundColor: COLORS.toothWhite,
        borderRadius: 6,
        marginHorizontal: 1,
        borderWidth: 1,
        borderColor: COLORS.primaryLight,
    },
    crownBumpCenter: {
        marginTop: -3,
    },
    face: {
        alignItems: 'center',
        paddingTop: 10,
    },
    eyes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
        marginBottom: 2,
    },
    eye: {
        color: COLORS.textPrimary,
    },
    mouth: {
        color: COLORS.primary,
    },
    roots: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: -10,
    },
    root: {
        width: 8,
        height: 15,
        backgroundColor: COLORS.toothWhite,
        borderRadius: 4,
        marginHorizontal: 3,
        borderWidth: 1,
        borderColor: COLORS.primaryLight,
    },
    sparkle: {
        position: 'absolute',
        fontSize: 14,
    },
    sparkle1: {
        top: -5,
        right: -5,
    },
    sparkle2: {
        bottom: 5,
        left: -5,
    },
});

export default Mascot;
