// =====================================================
// 🦷 DİŞ KAHRAMANI - BACTERIA GAME
// Bakterileri temizleme oyunu
// =====================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { useGame } from '../../contexts/GameContext';
import { COLORS, GAME_SETTINGS } from '../../utils/constants';
import { getRandomPosition, formatDuration } from '../../utils/helpers';
import * as SoundService from '../../services/SoundService';

import Button from '../common/Button';

const { width, height } = Dimensions.get('window');
const GAME_AREA_HEIGHT = height - 300;
const BACTERIA_SIZE = 60;

// Bacteria types
const BACTERIA_TYPES = [
    { id: 'purple', emoji: '🦠', color: '#9C27B0', points: 1 },
    { id: 'green', emoji: '🧫', color: '#4CAF50', points: 2 },
    { id: 'red', emoji: '👾', color: '#F44336', points: 3 },
];

// Single Bacteria Component
const Bacteria = ({ bacteria, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const wobbleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Spawn animation
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
        }).start();

        // Wobble animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(wobbleAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(wobbleAnim, {
                    toValue: -1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(wobbleAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const rotate = wobbleAnim.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-15deg', '0deg', '15deg'],
    });

    return (
        <Animated.View
            style={[
                styles.bacteria,
                {
                    left: bacteria.x,
                    top: bacteria.y,
                    transform: [{ scale: scaleAnim }, { rotate }],
                },
            ]}
        >
            <TouchableOpacity
                onPress={() => onPress(bacteria)}
                activeOpacity={0.7}
                style={styles.bacteriaTouch}
            >
                <Text style={styles.bacteriaEmoji}>{bacteria.type.emoji}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Pop Effect Component
const PopEffect = ({ x, y, points }) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const moveAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(moveAnim, {
                toValue: -50,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.popEffect,
                {
                    left: x,
                    top: y,
                    opacity: fadeAnim,
                    transform: [{ translateY: moveAnim }],
                },
            ]}
        >
            <Text style={styles.popText}>+{points}</Text>
        </Animated.View>
    );
};

