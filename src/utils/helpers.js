// =====================================================
// 🦷 DİŞ KAHRAMANI - HELPER FUNCTIONS
// Yardımcı fonksiyonlar
// =====================================================

import { LEVELS, POINTS, BADGES } from './constants';

/**
 * Tarihi okunabilir formata çevirir
 * @param {Date|string} date - Tarih objesi veya string
 * @param {string} format - Format tipi ('short', 'long', 'time')
 * @returns {string} Formatlanmış tarih
 */
export const formatDate = (date, format = 'short') => {
    const d = new Date(date);

    const options = {
        short: { day: '2-digit', month: '2-digit', year: 'numeric' },
        long: { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' },
        time: { hour: '2-digit', minute: '2-digit' },
        full: { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' },
    };

    return d.toLocaleDateString('tr-TR', options[format] || options.short);
};

/**
 * Günün saatine göre zaman dilimini döndürür
 * @returns {string} 'morning' veya 'evening'
 */
export const getTimeOfDay = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return 'morning';
    } else if (hour >= 12 && hour < 17) {
        return 'afternoon';
    } else if (hour >= 17 && hour < 21) {
        return 'evening';
    } else {
        return 'night';
    }
};

/**
 * Fırçalama zamanının uygun olup olmadığını kontrol eder
 * @param {string} type - 'morning' veya 'evening'
 * @returns {boolean}
 */
export const isValidBrushingTime = (type) => {
    const hour = new Date().getHours();

    if (type === 'morning') {
        return hour >= 5 && hour < 14; // 05:00 - 14:00 arası sabah fırçalaması
    } else if (type === 'evening') {
        return hour >= 17 || hour < 2; // 17:00 - 02:00 arası akşam fırçalaması
    }

    return true;
};

/**
 * Streak (ardışık gün) hesaplar
 * @param {Array} brushingHistory - Fırçalama geçmişi
 * @returns {number} Streak sayısı
 */
export const calculateStreak = (brushingHistory) => {
    if (!brushingHistory || brushingHistory.length === 0) {
        return 0;
    }

    // Tarihe göre sırala (en yeniden eskiye)
    const sortedHistory = [...brushingHistory].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedHistory.length; i++) {
        const recordDate = new Date(sortedHistory[i].date);
        recordDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((currentDate - recordDate) / (1000 * 60 * 60 * 24));

        if (diffDays === streak) {
            // Hem sabah hem akşam fırçalandı mı kontrol et
            if (sortedHistory[i].morning && sortedHistory[i].evening) {
                streak++;
            } else if (diffDays === 0) {
                // Bugün için en az birinin olması yeterli
                streak++;
            }
            currentDate.setDate(currentDate.getDate() - 1);
        } else if (diffDays > streak) {
            break;
        }
    }

    return streak;
};

/**
 * Puandan level bilgisini hesaplar
 * @param {number} points - Toplam puan
 * @returns {Object} Level bilgisi
 */
export const getLevelFromPoints = (points) => {
    const level = LEVELS.find(
        (l) => points >= l.minPoints && points <= l.maxPoints
    ) || LEVELS[0];

    const nextLevel = LEVELS.find((l) => l.level === level.level + 1);
    const progress = nextLevel
        ? ((points - level.minPoints) / (nextLevel.minPoints - level.minPoints)) * 100
        : 100;

    return {
        ...level,
        currentPoints: points,
        progress: Math.min(progress, 100),
        pointsToNextLevel: nextLevel ? nextLevel.minPoints - points : 0,
        nextLevel: nextLevel || null,
    };
};

/**
 * Fırçalama puanını hesaplar
 * @param {Object} options - { duration, streak, isMorning, isEvening }
 * @returns {number} Kazanılan puan
 */
export const calculateBrushingPoints = (options) => {
    const { duration, streak = 0, isMorning = false, isEvening = false } = options;

    let points = POINTS.brushingComplete;

    // Tam süre bonusu (120 saniye)
    if (duration >= 120) {
        points = POINTS.perfectBrushing;
    }

    // Sabah/Akşam bonusu
    if (isMorning) points += POINTS.morningBonus;
    if (isEvening) points += POINTS.eveningBonus;

    // Streak bonusu
    points += streak * POINTS.streakBonus;

    return points;
};

/**
 * Oyun puanını hesaplar
 * @param {string} gameType - Oyun tipi
 * @param {number} score - Ham skor
 * @param {number} combo - Kombo sayısı
 * @returns {number} Final puan
 */
export const calculateGamePoints = (gameType, score, combo = 0) => {
    let basePoints = 0;

    switch (gameType) {
        case 'bacteria':
            basePoints = score * POINTS.bacteriaKill;
            break;
        case 'memory':
            basePoints = score * POINTS.memoryMatch;
            break;
        case 'defense':
            basePoints = score * POINTS.defensePoint;
            break;
        default:
            basePoints = score;
    }

    // Kombo çarpanı
    if (combo > 5) {
        basePoints = Math.floor(basePoints * POINTS.comboMultiplier);
    }

    return basePoints;
};

