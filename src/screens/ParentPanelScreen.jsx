// =====================================================
// 🦷 DİŞ KAHRAMANI - PARENT PANEL SCREEN (PROFESSIONAL)
// Minimal ve profesyonel ebeveyn paneli
// =====================================================

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Animated,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { useGame } from '../contexts/GameContext';
import { COLORS, PARENT_SETTINGS } from '../utils/constants';

const { width } = Dimensions.get('window');

// Stat Card
const StatCard = ({ icon, value, label, color }) => (
    <View style={styles.statCard}>
        <View style={[styles.statIconBg, { backgroundColor: color + '15' }]}>
            <Text style={styles.statIcon}>{icon}</Text>
        </View>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

// Weekly Mini Chart
const WeeklyMini = ({ brushingHistory }) => {
    const days = useMemo(() => {
        const result = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const record = (brushingHistory || []).find(h => h.date === dateStr);
            let value = 0;
            if (record) {
                if (record.morning && record.evening) value = 2;
                else if (record.morning || record.evening) value = 1;
            }
            result.push({
                day: date.toLocaleDateString('tr-TR', { weekday: 'short' }).slice(0, 2),
                value,
            });
        }
        return result;
    }, [brushingHistory]);

    return (
        <View style={styles.weeklyChart}>
            {days.map((d, i) => (
                <View key={i} style={styles.chartDay}>
                    <View style={styles.chartBarBg}>
                        <View style={[styles.chartBar, {
                            height: `${(d.value / 2) * 100}%`,
                            backgroundColor: d.value === 2 ? COLORS.success : COLORS.primary
                        }]} />
                    </View>
                    <Text style={styles.chartLabel}>{d.day}</Text>
                </View>
            ))}
        </View>
    );
};