const BacteriaGame = () => {
    const navigation = useNavigation();
    const { updateGameStats, addPoints } = useGame();

    // Game State
    const [gameState, setGameState] = useState('ready'); // ready, playing, ended
    const [timeRemaining, setTimeRemaining] = useState(GAME_SETTINGS.bacteria.gameDuration);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [bacteria, setBacteria] = useState([]);
    const [popEffects, setPopEffects] = useState([]);
    const [highScore, setHighScore] = useState(0);

    // Refs
    const timerRef = useRef(null);
    const spawnRef = useRef(null);
    const bacteriaIdRef = useRef(0);
    const lastKillTimeRef = useRef(0);

    // Start Game
    const startGame = useCallback(() => {
        setGameState('playing');
        setScore(0);
        setCombo(0);
        setBacteria([]);
        setTimeRemaining(GAME_SETTINGS.bacteria.gameDuration);
        SoundService.playGameStart();
    }, []);

    // End Game
    const endGame = useCallback(async () => {
        setGameState('ended');

        if (timerRef.current) clearInterval(timerRef.current);
        if (spawnRef.current) clearInterval(spawnRef.current);

        // Save stats
        await updateGameStats('bacteria', { score });

        // Update high score
        if (score > highScore) {
            setHighScore(score);
        }

        SoundService.playGameOver();
    }, [score, highScore, updateGameStats]);

    // Spawn Bacteria
    const spawnBacteria = useCallback(() => {
        if (bacteria.length >= GAME_SETTINGS.bacteria.maxBacteria) return;

        const type = BACTERIA_TYPES[Math.floor(Math.random() * BACTERIA_TYPES.length)];
        const position = getRandomPosition(
            width - BACTERIA_SIZE,
            GAME_AREA_HEIGHT - BACTERIA_SIZE,
            20
        );

        const newBacteria = {
            id: bacteriaIdRef.current++,
            type,
            x: position.x,
            y: position.y,
            createdAt: Date.now(),
        };

        setBacteria((prev) => [...prev, newBacteria]);

        // Auto-remove after timeout
        setTimeout(() => {
            setBacteria((prev) => prev.filter((b) => b.id !== newBacteria.id));
        }, GAME_SETTINGS.bacteria.bacteriaSpeed);
    }, [bacteria.length]);

    // Kill Bacteria
    const killBacteria = useCallback((targetBacteria) => {
        const now = Date.now();
        const timeSinceLastKill = now - lastKillTimeRef.current;
        lastKillTimeRef.current = now;

        // Combo system
        let newCombo = combo;
        if (timeSinceLastKill < 1000) {
            newCombo = combo + 1;
        } else {
            newCombo = 1;
        }
        setCombo(newCombo);

        // Calculate points
        let points = targetBacteria.type.points;
        if (newCombo >= 5) {
            points = Math.floor(points * 1.5);
            if (newCombo === 5) SoundService.playCombo();
        }

        setScore((prev) => prev + points);

        // Remove bacteria
        setBacteria((prev) => prev.filter((b) => b.id !== targetBacteria.id));

        // Add pop effect
        setPopEffects((prev) => [
            ...prev,
            {
                id: Date.now(),
                x: targetBacteria.x + BACTERIA_SIZE / 2,
                y: targetBacteria.y,
                points,
            },
        ]);

        // Remove pop effect after animation
        setTimeout(() => {
            setPopEffects((prev) => prev.filter((p) => p.id !== Date.now()));
        }, 500);

        SoundService.playBacteriaHit();
        SoundService.vibrate('light');
    }, [combo]);

    // Timer Effect
    useEffect(() => {
        if (gameState === 'playing') {
            timerRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        endGame();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            spawnRef.current = setInterval(() => {
                spawnBacteria();
            }, GAME_SETTINGS.bacteria.spawnInterval);

            return () => {
                if (timerRef.current) clearInterval(timerRef.current);
                if (spawnRef.current) clearInterval(spawnRef.current);
            };
        }
    }, [gameState, spawnBacteria, endGame]);

    return (
        <LinearGradient
            colors={[COLORS.bacteria, COLORS.bacteriaDark]}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.closeButton}
                    >
                        <Text style={styles.closeIcon}>✕</Text>
                    </TouchableOpacity>

                    <View style={styles.stats}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Süre</Text>
                            <Text style={styles.statValue}>{formatDuration(timeRemaining)}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Skor</Text>
                            <Text style={styles.statValue}>{score}</Text>
                        </View>
                        {combo >= 3 && (
                            <View style={styles.comboBadge}>
                                <Text style={styles.comboText}>🔥 x{combo}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Game Area */}
                <View style={styles.gameArea}>
                    {gameState === 'ready' && (
                        <View style={styles.readyScreen}>
                            <Text style={styles.readyEmoji}>🦠</Text>
                            <Text style={styles.readyTitle}>Bakterileri Temizle!</Text>
                            <Text style={styles.readyText}>
                                Ekranda beliren bakterilere dokun ve temizle!
                            </Text>
                            <Text style={styles.readyTip}>
                                💡 Hızlı olursan kombo yaparsın!
                            </Text>
                            <Button
                                title="Başla"
                                onPress={startGame}
                                size="large"
                                icon="▶️"
                                style={styles.startButton}
                            />
                        </View>
                    )}

                    {gameState === 'playing' && (
                        <>
                            {bacteria.map((b) => (
                                <Bacteria
                                    key={b.id}
                                    bacteria={b}
                                    onPress={killBacteria}
                                />
                            ))}
                            {popEffects.map((p) => (
                                <PopEffect key={p.id} x={p.x} y={p.y} points={p.points} />
                            ))}
                        </>
                    )}
                </View>

                {/* Game Over Modal */}
                <Modal visible={gameState === 'ended'} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalIconBg}>
                                <Text style={styles.modalIcon}>🎮</Text>
                            </View>
                            <Text style={styles.modalTitle}>Oyun Bitti!</Text>

                            <View style={styles.scoreCard}>
                                <Text style={styles.scoreLabel}>Skor</Text>
                                <Text style={styles.scoreValue}>{score}</Text>
                            </View>

                            {score > highScore - score && score > 0 && (
                                <View style={styles.newRecordBadge}>
                                    <Text style={styles.newRecordText}>🏆 Yeni Rekor!</Text>
                                </View>
                            )}

                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.primaryBtn} onPress={startGame}>
                                    <Text style={styles.primaryBtnText}>Tekrar Oyna</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.goBack()}>
                                    <Text style={styles.secondaryBtnText}>Çıkış</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        fontSize: 20,
        color: COLORS.white,
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    comboBadge: {
        backgroundColor: COLORS.accent,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    comboText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    gameArea: {
        flex: 1,
        position: 'relative',
    },
    bacteria: {
        position: 'absolute',
        width: BACTERIA_SIZE,
        height: BACTERIA_SIZE,
    },
    bacteriaTouch: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bacteriaEmoji: {
        fontSize: 50,
    },
    popEffect: {
        position: 'absolute',
        zIndex: 100,
    },
    popText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.accent,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    readyScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    readyEmoji: {
        fontSize: 80,
        marginBottom: 20,
    },
    readyTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 15,
        textAlign: 'center',
    },
    readyText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginBottom: 10,
    },
    readyTip: {
        fontSize: 14,
        color: COLORS.accent,
        marginBottom: 30,
    },
    startButton: {
        backgroundColor: COLORS.accent,
        minWidth: 200,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: 28,
        padding: 32,
        alignItems: 'center',
        width: width * 0.85,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    modalIconBg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.bacteria + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    modalIcon: {
        fontSize: 40,
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginBottom: 20,
    },
    scoreCard: {
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 40,
        paddingVertical: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    scoreLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    scoreValue: {
        fontSize: 52,
        fontWeight: '800',
        color: COLORS.bacteria,
    },
    newRecordBadge: {
        backgroundColor: COLORS.accent + '20',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginBottom: 24,
    },
    newRecordText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.accent,
    },
    modalButtons: {
        width: '100%',
        gap: 12,
    },
    primaryBtn: {
        backgroundColor: COLORS.bacteria,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    primaryBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.white,
    },
    secondaryBtn: {
        backgroundColor: '#F1F5F9',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    secondaryBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
});

export default BacteriaGame;