/**
 * Rozet kazanma durumunu kontrol eder
 * @param {Object} stats - Kullanıcı istatistikleri
 * @param {Array} currentBadges - Mevcut rozetler
 * @returns {Array} Yeni kazanılan rozetler
 */
export const checkBadgeUnlock = (stats, currentBadges = []) => {
    const newBadges = [];
    const badgeIds = currentBadges.map((b) => b.id);

    // First Brush
    if (stats.totalBrushings >= 1 && !badgeIds.includes('first_brush')) {
        newBadges.push(BADGES.firstBrush);
    }

    // Streak Badges
    if (stats.streak >= 3 && !badgeIds.includes('three_day_streak')) {
        newBadges.push(BADGES.threeDayStreak);
    }
    if (stats.streak >= 7 && !badgeIds.includes('week_streak')) {
        newBadges.push(BADGES.weekStreak);
    }
    if (stats.streak >= 14 && !badgeIds.includes('two_week_streak')) {
        newBadges.push(BADGES.twoWeekStreak);
    }
    if (stats.streak >= 30 && !badgeIds.includes('month_streak')) {
        newBadges.push(BADGES.monthStreak);
    }

    // Game Badges
    if (stats.bacteriaKilled >= 100 && !badgeIds.includes('bacteria_slayer')) {
        newBadges.push(BADGES.bacteriaSlayer);
    }
    if (stats.memoryBestTime <= 60 && stats.memoryBestTime > 0 && !badgeIds.includes('memory_master')) {
        newBadges.push(BADGES.memoryMaster);
    }
    if (stats.defenseHighScore >= 1000 && !badgeIds.includes('defense_champion')) {
        newBadges.push(BADGES.defenseChampion);
    }

    // Point Badge
    if (stats.totalPoints >= 1000 && !badgeIds.includes('legendary')) {
        newBadges.push(BADGES.legendary);
    }

    // Collector Badge
    if (currentBadges.length >= 5 && !badgeIds.includes('collector')) {
        newBadges.push(BADGES.collector);
    }

    return newBadges;
};

/**
 * Bugünün tarihini YYYY-MM-DD formatında döndürür
 * @returns {string}
 */
export const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

/**
 * İki tarih arasındaki gün farkını hesaplar
 * @param {Date|string} date1
 * @param {Date|string} date2
 * @returns {number}
 */
export const getDaysDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    return Math.floor((d1 - d2) / (1000 * 60 * 60 * 24));
};

/**
 * Süreyi okunabilir formata çevirir
 * @param {number} seconds - Saniye
 * @returns {string} "MM:SS" formatı
 */
export const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Rastgele pozisyon üretir (oyunlar için)
 * @param {number} maxX - Maksimum X değeri
 * @param {number} maxY - Maksimum Y değeri
 * @param {number} padding - Kenar boşluğu
 * @returns {Object} { x, y }
 */
export const getRandomPosition = (maxX, maxY, padding = 50) => {
    return {
        x: Math.random() * (maxX - padding * 2) + padding,
        y: Math.random() * (maxY - padding * 2) + padding,
    };
};

/**
 * Dizi elemanlarını karıştırır (Fisher-Yates shuffle)
 * @param {Array} array
 * @returns {Array}
 */
export const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

/**
 * Hoş geldin mesajı döndürür
 * @param {string} name - Kullanıcı adı
 * @returns {string}
 */
export const getGreeting = (name) => {
    const hour = new Date().getHours();
    let greeting = '';

    if (hour >= 5 && hour < 12) {
        greeting = 'Günaydın';
    } else if (hour >= 12 && hour < 17) {
        greeting = 'İyi günler';
    } else if (hour >= 17 && hour < 22) {
        greeting = 'İyi akşamlar';
    } else {
        greeting = 'İyi geceler';
    }

    return name ? `${greeting}, ${name}!` : `${greeting}!`;
};

/**
 * Motivasyon mesajı döndürür
 * @param {number} streak - Streak sayısı
 * @returns {string}
 */
export const getMotivationalMessage = (streak) => {
    if (streak === 0) {
        return 'Bugün harika bir başlangıç yap! 💪';
    } else if (streak < 3) {
        return 'Harika gidiyorsun, devam et! 🌟';
    } else if (streak < 7) {
        return 'Muhteşem! Bir haftalık hedefine yaklaşıyorsun! 🔥';
    } else if (streak < 14) {
        return 'İnanılmaz! Gerçek bir diş kahramanısın! ⭐';
    } else if (streak < 30) {
        return 'Efsanevi! Ay hedefine ulaşmak üzeresin! 👑';
    } else {
        return 'Sen bir şampiyonsun! Devam et! 🏆';
    }
};

export default {
    formatDate,
    getTimeOfDay,
    isValidBrushingTime,
    calculateStreak,
    getLevelFromPoints,
    calculateBrushingPoints,
    calculateGamePoints,
    checkBadgeUnlock,
    getTodayDateString,
    getDaysDifference,
    formatDuration,
    getRandomPosition,
    shuffleArray,
    getGreeting,
    getMotivationalMessage,
};
