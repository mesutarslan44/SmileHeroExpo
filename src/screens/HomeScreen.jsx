// =====================================================
// 🦷 DİŞ KAHRAMANI - HOME SCREEN (PROFESSIONAL)
// Minimal ve profesyonel ana ekran
// =====================================================

import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    ScrollView,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { useGame } from '../contexts/GameContext';
import { COLORS, SCREEN_NAMES, TIPS_DATA } from '../utils/constants';
import { getGreeting, formatDate } from '../utils/helpers';

// Professional tooth PNG
const ToothImage = require('../../assets/dis.png');

const { width } = Dimensions.get('window');

// Minimal Diş İkonu
const ToothLogo = ({ size = 50, color = COLORS.primary }) => (
    <View style={[styles.toothLogo, { width: size, height: size * 1.2 }]}>
        <View style={[styles.toothCrown, { backgroundColor: color }]}>
            <View style={styles.toothShine} />
        </View>
        <View style={styles.toothRoots}>
            <View style={[styles.toothRoot, { backgroundColor: color }]} />
            <View style={[styles.toothRoot, { backgroundColor: color }]} />
        </View>
    </View>
);

// Stat Card Component
const StatCard = ({ icon, value, label, color, delay = 0 }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            delay,
            friction: 6,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
            <View style={[styles.statIconBg, { backgroundColor: color + '15' }]}>
                <Text style={[styles.statIcon, { color }]}>{icon}</Text>
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </Animated.View>
    );
};

