// =====================================================
// 🦷 DİŞ KAHRAMANI - PROGRESS SCREEN (PROFESSIONAL)
// Minimal ve profesyonel ilerleme ekranı
// =====================================================

import React, { useRef, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { useGame } from '../contexts/GameContext';
import { COLORS, BADGES } from '../utils/constants';

const { width } = Dimensions.get('window');

// Stat Card
const StatCard = ({ value, label, color }) => (
    <View style={styles.statCard}>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

// Weekly Chart Mini
const WeeklyMiniChart = ({ brushingHistory }) => {
    const days = useMemo(() => {
        const result = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const record = brushingHistory.find(h => h.date === dateStr);
            let value = 0;
            if (record) {
                if (record.morning && record.evening) value = 2;
                else if (record.morning || record.evening) value = 1;
            }
            result.push({
                day: date.toLocaleDateString('tr-TR', { weekday: 'short' }).slice(0, 2),
                value,
                isToday: i === 0,
            });
        }
        return result;
    }, [brushingHistory]);

    return (
        <View style={styles.miniChart}>
            {days.map((day, i) => (
                <View key={i} style={styles.miniChartDay}>
                    <View style={styles.miniChartBarBg}>
                        <View
                            style={[
                                styles.miniChartBar,
                                {
                                    height: `${(day.value / 2) * 100}%`,
                                    backgroundColor: day.value === 2 ? COLORS.success : COLORS.primary,
                                },
                            ]}
                        />
                    </View>
                    <Text style={[styles.miniChartLabel, day.isToday && styles.miniChartLabelToday]}>
                        {day.day}
                    </Text>
                </View>
            ))}
        </View>
    );
};

// Badge Item
const BadgeItem = ({ badge, isUnlocked }) => (
    <View style={[styles.badgeItem, !isUnlocked && styles.badgeItemLocked]}>
        <Text style={styles.badgeEmoji}>{isUnlocked ? badge.icon : '🔒'}</Text>
        <Text style={styles.badgeName} numberOfLines={1}>{badge.name}</Text>
    </View>
);

const ProgressScreen = () => {
    const { points, level, streak, badges, brushingHistory, gameStats } = useGame();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]).start();
    }, []);

    const totalBrushings = brushingHistory.reduce(
        (sum, r) => sum + (r.morning ? 1 : 0) + (r.evening ? 1 : 0), 0
    );

    const allBadges = Object.values(BADGES);
    const unlockedIds = badges.map(b => b.id);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <Animated.ScrollView
                    style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>İlerleme</Text>
                        <Text style={styles.headerSubtitle}>Başarılarını takip et</Text>
                    </View>

                    {/* Level Card */}
                    <LinearGradient
                        colors={[COLORS.accent, COLORS.accentDark]}
                        style={styles.levelCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.levelTop}>
                            <View>
                                <Text style={styles.levelLabel}>SEVİYE</Text>
                                <Text style={styles.levelNumber}>{level?.level || 1}</Text>
                            </View>
                            <View style={styles.levelInfo}>
                                <Text style={styles.levelName}>{level?.name || 'Başlangıç'}</Text>
                                <Text style={styles.levelProgress}>{level?.progress || 0}% tamamlandı</Text>
                            </View>
                        </View>
                        <View style={styles.levelProgressBar}>
                            <View style={[styles.levelProgressFill, { width: `${level?.progress || 0}%` }]} />
                        </View>
                    </LinearGradient>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <StatCard value={points} label="Puan" color={COLORS.primary} />
                        <StatCard value={totalBrushings} label="Fırçalama" color={COLORS.success} />
                        <StatCard value={streak} label="Seri" color={COLORS.accent} />
                    </View>

                    {/* Weekly Chart */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Bu Hafta</Text>
                        <View style={styles.chartCard}>
                            <WeeklyMiniChart brushingHistory={brushingHistory} />
                            <View style={styles.chartLegend}>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
                                    <Text style={styles.legendText}>Tam</Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
                                    <Text style={styles.legendText}>Kısmi</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Badges */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Rozetler</Text>
                            <Text style={styles.sectionCount}>{badges.length}/{allBadges.length}</Text>
                        </View>
                        <View style={styles.badgesGrid}>
                            {allBadges.slice(0, 8).map(badge => (
                                <BadgeItem
                                    key={badge.id}
                                    badge={badge}
                                    isUnlocked={unlockedIds.includes(badge.id)}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Game Stats */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Oyun İstatistikleri</Text>
                        <View style={styles.gameStatsCard}>
                            {[
                                { name: 'Bakteri Avı', key: 'bacteria', color: '#8B5CF6' },
                                { name: 'Diş Kalesi', key: 'defense', color: '#06D6A0' },
                                { name: 'Hafıza', key: 'memory', color: '#F59E0B' },
                            ].map(game => (
                                <View key={game.key} style={styles.gameStatRow}>
                                    <View style={[styles.gameStatDot, { backgroundColor: game.color }]} />
                                    <Text style={styles.gameStatName}>{game.name}</Text>
                                    <Text style={styles.gameStatValue}>
                                        {gameStats[game.key]?.gamesPlayed || 0} oyun
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.bottomSpacing} />
                </Animated.ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    safeArea: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 10 },

    header: { marginBottom: 24 },
    headerTitle: { fontSize: 32, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 15, color: COLORS.textSecondary, marginTop: 4 },

    // Level Card
    levelCard: { borderRadius: 20, padding: 24, marginBottom: 20 },
    levelTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    levelLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
    levelNumber: { fontSize: 48, fontWeight: '800', color: COLORS.white },
    levelInfo: { marginLeft: 20, flex: 1 },
    levelName: { fontSize: 22, fontWeight: '700', color: COLORS.white },
    levelProgress: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
    levelProgressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3 },
    levelProgressFill: { height: '100%', backgroundColor: COLORS.white, borderRadius: 3 },

    // Stats
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    statCard: {
        flex: 1, backgroundColor: COLORS.white, marginHorizontal: 4, padding: 16, borderRadius: 16,
        alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    statValue: { fontSize: 24, fontWeight: '800' },
    statLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 4, fontWeight: '500' },

    // Section
    section: { marginBottom: 24 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
    sectionCount: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' },

    // Chart
    chartCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    miniChart: { flexDirection: 'row', justifyContent: 'space-between', height: 80, marginBottom: 12 },
    miniChartDay: { alignItems: 'center', flex: 1 },
    miniChartBarBg: { flex: 1, width: 20, backgroundColor: COLORS.textSecondary + '20', borderRadius: 10, justifyContent: 'flex-end', overflow: 'hidden' },
    miniChartBar: { width: '100%', borderRadius: 10 },
    miniChartLabel: { fontSize: 10, color: COLORS.textSecondary, marginTop: 4, fontWeight: '500' },
    miniChartLabelToday: { color: COLORS.primary, fontWeight: '700' },
    chartLegend: { flexDirection: 'row', justifyContent: 'center', gap: 24 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendText: { fontSize: 11, color: COLORS.textSecondary },

    // Badges
    badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    badgeItem: {
        width: (width - 70) / 4, backgroundColor: COLORS.white, borderRadius: 12, padding: 10, alignItems: 'center',
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
    },
    badgeItemLocked: { opacity: 0.5 },
    badgeEmoji: { fontSize: 24, marginBottom: 4 },
    badgeName: { fontSize: 9, color: COLORS.textSecondary, textAlign: 'center', fontWeight: '500' },

    // Game Stats
    gameStatsCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16 },
    gameStatRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.textSecondary + '15' },
    gameStatDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
    gameStatName: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
    gameStatValue: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },

    bottomSpacing: { height: 130 },
});

export default ProgressScreen;
