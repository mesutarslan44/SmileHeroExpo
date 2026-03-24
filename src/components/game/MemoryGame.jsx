// =====================================================
// 🦷 DİŞ KAHRAMANI - MEMORY GAME
// Hafıza kartı eşleştirme oyunu
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
import { shuffleArray, formatDuration } from '../../utils/helpers';
import * as SoundService from '../../services/SoundService';

import Button from '../common/Button';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARDS_PER_ROW = 4;
const CARD_SIZE = (width - 60 - CARD_MARGIN * (CARDS_PER_ROW - 1) * 2) / CARDS_PER_ROW;

// Card icons (8 pairs)
const CARD_ICONS = [
    { id: 'tooth', emoji: '🦷' },
    { id: 'brush', emoji: '🪥' },
    { id: 'paste', emoji: '🧴' },
    { id: 'apple', emoji: '🍎' },
    { id: 'smile', emoji: '😁' },
    { id: 'star', emoji: '⭐' },
    { id: 'heart', emoji: '❤️' },
    { id: 'crown', emoji: '👑' },
];

// Single Card Component
const Card = ({ card, onPress, isFlipped, isMatched }) => {
    const flipAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(flipAnim, {
            toValue: isFlipped || isMatched ? 1 : 0,
            friction: 8,
            tension: 100,
            useNativeDriver: true,
        }).start();
    }, [isFlipped, isMatched]);

    const frontRotation = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const backRotation = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onPress(card)}
            disabled={isFlipped || isMatched}
            style={styles.cardContainer}
        >
            {/* Card Back (Question Mark) */}
            <Animated.View
                style={[
                    styles.card,
                    styles.cardBack,
                    {
                        transform: [{ rotateY: frontRotation }],
                        opacity: flipAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [1, 0, 0],
                        }),
                    },
                ]}
            >
                <Text style={styles.cardQuestion}>❓</Text>
            </Animated.View>

            {/* Card Front (Icon) */}
            <Animated.View
                style={[
                    styles.card,
                    styles.cardFront,
                    isMatched && styles.cardMatched,
                    {
                        transform: [{ rotateY: backRotation }],
                        opacity: flipAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0, 0, 1],
                        }),
                    },
                ]}
            >
                <Text style={styles.cardEmoji}>{card.emoji}</Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

