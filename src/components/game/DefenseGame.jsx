// =====================================================
// 🦷 DİŞ KAHRAMANI - DEFENSE GAME
// Diş savunması oyunu
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
    PanResponder,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { useGame } from '../../contexts/GameContext';
import { COLORS, GAME_SETTINGS } from '../../utils/constants';
import { formatDuration } from '../../utils/helpers';
import * as SoundService from '../../services/SoundService';

import Button from '../common/Button';
import ToothIcon from '../common/ToothIcon';

const { width, height } = Dimensions.get('window');
const TOOTH_SIZE = 80;
const ITEM_SIZE = 50;

// Falling items
const ITEM_TYPES = [
    { id: 'candy', emoji: '🍬', isBad: true, damage: 1 },
    { id: 'chocolate', emoji: '🍫', isBad: true, damage: 1 },
    { id: 'cake', emoji: '🍰', isBad: true, damage: 1 },
    { id: 'soda', emoji: '🥤', isBad: true, damage: 1 },
    { id: 'apple', emoji: '🍎', isBad: false, points: 10 },
    { id: 'carrot', emoji: '🥕', isBad: false, points: 15 },
    { id: 'milk', emoji: '🥛', isBad: false, points: 20 },
    { id: 'cheese', emoji: '🧀', isBad: false, points: 15 },
];

// Falling Item Component
const FallingItem = ({ item, onCatch, gameAreaHeight }) => {
    const fallAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fallAnim, {
            toValue: gameAreaHeight - TOOTH_SIZE - 20,
            duration: GAME_SETTINGS.defense.fallSpeed,
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) {
                onCatch(item, false); // Missed
            }
        });
    }, []);

    return (
        <Animated.View
            style={[
                styles.fallingItem,
                {
                    left: item.x,
                    transform: [{ translateY: fallAnim }],
                },
            ]}
        >
            <Text style={styles.itemEmoji}>{item.type.emoji}</Text>
        </Animated.View>
    );
};

