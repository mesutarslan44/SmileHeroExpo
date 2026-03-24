// =====================================================
// 🦷 DİŞ KAHRAMANI - BUTTON COMPONENT
// Özelleştirilebilir buton bileşeni
// =====================================================

import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Animated,
    View,
} from 'react-native';
import { COLORS } from '../../utils/constants';

const Button = ({
    title,
    onPress,
    variant = 'primary', // primary, secondary, outline
    size = 'medium', // small, medium, large
    icon,
    disabled = false,
    style,
    textStyle,
}) => {
    const scaleValue = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const getButtonStyle = () => {
        const baseStyle = [styles.button, styles[`${size}Button`]];

        switch (variant) {
            case 'secondary':
                baseStyle.push(styles.secondaryButton);
                break;
            case 'outline':
                baseStyle.push(styles.outlineButton);
                break;
            default:
                baseStyle.push(styles.primaryButton);
        }

        if (disabled) {
            baseStyle.push(styles.disabledButton);
        }

        return baseStyle;
    };

    const getTextStyle = () => {
        const baseStyle = [styles.buttonText, styles[`${size}Text`]];

        switch (variant) {
            case 'secondary':
                baseStyle.push(styles.secondaryText);
                break;
            case 'outline':
                baseStyle.push(styles.outlineText);
                break;
            default:
                baseStyle.push(styles.primaryText);
        }

        if (disabled) {
            baseStyle.push(styles.disabledText);
        }

        return baseStyle;
    };

    return (
        <Animated.View style={[{ transform: [{ scale: scaleValue }] }, style]}>
            <TouchableOpacity
                style={getButtonStyle()}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
                activeOpacity={0.8}
            >
                {icon && (
                    <Text style={styles.icon}>{icon}</Text>
                )}
                <Text style={[getTextStyle(), textStyle]}>{title}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        gap: 8,
    },

    // Sizes
    smallButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    mediumButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    largeButton: {
        paddingVertical: 16,
        paddingHorizontal: 32,
    },

    // Variants
    primaryButton: {
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    secondaryButton: {
        backgroundColor: COLORS.secondary,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    disabledButton: {
        backgroundColor: '#E0E0E0',
        shadowOpacity: 0,
        elevation: 0,
    },

    // Text Styles
    buttonText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    smallText: {
        fontSize: 12,
    },
    mediumText: {
        fontSize: 14,
    },
    largeText: {
        fontSize: 18,
    },
    primaryText: {
        color: COLORS.white,
    },
    secondaryText: {
        color: COLORS.textDark,
    },
    outlineText: {
        color: COLORS.primary,
    },
    disabledText: {
        color: '#9E9E9E',
    },

    icon: {
        fontSize: 18,
    },
});

export default Button;
