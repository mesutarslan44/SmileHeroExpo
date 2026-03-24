// Score Display Component
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../../utils/constants';

const ScoreDisplay = ({ score = 0, combo = 0, size = 'medium' }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const prevScore = useRef(score);

    useEffect(() => {
        if (score !== prevScore.current) {
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.3,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 3,
                    useNativeDriver: true,
                }),
            ]).start();
            prevScore.current = score;
        }
    }, [score]);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Skor</Text>
            <Animated.Text style={[styles.score, { transform: [{ scale: scaleAnim }] }]}>
                {score}
            </Animated.Text>
            {combo >= 3 && (
                <View style={styles.comboBadge}>
                    <Text style={styles.comboText}>🔥 x{combo}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { alignItems: 'center' },
    label: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
    score: { fontSize: 24, fontWeight: 'bold', color: COLORS.white },
    comboBadge: {
        backgroundColor: COLORS.accent,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 5,
    },
    comboText: { fontSize: 12, fontWeight: 'bold', color: COLORS.textDark },
});

export default ScoreDisplay;