const MemoryGame = () => {
    const navigation = useNavigation();
    const { updateGameStats } = useGame();

    // Game State
    const [gameState, setGameState] = useState('ready');
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [moves, setMoves] = useState(0);
    const [time, setTime] = useState(0);
    const [isChecking, setIsChecking] = useState(false);

    // Refs
    const timerRef = useRef(null);

    // Initialize Cards
    const initializeCards = useCallback(() => {
        const cardPairs = [...CARD_ICONS, ...CARD_ICONS].map((icon, index) => ({
            id: index,
            pairId: icon.id,
            emoji: icon.emoji,
        }));

        setCards(shuffleArray(cardPairs));
        setFlippedCards([]);
        setMatchedPairs([]);
        setMoves(0);
        setTime(0);
    }, []);

    // Start Game
    const startGame = useCallback(() => {
        initializeCards();
        setGameState('playing');
        SoundService.playGameStart();
    }, [initializeCards]);

    // End Game
    const endGame = useCallback(async () => {
        setGameState('ended');

        if (timerRef.current) clearInterval(timerRef.current);

        // Calculate score based on moves and time
        const baseScore = 80; // Max 80 points for 8 pairs
        const timeBonus = Math.max(0, 100 - time); // Bonus for fast completion
        const movePenalty = Math.max(0, (moves - 8) * 2); // Penalty for extra moves
        const finalScore = Math.max(10, baseScore + timeBonus - movePenalty);

        await updateGameStats('memory', { score: finalScore, time });
        SoundService.playComplete();
    }, [moves, time, updateGameStats]);

    // Handle Card Press
    const handleCardPress = useCallback((card) => {
        if (isChecking || flippedCards.length >= 2) return;
        if (flippedCards.some((c) => c.id === card.id)) return;
        if (matchedPairs.includes(card.pairId)) return;

        SoundService.playCardFlip();

        const newFlipped = [...flippedCards, card];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setMoves((prev) => prev + 1);
            setIsChecking(true);

            setTimeout(() => {
                if (newFlipped[0].pairId === newFlipped[1].pairId) {
                    // Match found
                    setMatchedPairs((prev) => [...prev, newFlipped[0].pairId]);
                    SoundService.playMatch();
                    SoundService.vibrate('light');
                }

                setFlippedCards([]);
                setIsChecking(false);
            }, GAME_SETTINGS.memory.matchDelay);
        }
    }, [flippedCards, matchedPairs, isChecking]);

    // Check for game completion
    useEffect(() => {
        if (gameState === 'playing' && matchedPairs.length === CARD_ICONS.length) {
            endGame();
        }
    }, [matchedPairs, gameState, endGame]);

    // Timer Effect
    useEffect(() => {
        if (gameState === 'playing') {
            timerRef.current = setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);

            return () => {
                if (timerRef.current) clearInterval(timerRef.current);
            };
        }
    }, [gameState]);

    return (
        <LinearGradient
            colors={[COLORS.accent, COLORS.accentDark]}
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
                            <Text style={styles.statValue}>{formatDuration(time)}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Hamle</Text>
                            <Text style={styles.statValue}>{moves}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Eşleşme</Text>
                            <Text style={styles.statValue}>{matchedPairs.length}/{CARD_ICONS.length}</Text>
                        </View>
                    </View>
                </View>

                {/* Game Area */}
                <View style={styles.gameArea}>
                    {gameState === 'ready' && (
                        <View style={styles.readyScreen}>
                            <Text style={styles.readyEmoji}>🧠</Text>
                            <Text style={styles.readyTitle}>Hafıza Oyunu!</Text>
                            <Text style={styles.readyText}>
                                Kartları çevir ve eşleşen çiftleri bul!
                            </Text>
                            <Text style={styles.readyTip}>
                                💡 Ne kadar az hamle yaparsan o kadar çok puan!
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
                        <View style={styles.cardGrid}>
                            {cards.map((card) => (
                                <Card
                                    key={card.id}
                                    card={card}
                                    onPress={handleCardPress}
                                    isFlipped={flippedCards.some((c) => c.id === card.id)}
                                    isMatched={matchedPairs.includes(card.pairId)}
                                />
                            ))}
                        </View>
                    )}
                </View>

                {/* Game Complete Modal */}
                <Modal visible={gameState === 'ended'} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalIconBg}>
                                <Text style={styles.modalIcon}>🎉</Text>
                            </View>
                            <Text style={styles.modalTitle}>Tebrikler!</Text>
                            <Text style={styles.modalSubtitle}>Tüm kartları eşleştirdin!</Text>

                            <View style={styles.resultRow}>
                                <View style={styles.resultCard}>
                                    <Text style={styles.resultLabel}>Süre</Text>
                                    <Text style={styles.resultValue}>{formatDuration(time)}</Text>
                                </View>
                                <View style={styles.resultCard}>
                                    <Text style={styles.resultLabel}>Hamle</Text>
                                    <Text style={styles.resultValue}>{moves}</Text>
                                </View>
                            </View>

                            {moves <= 12 && (
                                <View style={styles.perfectBadge}>
                                    <Text style={styles.perfectText}>⭐ Mükemmel Hafıza!</Text>
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
        color: COLORS.textDark,
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
        color: 'rgba(0,0,0,0.5)',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    gameArea: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: CARD_MARGIN,
    },
    cardContainer: {
        width: CARD_SIZE,
        height: CARD_SIZE,
    },
    card: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backfaceVisibility: 'hidden',
    },
    cardBack: {
        backgroundColor: COLORS.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    cardFront: {
        backgroundColor: COLORS.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    cardMatched: {
        backgroundColor: '#E8F5E9',
        borderWidth: 2,
        borderColor: COLORS.success,
    },
    cardQuestion: {
        fontSize: 32,
    },
    cardEmoji: {
        fontSize: 32,
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
        color: COLORS.textDark,
        marginBottom: 15,
        textAlign: 'center',
    },
    readyText: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.6)',
        textAlign: 'center',
        marginBottom: 10,
    },
    readyTip: {
        fontSize: 14,
        color: COLORS.textDark,
        marginBottom: 30,
        fontWeight: '500',
    },
    startButton: {
        backgroundColor: COLORS.primary,
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
        backgroundColor: COLORS.accent + '20',
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
        marginBottom: 5,
    },
    modalSubtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
        marginBottom: 20,
    },
    resultRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    resultCard: {
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 28,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    resultLabel: {
        fontSize: 13,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    resultValue: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.accent,
    },
    perfectBadge: {
        backgroundColor: COLORS.success + '20',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginBottom: 24,
    },
    perfectText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.success,
    },
    modalButtons: {
        width: '100%',
        gap: 12,
    },
    primaryBtn: {
        backgroundColor: COLORS.accent,
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

export default MemoryGame;
