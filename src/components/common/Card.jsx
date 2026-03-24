// =====================================================
// 🦷 DİŞ KAHRAMANI - CARD COMPONENT
// Kart bileşeni
// =====================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';

const Card = ({ children, style, variant = 'default' }) => {
    const getCardStyle = () => {
        const baseStyle = [styles.card];

        switch (variant) {
            case 'elevated':
                baseStyle.push(styles.elevated);
                break;
            case 'outlined':
                baseStyle.push(styles.outlined);
                break;
            case 'gradient':
                baseStyle.push(styles.gradient);
                break;
            default:
                baseStyle.push(styles.default);
        }

        return baseStyle;
    };

    return (
        <View style={[getCardStyle(), style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        backgroundColor: COLORS.white,
        overflow: 'hidden',
    },
    default: {
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    elevated: {
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    outlined: {
        borderWidth: 1,
        borderColor: COLORS.primaryLight,
        shadowOpacity: 0,
        elevation: 0,
    },
    gradient: {
        backgroundColor: COLORS.primaryLight,
    },
});

export default Card;