const DefenseGame = () => {
    const navigation = useNavigation();
    const { updateGameStats } = useGame();
    const insets = useSafeAreaInsets();

    // Calculate game area height dynamically
    const bottomSafeArea = Math.max(insets.bottom, 20);
    const gameAreaHeight = height - 180 - bottomSafeArea;

    // Game State
    const [gameState, setGameState] = useState('ready');
    const [timeRemaining, setTimeRemaining] = useState(GAME_SETTINGS.defense.gameDuration);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(GAME_SETTINGS.defense.lives);
    const [items, setItems] = useState([]);
    const [toothPosition, setToothPosition] = useState(width / 2 - TOOTH_SIZE / 2);

    // Refs
    const timerRef = useRef(null);
    const spawnRef = useRef(null);
    const itemIdRef = useRef(0);
    const toothPositionRef = useRef(width / 2 - TOOTH_SIZE / 2);

    // Pan Responder for tooth movement
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                const newX = gestureState.moveX - TOOTH_SIZE / 2;
                const clampedX = Math.max(0, Math.min(width - TOOTH_SIZE, newX));
                setToothPosition(clampedX);
                toothPositionRef.current = clampedX;
            },
        })
    ).current;

    // Start Game
    const startGame = useCallback(() => {
        setGameState('playing');
        setScore(0);
        setLives(GAME_SETTINGS.defense.lives);
        setItems([]);
        setTimeRemaining(GAME_SETTINGS.defense.gameDuration);
        setToothPosition(width / 2 - TOOTH_SIZE / 2);
        SoundService.playGameStart();
    }, []);

    // End Game
    const endGame = useCallback(async () => {
        setGameState('ended');

        if (timerRef.current) clearInterval(timerRef.current);
        if (spawnRef.current) clearInterval(spawnRef.current);

        await updateGameStats('defense', { score });
        SoundService.playGameOver();
    }, [score, updateGameStats]);

    // Spawn Item
    const spawnItem = useCallback(() => {
        const typeIndex = Math.floor(Math.random() * ITEM_TYPES.length);
        const type = ITEM_TYPES[typeIndex];
        const x = Math.random() * (width - ITEM_SIZE);

        const newItem = {
            id: itemIdRef.current++,
            type,
            x,
        };

        setItems((prev) => [...prev, newItem]);
    }, []);

    // Handle Item Catch/Miss
    const handleItemResult = useCallback((item, caught) => {
        setItems((prev) => prev.filter((i) => i.id !== item.id));

        if (caught) {
            // Player caught the item
            if (item.type.isBad) {
                // Caught bad item - lose life
                setLives((prev) => {
                    const newLives = prev - 1;
                    if (newLives <= 0) {
                        endGame();
                    }
                    SoundService.vibrate('heavy');
                    return newLives;
                });
            } else {
                // Caught good item - gain points
                setScore((prev) => prev + item.type.points);
                SoundService.playSuccess();
            }
        } else {
            // Item fell through
            if (!item.type.isBad) {
                // Missed good item - small penalty
                setScore((prev) => Math.max(0, prev - 5));
            }
            // Missed bad item - that's good, no penalty
        }
    }, [endGame]);

    // Check collision - need item center to be at least 30% inside tooth area
    const checkCollision = useCallback((itemX, toothX) => {
        const itemCenter = itemX + ITEM_SIZE / 2;
        const margin = TOOTH_SIZE * 0.15; // 15% margin on each side
        const toothLeft = toothX + margin;
        const toothRight = toothX + TOOTH_SIZE - margin;

        return itemCenter >= toothLeft && itemCenter <= toothRight;
    }, []);

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
                spawnItem();
            }, GAME_SETTINGS.defense.spawnInterval);

            return () => {
                if (timerRef.current) clearInterval(timerRef.current);
                if (spawnRef.current) clearInterval(spawnRef.current);
            };
        }
    }, [gameState, spawnItem, endGame]);

    // Collision detection
    useEffect(() => {
        if (gameState === 'playing') {
            const checkInterval = setInterval(() => {
                items.forEach((item) => {
                    // Check if item is near the catch zone (bottom)
                    // This is a simplified check - the FallingItem handles actual completion
                });
            }, 50);

            return () => clearInterval(checkInterval);
        }
    }, [gameState, items, toothPosition, checkCollision, handleItemResult]);

    // Render Lives
    const renderLives = () => {
        const hearts = [];
        for (let i = 0; i < GAME_SETTINGS.defense.lives; i++) {
            hearts.push(
                <Text key={i} style={styles.heart}>
                    {i < lives ? '❤️' : '🖤'}
                </Text>
            );
        }
        return hearts;
    };

    return (
        <LinearGradient
            colors={[COLORS.success, COLORS.successDark]}
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
                        <View style={styles.lives}>{renderLives()}</View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Süre</Text>
                            <Text style={styles.statValue}>{formatDuration(timeRemaining)}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Skor</Text>
                            <Text style={styles.statValue}>{score}</Text>
                        </View>
                    </View>
                </View>

                {/* Game Area */}
                <View style={styles.gameArea} {...panResponder.panHandlers}>
                    {gameState === 'ready' && (
                        <View style={styles.readyScreen}>
                            <Text style={styles.readyEmoji}>🛡️</Text>
                            <Text style={styles.readyTitle}>Diş Savunması!</Text>
                            <Text style={styles.readyText}>
                                Dişi sürükleyerek sağlıklı yiyecekleri topla,
                                şekerlerden kaçın!
                            </Text>
                            <View style={styles.legend}>
                                <View style={styles.legendItem}>
                                    <Text style={styles.legendEmoji}>🍎🥕🥛</Text>
                                    <Text style={styles.legendText}>Topla!</Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <Text style={styles.legendEmoji}>🍬🍫🍰</Text>
                                    <Text style={styles.legendText}>Kaçın!</Text>
                                </View>
                            </View>
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
                            {/* Falling Items */}
                            {items.map((item) => (
                                <FallingItem
                                    key={item.id}
                                    item={item}
                                    gameAreaHeight={gameAreaHeight}
                                    onCatch={(i, caught) => {
                                        const currentToothX = toothPositionRef.current;
                                        if (checkCollision(i.x, currentToothX)) {
                                            handleItemResult(i, true);
                                        } else {
                                            handleItemResult(i, false);
                                        }
                                    }}
                                />
                            ))}

                            {/* Tooth Catcher */}
                            <Animated.View
                                style={[
                                    styles.toothCatcher,
                                    { left: toothPosition },
                                ]}
                            >
                                <ToothIcon size={TOOTH_SIZE} animated />
                            </Animated.View>

                            {/* Touch hint */}
                            <Text style={styles.touchHint}>← Sürükle →</Text>
                        </>
                    )}
                </View>

                {/* Game Over Modal */}
                <Modal visible={gameState === 'ended'} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalIconBg}>
                                <Text style={styles.modalIcon}>{lives > 0 ? '🎉' : '💔'}</Text>
                            </View>
                            <Text style={styles.modalTitle}>{lives > 0 ? 'Süre Doldu!' : 'Oyun Bitti!'}</Text>

                            <View style={styles.scoreCard}>
                                <Text style={styles.scoreLabel}>Skor</Text>
                                <Text style={styles.scoreValue}>{score}</Text>
                            </View>

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
        gap: 15,
    },
    lives: {
        flexDirection: 'row',
        gap: 3,
    },
    heart: {
        fontSize: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    gameArea: {
        flex: 1,
        position: 'relative',
    },
    fallingItem: {
        position: 'absolute',
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemEmoji: {
        fontSize: 40,
    },
    toothCatcher: {
        position: 'absolute',
        bottom: 120,
        width: TOOTH_SIZE,
        height: TOOTH_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    touchHint: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        textAlign: 'center',
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
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
        marginBottom: 20,
    },
    legend: {
        flexDirection: 'row',
        gap: 30,
        marginBottom: 30,
    },
    legendItem: {
        alignItems: 'center',
    },
    legendEmoji: {
        fontSize: 24,
        marginBottom: 5,
    },
    legendText: {
        fontSize: 14,
        color: COLORS.white,
        fontWeight: '600',
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
        backgroundColor: COLORS.success + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    modalIcon: {
        fontSize: 40,
    },
    modalTitle: {
        fontSize: 26,
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
        marginBottom: 24,
    },
    scoreLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    scoreValue: {
        fontSize: 52,
        fontWeight: '800',
        color: COLORS.success,
    },
    modalButtons: {
        width: '100%',
        gap: 12,
    },
    primaryBtn: {
        backgroundColor: COLORS.success,
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

export default DefenseGame;
