// =====================================================
// 🦷 DİŞ KAHRAMANI - BADGE COMPONENT
// Rozet gösterim bileşeni
// =====================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';

const Badge = ({
    icon,
    name,
    description,
    isUnlocked = false,
    points = 0,
    size = 'medium', // small, medium, large
}) => {
    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    container: styles.smallContainer,
                    icon: styles.smallIcon,
                    name: styles.smallName,
                };
            case 'large':
                return {
                    container: styles.largeContainer,
                    icon: styles.largeIcon,
                    name: styles.largeName,
                };
            default:
                return {
                    container: styles.mediumContainer,
                    icon: styles.mediumIcon,
                    name: styles.mediumName,
                };
        }
    };

    const sizeStyles = getSizeStyles();

    return (
        <View
            style={[
                styles.container,
                sizeStyles.container,
                !isUnlocked && styles.locked,
            ]}
        >
            <View style={[styles.iconContainer, !isUnlocked && styles.lockedIcon]}>
                <Text style={[styles.icon, sizeStyles.icon]}>
                    {isUnlocked ? icon : '🔒'}
                </Text>
            </View>
            <Text
                style={[
                    styles.name,
                    sizeStyles.name,
                    !isUnlocked && styles.lockedText
                ]}
                numberOfLines={1}
            >
                {name}
            </Text>
            {isUnlocked && points > 0 && (
                <Text style={styles.points}>+{points}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 10,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    locked: {
        backgroundColor: '#F5F5F5',
    },

    // Size variants
    smallContainer: {
        width: 60,
        padding: 8,
    },
    mediumContainer: {
        width: 80,
        padding: 10,
    },
    largeContainer: {
        width: 100,
        padding: 12,
    },

    iconContainer: {
        marginBottom: 5,
    },
    lockedIcon: {
        opacity: 0.5,
    },

    icon: {},
    smallIcon: {
        fontSize: 24,
    },
    mediumIcon: {
        fontSize: 32,
    },
    largeIcon: {
        fontSize: 40,
    },

    name: {
        fontWeight: '600',
        color: COLORS.textPrimary,
        textAlign: 'center',
    },
    smallName: {
        fontSize: 8,
    },
    mediumName: {
        fontSize: 10,
    },
    largeName: {
        fontSize: 12,
    },
    lockedText: {
        color: COLORS.textSecondary,
    },

    points: {
        fontSize: 10,
        color: COLORS.accent,
        fontWeight: 'bold',
        marginTop: 2,
    },
});

export default Badge;