// Action Card Component
const ActionCard = ({ title, subtitle, icon, onPress, gradient }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <LinearGradient
            colors={gradient}
            style={styles.actionCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={styles.actionContent}>
                <Text style={styles.actionIcon}>{icon}</Text>
                <View style={styles.actionText}>
                    <Text style={styles.actionTitle}>{title}</Text>
                    <Text style={styles.actionSubtitle}>{subtitle}</Text>
                </View>
            </View>
            <View style={styles.actionArrow}>
                <Text style={styles.arrowIcon}>→</Text>
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

// 💡 Günün İpucu Widget
const DailyTipCard = ({ onPress }) => {
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Her gün farklı bir ipucu göster
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

    // Tüm ipuclarını düzleştir ve güne göre seç
    const allTips = TIPS_DATA.flatMap(category =>
        category.tips.map(tip => ({ ...tip, categoryIcon: category.icon, categoryColor: category.color, categoryTitle: category.title }))
    );
    const tipIndex = dayOfYear % allTips.length;
    const todayTip = allTips[tipIndex];

    useEffect(() => {
        // Giriş animasyonu
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 6,
            useNativeDriver: true,
        }).start();

        // Pulse animasyonu
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.02, duration: 1500, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <LinearGradient
                        colors={[todayTip.categoryColor, todayTip.categoryColor + 'CC']}
                        style={styles.tipWidget}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.tipWidgetHeader}>
                            <View style={styles.tipWidgetIconBg}>
                                <Text style={styles.tipWidgetIcon}>💡</Text>
                            </View>
                            <Text style={styles.tipWidgetLabel}>GÜNÜN İPUCU</Text>
                            <View style={styles.tipWidgetBadge}>
                                <Text style={styles.tipWidgetBadgeText}>{todayTip.categoryIcon} {todayTip.categoryTitle}</Text>
                            </View>
                        </View>

                        <Text style={styles.tipWidgetTitle}>{todayTip.title}</Text>
                        <Text style={styles.tipWidgetText}>{todayTip.text}</Text>

                        <View style={styles.tipWidgetFooter}>
                            <Text style={styles.tipWidgetMore}>Tüm ipuclarını gör →</Text>
                        </View>
                    </LinearGradient>
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, points, level, streak, todayBrushing, badges } = useGame();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleBrushPress = () => {
        navigation.navigate(SCREEN_NAMES.BRUSHING);
    };

    const greeting = getGreeting(user?.name);
    const brushedToday = todayBrushing.morning || todayBrushing.evening;
    const perfectDay = todayBrushing.morning && todayBrushing.evening;

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Header */}
                    <Animated.View
                        style={[
                            styles.header,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <View>
                            <Text style={styles.greeting}>{greeting}</Text>
                            <Text style={styles.date}>{formatDate(new Date(), 'long')}</Text>
                        </View>
                        <View style={styles.headerRight}>
                            <View style={styles.levelBadge}>
                                <Text style={styles.levelText}>Lvl {level?.level || 1}</Text>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Points Card */}
                    <Animated.View
                        style={[
                            styles.pointsCard,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.primaryDark]}
                            style={styles.pointsGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.pointsTop}>
                                <Image source={ToothImage} style={styles.toothImageLarge} />
                                <View style={styles.pointsInfo}>
                                    <Text style={styles.pointsLabel}>TOPLAM PUAN</Text>
                                    <Text style={styles.pointsValue}>{points}</Text>
                                </View>
                            </View>

                            <View style={styles.progressSection}>
                                <View style={styles.progressInfo}>
                                    <Text style={styles.progressLabel}>{level?.name || 'Başlangıç'}</Text>
                                    <Text style={styles.progressPercent}>
                                        {level?.progress || 0}%
                                    </Text>
                                </View>
                                <View style={styles.progressTrack}>
                                    <View
                                        style={[
                                            styles.progressBar,
                                            { width: `${level?.progress || 0}%` }
                                        ]}
                                    />
                                </View>
                            </View>
                        </LinearGradient>
                    </Animated.View>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <StatCard
                            icon="🔥"
                            value={streak}
                            label="Seri"
                            color={COLORS.accent}
                            delay={100}
                        />
                        <StatCard
                            icon="🏆"
                            value={badges.length}
                            label="Rozet"
                            color={COLORS.success}
                            delay={200}
                        />
                        <StatCard
                            icon="⭐"
                            value={level?.level || 1}
                            label="Seviye"
                            color={COLORS.primary}
                            delay={300}
                        />
                    </View>

                    {/* Today Status */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Bugün</Text>
                    </View>

                    <View style={styles.todayCard}>
                        <View style={styles.todayItem}>
                            <View style={[
                                styles.checkCircle,
                                todayBrushing.morning && styles.checkCircleActive
                            ]}>
                                {todayBrushing.morning && <Text style={styles.checkMark}>✓</Text>}
                            </View>
                            <View style={styles.todayInfo}>
                                <Text style={styles.todayLabel}>Sabah</Text>
                                <Text style={styles.todayStatus}>
                                    {todayBrushing.morning ? 'Tamamlandı' : 'Bekliyor'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.todayDivider} />

                        <View style={styles.todayItem}>
                            <View style={[
                                styles.checkCircle,
                                todayBrushing.evening && styles.checkCircleActive
                            ]}>
                                {todayBrushing.evening && <Text style={styles.checkMark}>✓</Text>}
                            </View>
                            <View style={styles.todayInfo}>
                                <Text style={styles.todayLabel}>Akşam</Text>
                                <Text style={styles.todayStatus}>
                                    {todayBrushing.evening ? 'Tamamlandı' : 'Bekliyor'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Main CTA Button */}
                    <TouchableOpacity
                        style={styles.ctaButton}
                        onPress={handleBrushPress}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={brushedToday ? [COLORS.success, COLORS.successDark] : [COLORS.primary, COLORS.primaryDark]}
                            style={styles.ctaGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <View style={styles.ctaIconContainer}>
                                <Image source={ToothImage} style={styles.toothImageSmall} />
                            </View>
                            <View style={styles.ctaText}>
                                <Text style={styles.ctaTitle}>
                                    {brushedToday ? 'Tekrar Fırçala' : 'Fırçalamaya Başla'}
                                </Text>
                                <Text style={styles.ctaSubtitle}>
                                    +50 puan kazan
                                </Text>
                            </View>
                            <View style={styles.ctaArrow}>
                                <Text style={styles.ctaArrowIcon}>→</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Quick Actions */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
                    </View>

                    <ActionCard
                        title="Mini Oyunlar"
                        subtitle="Eğlenerek öğren"
                        icon="🎮"
                        gradient={['#8B5CF6', '#7C3AED']}
                        onPress={() => navigation.navigate(SCREEN_NAMES.GAMES)}
                    />

                    <ActionCard
                        title="İlerleme"
                        subtitle="İstatistiklerini gör"
                        icon="📊"
                        gradient={['#06D6A0', '#059669']}
                        onPress={() => navigation.navigate(SCREEN_NAMES.PROGRESS)}
                    />

                    {/* 💡 Günün İpucu Widget */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Diş Sağlığı</Text>
                    </View>

                    <DailyTipCard
                        onPress={() => navigation.navigate(SCREEN_NAMES.TIPS)}
                    />

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    greeting: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.textPrimary,
        letterSpacing: -0.5,
    },
    date: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    levelBadge: {
        backgroundColor: COLORS.primary + '15',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    levelText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
    },

    // Points Card
    pointsCard: {
        marginBottom: 20,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    pointsGradient: {
        padding: 24,
    },
    pointsTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    pointsInfo: {
        marginLeft: 16,
    },
    pointsLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 1,
    },
    pointsValue: {
        fontSize: 42,
        fontWeight: '800',
        color: COLORS.white,
        marginTop: 2,
    },
    progressSection: {},
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
    },
    progressPercent: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.white,
    },
    progressTrack: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 3,
    },
    progressBar: {
        height: '100%',
        backgroundColor: COLORS.white,
        borderRadius: 3,
    },

    // Tooth Image (Professional PNG)
    toothImageLarge: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    toothImageSmall: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },

    // Tooth Logo (Legacy - can be removed)
    toothLogo: {
        alignItems: 'center',
    },
    toothCrown: {
        width: '80%',
        height: '60%',
        borderRadius: 12,
        position: 'relative',
    },
    toothShine: {
        position: 'absolute',
        top: 4,
        left: 4,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    toothRoots: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
        marginTop: -2,
    },
    toothRoot: {
        width: 6,
        height: 12,
        borderRadius: 3,
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        marginHorizontal: 4,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statIconBg: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statIcon: {
        fontSize: 22,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
        fontWeight: '500',
    },

    // Section
    sectionHeader: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },

    // Today Card
    todayCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    todayItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: COLORS.textSecondary + '40',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    checkCircleActive: {
        backgroundColor: COLORS.success,
        borderColor: COLORS.success,
    },
    checkMark: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '700',
    },
    todayInfo: {},
    todayLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    todayStatus: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    todayDivider: {
        width: 1,
        height: 40,
        backgroundColor: COLORS.textSecondary + '20',
        marginHorizontal: 16,
    },

    // CTA Button
    ctaButton: {
        marginBottom: 24,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    ctaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    ctaIconContainer: {
        marginRight: 16,
    },
    ctaText: {
        flex: 1,
    },
    ctaTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.white,
    },
    ctaSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    ctaArrow: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaArrowIcon: {
        fontSize: 20,
        color: COLORS.white,
        fontWeight: '700',
    },

    // Action Cards
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 16,
        marginBottom: 12,
    },
    actionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    actionIcon: {
        fontSize: 28,
        marginRight: 14,
    },
    actionText: {},
    actionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.white,
    },
    actionSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    actionArrow: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowIcon: {
        fontSize: 16,
        color: COLORS.white,
        fontWeight: '700',
    },

    // Tip Widget
    tipWidget: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 12,
    },
    tipWidgetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    tipWidgetIconBg: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    tipWidgetIcon: {
        fontSize: 18,
    },
    tipWidgetLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.9)',
        letterSpacing: 1,
        flex: 1,
    },
    tipWidgetBadge: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tipWidgetBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.white,
    },
    tipWidgetTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.white,
        marginBottom: 8,
    },
    tipWidgetText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 21,
        marginBottom: 12,
    },
    tipWidgetFooter: {
        alignItems: 'flex-end',
    },
    tipWidgetMore: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.white,
    },

    bottomSpacing: {
        height: 130,
    },
});

export default HomeScreen;
