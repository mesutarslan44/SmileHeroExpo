// Game Timer Component
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../../utils/constants';
import { formatDuration } from '../../utils/helpers';

const GameTimer = ({ time = 0, size = 'medium' }) => {
    const isWarning = time <= 10;

    return (
        <View style={[styles.container, isWarning && styles.warning]}>
            <Text style={styles.icon}>⏱️</Text>
            <Text style={[styles.text, isWarning && styles.warningText]}>
                {formatDuration(time)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        gap: 5,
    },
    warning: { backgroundColor: 'rgba(239, 83, 80, 0.2)' },
    icon: { fontSize: 16 },
    text: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
    warningText: { color: COLORS.danger },
});

export default GameTimer;