const ParentPanelScreen = () => {
    const navigation = useNavigation();
    const { user, points, level, streak, badges, brushingHistory, gameStats, resetAllData } = useGame();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pinInput, setPinInput] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isAuthenticated) {
            Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
        }
    }, [isAuthenticated]);

    const handlePinSubmit = () => {
        if (pinInput === PARENT_SETTINGS.defaultPin) {
            setIsAuthenticated(true);
            setPinInput('');
        } else {
            Alert.alert('Hata', 'Yanlış PIN');
            setPinInput('');
        }
    };

    const handleResetData = () => {
        Alert.alert('Verileri Sıfırla', 'Tüm veriler silinecek. Emin misiniz?', [
            { text: 'İptal', style: 'cancel' },
            {
                text: 'Sıfırla', style: 'destructive', onPress: async () => {
                    await resetAllData();
                    navigation.goBack();
                }
            },
        ]);
    };

    const totalBrushings = (brushingHistory || []).reduce(
        (sum, r) => sum + (r.morning ? 1 : 0) + (r.evening ? 1 : 0), 0
    );

    // PIN Screen
    if (!isAuthenticated) {
        return (
            <LinearGradient colors={['#0077B6', '#00B4D8']} style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.pinScreen}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                            <Text style={styles.closeIcon}>✕</Text>
                        </TouchableOpacity>

                        <View style={styles.lockCircle}>
                            <Text style={styles.lockEmoji}>🔐</Text>
                        </View>

                        <Text style={styles.pinTitle}>Ebeveyn Girişi</Text>
                        <Text style={styles.pinSubtitle}>Devam etmek için PIN girin</Text>

                        <View style={styles.pinInputWrap}>
                            <TextInput
                                style={styles.pinInput}
                                value={pinInput}
                                onChangeText={setPinInput}
                                keyboardType="number-pad"
                                maxLength={4}
                                secureTextEntry
                                placeholder="••••"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                            />
                        </View>

                        <TouchableOpacity style={styles.pinBtn} onPress={handlePinSubmit}>
                            <Text style={styles.pinBtnText}>Giriş</Text>
                        </TouchableOpacity>

                        <Text style={styles.pinHint}>Varsayılan: 1234</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    // Main Panel
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Ebeveyn Paneli</Text>
                    <TouchableOpacity onPress={() => setIsAuthenticated(false)} style={styles.lockBtn}>
                        <Text style={styles.lockBtnIcon}>🔒</Text>
                    </TouchableOpacity>
                </View>

                <Animated.ScrollView
                    style={{ opacity: fadeAnim }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Child Profile */}
                    <View style={styles.profileCard}>
                        <View style={styles.profileAvatar}>
                            <Text style={styles.avatarEmoji}>{user?.avatar?.emoji || '😊'}</Text>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{user?.name || 'Kullanıcı'}</Text>
                            <Text style={styles.profileLevel}>Seviye {level?.level} • {level?.name}</Text>
                        </View>
                    </View>

                    {/* Stats */}
                    <Text style={styles.sectionTitle}>İstatistikler</Text>
                    <View style={styles.statsGrid}>
                        <StatCard icon="⭐" value={points} label="Puan" color={COLORS.accent} />
                        <StatCard icon="🔥" value={streak} label="Seri" color={COLORS.danger} />
                        <StatCard icon="🦷" value={totalBrushings} label="Fırçalama" color={COLORS.primary} />
                        <StatCard icon="🏆" value={badges?.length || 0} label="Rozet" color={COLORS.success} />
                    </View>

                    {/* Weekly Chart */}
                    <Text style={styles.sectionTitle}>Bu Hafta</Text>
                    <View style={styles.chartCard}>
                        <WeeklyMini brushingHistory={brushingHistory} />
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

                    {/* Game Stats */}
                    <Text style={styles.sectionTitle}>Oyun İstatistikleri</Text>
                    <View style={styles.gameCard}>
                        {[
                            { name: 'Bakteri Avı', key: 'bacteria', color: '#8B5CF6' },
                            { name: 'Diş Kalesi', key: 'defense', color: '#06D6A0' },
                            { name: 'Hafıza', key: 'memory', color: '#F59E0B' },
                        ].map(game => (
                            <View key={game.key} style={styles.gameRow}>
                                <View style={[styles.gameDot, { backgroundColor: game.color }]} />
                                <Text style={styles.gameName}>{game.name}</Text>
                                <Text style={styles.gameValue}>{gameStats?.[game.key]?.gamesPlayed || 0} oyun</Text>
                            </View>
                        ))}
                    </View>

                    {/* Actions */}
                    <Text style={styles.sectionTitle}>Yönetim</Text>
                    <TouchableOpacity style={styles.dangerBtn} onPress={handleResetData}>
                        <Text style={styles.dangerBtnIcon}>🗑️</Text>
                        <Text style={styles.dangerBtnText}>Verileri Sıfırla</Text>
                    </TouchableOpacity>

                    <View style={styles.bottomSpacing} />
                </Animated.ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    safeArea: { flex: 1 },

    // PIN Screen
    pinScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    closeBtn: { position: 'absolute', top: 20, right: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    closeIcon: { fontSize: 20, color: COLORS.white },
    lockCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    lockEmoji: { fontSize: 48 },
    pinTitle: { fontSize: 28, fontWeight: '700', color: COLORS.white, marginBottom: 8 },
    pinSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 32 },
    pinInputWrap: { marginBottom: 24 },
    pinInput: { width: 180, height: 56, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, fontSize: 28, color: COLORS.white, textAlign: 'center', letterSpacing: 12 },
    pinBtn: { backgroundColor: COLORS.accent, paddingHorizontal: 48, paddingVertical: 16, borderRadius: 30 },
    pinBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.white },
    pinHint: { marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.6)' },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
    backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    backIcon: { fontSize: 22, color: COLORS.textPrimary },
    headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
    lockBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' },
    lockBtnIcon: { fontSize: 18 },

    scrollContent: { paddingHorizontal: 20 },

    // Profile
    profileCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    profileAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    avatarEmoji: { fontSize: 32 },
    profileInfo: { flex: 1 },
    profileName: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
    profileLevel: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },

    // Section
    sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },

    // Stats
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
    statCard: { width: (width - 50) / 2, backgroundColor: COLORS.white, borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    statIconBg: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    statIcon: { fontSize: 22 },
    statValue: { fontSize: 24, fontWeight: '800' },
    statLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 4, fontWeight: '500' },

    // Chart
    chartCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    weeklyChart: { flexDirection: 'row', justifyContent: 'space-between', height: 80, marginBottom: 12 },
    chartDay: { alignItems: 'center', flex: 1 },
    chartBarBg: { flex: 1, width: 16, backgroundColor: '#E5E7EB', borderRadius: 8, justifyContent: 'flex-end', overflow: 'hidden' },
    chartBar: { width: '100%', borderRadius: 8 },
    chartLabel: { fontSize: 10, color: COLORS.textSecondary, marginTop: 4, fontWeight: '500' },
    chartLegend: { flexDirection: 'row', justifyContent: 'center', gap: 24 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendText: { fontSize: 11, color: COLORS.textSecondary },

    // Game Stats
    gameCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 24 },
    gameRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    gameDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
    gameName: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
    gameValue: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },

    // Danger Button
    dangerBtn: { backgroundColor: '#FEE2E2', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    dangerBtnIcon: { fontSize: 20 },
    dangerBtnText: { fontSize: 16, fontWeight: '600', color: COLORS.danger },

    bottomSpacing: { height: 30 },
});

export default ParentPanelScreen;
