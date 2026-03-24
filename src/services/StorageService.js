// =====================================================
// 🦷 DİŞ KAHRAMANI - STORAGE SERVICE
// AsyncStorage ile veri yönetimi
// =====================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';
import { getTodayDateString, calculateStreak } from '../utils/helpers';

/**
 * Kullanıcı verilerini kaydet
 * @param {Object} userData - { name, avatar, createdAt }
 */
export const saveUserData = async (userData) => {
    try {
        const data = {
            ...userData,
            updatedAt: new Date().toISOString(),
        };
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
        return { success: true };
    } catch (error) {
        console.error('Error saving user data:', error);
        return { success: false, error };
    }
};

/**
 * Kullanıcı verilerini oku
 * @returns {Object|null}
 */
export const getUserData = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
};

/**
 * Fırçalama kaydı ekle
 * @param {Object} record - { type: 'morning'|'evening', duration, points }
 */
export const saveBrushingRecord = async (record) => {
    try {
        const today = getTodayDateString();
        const history = await getBrushingHistory();

        // Bugünün kaydını bul veya oluştur
        let todayRecord = history.find((h) => h.date === today);

        if (todayRecord) {
            // Mevcut kaydı güncelle
            todayRecord[record.type] = true;
            todayRecord[`${record.type}Duration`] = record.duration;
            todayRecord[`${record.type}Time`] = new Date().toISOString();
            todayRecord.totalPoints = (todayRecord.totalPoints || 0) + record.points;
        } else {
            // Yeni kayıt oluştur
            todayRecord = {
                date: today,
                morning: record.type === 'morning',
                evening: record.type === 'evening',
                [`${record.type}Duration`]: record.duration,
                [`${record.type}Time`]: new Date().toISOString(),
                totalPoints: record.points,
            };
            history.push(todayRecord);
        }

        await AsyncStorage.setItem(STORAGE_KEYS.BRUSHING_HISTORY, JSON.stringify(history));

        // Streak'i güncelle
        await updateStreak(history);

        // Son fırçalama zamanını kaydet
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_BRUSHING, JSON.stringify({
            date: today,
            type: record.type,
            time: new Date().toISOString(),
        }));

        return { success: true, record: todayRecord };
    } catch (error) {
        console.error('Error saving brushing record:', error);
        return { success: false, error };
    }
};

/**
 * Fırçalama geçmişini oku
 * @returns {Array}
 */
export const getBrushingHistory = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.BRUSHING_HISTORY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting brushing history:', error);
        return [];
    }
};

/**
 * Bugünkü fırçalama durumunu al
 * @returns {Object} { morning: boolean, evening: boolean }
 */
export const getTodayBrushing = async () => {
    try {
        const history = await getBrushingHistory();
        const today = getTodayDateString();
        const todayRecord = history.find((h) => h.date === today);

        return {
            morning: todayRecord?.morning || false,
            evening: todayRecord?.evening || false,
        };
    } catch (error) {
        console.error('Error getting today brushing:', error);
        return { morning: false, evening: false };
    }
};

/**
 * Streak'i güncelle
 * @param {Array} history - Fırçalama geçmişi
 */
export const updateStreak = async (history) => {
    try {
        const streak = calculateStreak(history);
        await AsyncStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify({
            count: streak,
            updatedAt: new Date().toISOString(),
        }));
        return streak;
    } catch (error) {
        console.error('Error updating streak:', error);
        return 0;
    }
};

/**
 * Streak bilgisini oku
 * @returns {number}
 */
export const getStreak = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.STREAK);
        return data ? JSON.parse(data).count : 0;
    } catch (error) {
        console.error('Error getting streak:', error);
        return 0;
    }
};

/**
 * Rozet ekle
 * @param {Object} badge - Rozet objesi
 */
export const addBadge = async (badge) => {
    try {
        const badges = await getBadges();

        // Aynı rozet zaten var mı kontrol et
        if (badges.find((b) => b.id === badge.id)) {
            return { success: false, message: 'Badge already exists' };
        }

        const newBadge = {
            ...badge,
            unlockedAt: new Date().toISOString(),
        };

        badges.push(newBadge);
        await AsyncStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));

        return { success: true, badge: newBadge };
    } catch (error) {
        console.error('Error adding badge:', error);
        return { success: false, error };
    }
};

/**
 * Tüm rozetleri oku
 * @returns {Array}
 */
