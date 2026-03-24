// =====================================================
// 🦷 DİŞ KAHRAMANI - GAME SCREEN (PROFESSIONAL)
// Minimal ve profesyonel oyun seçim ekranı
// =====================================================

import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { useGame } from '../contexts/GameContext';
import { COLORS, SCREEN_NAMES } from '../utils/constants';

const { width } = Dimensions.get('window');

const GAMES = [
    {
        id: 'bacteria',
        name: 'Bakteri Avı',
        description: 'Zararlı bakterileri temizle',
        gradient: ['#8B5CF6', '#7C3AED'],
        route: SCREEN_NAMES.BACTERIA_GAME,
        difficulty: 1,
        duration: '60s',
        iconBg: '#8B5CF6',
    },
    {
        id: 'defense',
        name: 'Diş Kalesi',
        description: 'Dişleri şekerden koru',
        gradient: ['#06D6A0', '#059669'],
        route: SCREEN_NAMES.DEFENSE_GAME,
        difficulty: 2,
        duration: '90s',
        iconBg: '#06D6A0',
    },
    {
        id: 'memory',
        name: 'Hafıza',
        description: 'Kartları eşleştir',
        gradient: ['#F59E0B', '#D97706'],
        route: SCREEN_NAMES.MEMORY_GAME,
        difficulty: 1,
        duration: '∞',
        iconBg: '#F59E0B',
    },
];

// Game Card Component
const GameCard = ({ game, index, onPress, stats }) => {
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                delay: index * 100,
                friction: 6,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 300,
                delay: index * 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, [index]);

    const highScore = stats?.highScore || 0;
    const gamesPlayed = stats?.gamesPlayed || 0;

    return (
        <Animated.View
            style={[
                styles.gameCardWrapper,
                {
                    opacity: opacityAnim,
                    transform: [{ scale: scaleAnim }],
                },
            ]}
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => onPress(game)}
            >
                <LinearGradient
                    colors={game.gradient}
                    style={styles.gameCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {/* Card Content */}
                    <View style={styles.gameCardContent}>
                        <View style={styles.gameHeader}>
                            <View>
                                <Text style={styles.gameName}>{game.name}</Text>
                                <Text style={styles.gameDesc}>{game.description}</Text>
                            </View>
                        </View>

                        <View style={styles.gameStats}>
                            <View style={styles.gameStat}>
                                <Text style={styles.gameStatValue}>{highScore}</Text>
                                <Text style={styles.gameStatLabel}>En Yüksek</Text>
                            </View>
                            <View style={styles.gameStatDivider} />
                            <View style={styles.gameStat}>
                                <Text style={styles.gameStatValue}>{gamesPlayed}</Text>
                                <Text style={styles.gameStatLabel}>Oynadın</Text>
                            </View>
                            <View style={styles.gameStatDivider} />
                            <View style={styles.gameStat}>
                                <Text style={styles.gameStatValue}>{game.duration}</Text>
                                <Text style={styles.gameStatLabel}>Süre</Text>
                            </View>
                        </View>

                        <View style={styles.gameFooter}>
                            <View style={styles.difficultyDots}>
                                {[1, 2, 3].map((dot) => (
                                    <View
                                        key={dot}
                                        style={[
                                            styles.difficultyDot,
                                            dot <= game.difficulty && styles.difficultyDotActive,
                                        ]}
                                    />
                                ))}
                            </View>
                            <View style={styles.playBtn}>
                                <Text style={styles.playBtnText}>Oyna</Text>
                                <Text style={styles.playBtnArrow}>→</Text>
                            </View>
                        </View>
                    </View>

                    {/* Decorative Circle */}
                    <View style={styles.decorCircle} />
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

const GameScreen = () => {
    const navigation = useNavigation();
    const { gameStats, points } = useGame();

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleGamePress = (game) => {
        navigation.navigate(game.route);
    };

    const totalGamesPlayed = Object.values(gameStats).reduce(
        (sum, stat) => sum + (stat.gamesPlayed || 0),
        0
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Header */}
                    <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
                        <Text style={styles.headerTitle}>Oyunlar</Text>
                        <Text style={styles.headerSubtitle}>
                            Eğlenerek öğren, puan kazan
                        </Text>
                    </Animated.View>

                    {/* Stats Summary */}
                    <Animated.View style={[styles.statsCard, { opacity: fadeAnim }]}>
                        <View style={styles.statsRow}>
                            <View style={styles.statsItem}>
                                <Text style={styles.statsValue}>{totalGamesPlayed}</Text>
                                <Text style={styles.statsLabel}>Toplam Oyun</Text>
                            </View>
                            <View style={styles.statsSeparator} />
                            <View style={styles.statsItem}>
                                <Text style={styles.statsValue}>{points}</Text>
                                <Text style={styles.statsLabel}>Kazanılan Puan</Text>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Games */}
                    <View style={styles.gamesSection}>
                        <Text style={styles.sectionTitle}>Oyun Seç</Text>
                        {GAMES.map((game, index) => (
                            <GameCard
                                key={game.id}
                                game={game}
                                index={index}
                                onPress={handleGamePress}
                                stats={gameStats[game.id]}
                            />
                        ))}
                    </View>

                    {/* Tips */}
                    <View style={styles.tipsSection}>
                        <Text style={styles.tipsTitle}>İpucu</Text>
                        <Text style={styles.tipsText}>
                            Her gün oyun oynayarak ekstra puan kazanabilirsin!
                        </Text>
                    </View>

                    <View style={styles.bottomSpacing} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    header: {
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.textPrimary,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
        marginTop: 4,
    },

    // Stats Card
    statsCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statsItem: {
        flex: 1,
        alignItems: 'center',
    },
    statsValue: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.primary,
    },
    statsLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4,
        fontWeight: '500',
    },
    statsSeparator: {
        width: 1,
        height: 40,
        backgroundColor: COLORS.textSecondary + '20',
    },

    // Games Section
    gamesSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 16,
    },

    // Game Card
    gameCardWrapper: {
        marginBottom: 16,
    },
    gameCard: {
        borderRadius: 20,
        overflow: 'hidden',
        minHeight: 180,
    },
    gameCardContent: {
        padding: 24,
        flex: 1,
        justifyContent: 'space-between',
    },
    gameHeader: {
        marginBottom: 16,
    },
    gameName: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.white,
    },
    gameDesc: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    gameStats: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    gameStat: {
        flex: 1,
        alignItems: 'center',
    },
    gameStatValue: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.white,
    },
    gameStatLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
        fontWeight: '500',
    },
    gameStatDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    gameFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    difficultyDots: {
        flexDirection: 'row',
        gap: 6,
    },
    difficultyDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    difficultyDotActive: {
        backgroundColor: COLORS.white,
    },
    playBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 8,
    },
    playBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.white,
    },
    playBtnArrow: {
        fontSize: 16,
        color: COLORS.white,
        fontWeight: '700',
    },
    decorCircle: {
        position: 'absolute',
        right: -30,
        top: -30,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },

    // Tips
    tipsSection: {
        backgroundColor: COLORS.primary + '10',
        borderRadius: 16,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    tipsTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 4,
    },
    tipsText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },

    bottomSpacing: {
        height: 130,
    },
});

export default GameScreen;