export const getBadges = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.BADGES);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting badges:', error);
        return [];
    }
};

/**
 * Puanları kaydet/güncelle
 * @param {number} points - Eklenecek puan
 */
export const addPoints = async (points) => {
    try {
        const currentPoints = await getPoints();
        const newTotal = currentPoints + points;

        await AsyncStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify({
            total: newTotal,
            updatedAt: new Date().toISOString(),
        }));

        return { success: true, total: newTotal };
    } catch (error) {
        console.error('Error adding points:', error);
        return { success: false, error };
    }
};

/**
 * Toplam puanı oku
 * @returns {number}
 */
export const getPoints = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.POINTS);
        return data ? JSON.parse(data).total : 0;
    } catch (error) {
        console.error('Error getting points:', error);
        return 0;
    }
};

/**
 * Ayarları kaydet
 * @param {Object} settings
 */
export const saveSettings = async (settings) => {
    try {
        const currentSettings = await getSettings();
        const newSettings = { ...currentSettings, ...settings };

        await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
        return { success: true, settings: newSettings };
    } catch (error) {
        console.error('Error saving settings:', error);
        return { success: false, error };
    }
};

/**
 * Ayarları oku
 * @returns {Object}
 */
export const getSettings = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
        return data ? JSON.parse(data) : {
            soundEnabled: true,
            notificationsEnabled: true,
            morningReminderTime: '08:00',
            eveningReminderTime: '21:00',
            theme: 'light',
        };
    } catch (error) {
        console.error('Error getting settings:', error);
        return {
            soundEnabled: true,
            notificationsEnabled: true,
            morningReminderTime: '08:00',
            eveningReminderTime: '21:00',
            theme: 'light',
        };
    }
};

/**
 * Oyun istatistiklerini kaydet
 * @param {string} gameType - Oyun tipi
 * @param {Object} stats - İstatistikler
 */
export const saveGameStats = async (gameType, stats) => {
    try {
        const allStats = await getGameStats();

        if (!allStats[gameType]) {
            allStats[gameType] = {
                gamesPlayed: 0,
                highScore: 0,
                totalScore: 0,
                bestTime: null,
            };
        }

        allStats[gameType].gamesPlayed += 1;
        allStats[gameType].totalScore += stats.score || 0;

        if (stats.score > allStats[gameType].highScore) {
            allStats[gameType].highScore = stats.score;
        }

        if (stats.time && (!allStats[gameType].bestTime || stats.time < allStats[gameType].bestTime)) {
            allStats[gameType].bestTime = stats.time;
        }

        await AsyncStorage.setItem(STORAGE_KEYS.GAME_STATS, JSON.stringify(allStats));
        return { success: true, stats: allStats[gameType] };
    } catch (error) {
        console.error('Error saving game stats:', error);
        return { success: false, error };
    }
};

/**
 * Oyun istatistiklerini oku
 * @returns {Object}
 */
export const getGameStats = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATS);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Error getting game stats:', error);
        return {};
    }
};

/**
 * Tüm verileri sıfırla
 */
export const resetAllData = async () => {
    try {
        const keys = Object.values(STORAGE_KEYS);
        await AsyncStorage.multiRemove(keys);
        return { success: true };
    } catch (error) {
        console.error('Error resetting data:', error);
        return { success: false, error };
    }
};

/**
 * Tüm verileri yükle (uygulama başlangıcı için)
 * @returns {Object}
 */
export const loadAllData = async () => {
    try {
        const [userData, brushingHistory, badges, points, streak, settings, gameStats] =
            await Promise.all([
                getUserData(),
                getBrushingHistory(),
                getBadges(),
                getPoints(),
                getStreak(),
                getSettings(),
                getGameStats(),
            ]);

        const todayBrushing = await getTodayBrushing();

        return {
            userData,
            brushingHistory,
            badges,
            points,
            streak,
            settings,
            gameStats,
            todayBrushing,
        };
    } catch (error) {
        console.error('Error loading all data:', error);
        return null;
    }
};

export default {
    saveUserData,
    getUserData,
    saveBrushingRecord,
    getBrushingHistory,
    getTodayBrushing,
    updateStreak,
    getStreak,
    addBadge,
    getBadges,
    addPoints,
    getPoints,
    saveSettings,
    getSettings,
    saveGameStats,
    getGameStats,
    resetAllData,
    loadAllData,
};
