// =====================================================
// 🦷 DİŞ KAHRAMANI - CONSTANTS
// Uygulama genelinde kullanılan sabit değerler
// =====================================================

// 🎨 Renk Paleti - Canlı Çocuk Teması
export const COLORS = {
    // Ana Renkler - Parlak Turkuaz
    primary: '#00B4D8',        // Parlak turkuaz
    primaryDark: '#0077B6',    // Koyu turkuaz
    primaryLight: '#90E0EF',   // Açık turkuaz
    primaryPastel: '#CAF0F8',  // Çok açık turkuaz

    // İkincil Renkler
    secondary: '#48CAE4',      // Orta turkuaz
    accent: '#FFB703',         // Parlak altın turuncu
    accentDark: '#FB8500',     // Koyu turuncu
    accentLight: '#FFE066',    // Açık sarı

    // Durum Renkleri - Neon Tonlar
    success: '#06D6A0',        // Neon yeşil
    successDark: '#059669',    // Koyu yeşil
    successLight: '#A7F3D0',   // Açık yeşil
    warning: '#FFBE0B',        // Parlak sarı
    danger: '#EF476F',         // Parlak pembe-kırmızı
    dangerDark: '#DC2626',     // Koyu kırmızı

    // Arka Plan Renkleri - Yumuşak Gradyan
    background: '#F0F9FF',     // Çok açık mavi-beyaz
    backgroundAlt: '#E0F7FA',  // Alternatif açık mavi
    surface: '#FFFFFF',        // Kart yüzeyleri
    surfaceElevated: '#F8FAFC', // Yükseltilmiş yüzey

    // Metin Renkleri - Okunabilir
    textPrimary: '#1E3A5F',    // Koyu lacivert
    textSecondary: '#64748B',  // Gri-mavi
    textLight: '#FFFFFF',      // Beyaz
    textDark: '#0F172A',       // Çok koyu

    // Diş Temalı Özel Renkler
    toothWhite: '#FFFFFF',     // Parlak beyaz
    toothHealthy: '#D1FAE5',   // Sağlıklı yeşil
    toothWarning: '#FEF3C7',   // Uyarı sarısı
    bacteria: '#8B5CF6',       // Mor
    bacteriaDark: '#7C3AED',   // Koyu mor

    // Gölge ve Overlay
    shadow: 'rgba(0, 119, 182, 0.15)',
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Gradient Renkleri
    gradientStart: '#00B4D8',
    gradientEnd: '#0077B6',
    gradientGold: ['#FFB703', '#FB8500', '#E85D04'],
    gradientSuccess: ['#06D6A0', '#059669'],
    gradientPurple: ['#8B5CF6', '#7C3AED'],

    // Ek renkler - uyumluluk için
    white: '#FFFFFF',
    black: '#000000',
};

// 🏆 Rozet Tanımları
export const BADGES = {
    // Başlangıç Rozetleri
    firstBrush: {
        id: 'first_brush',
        name: 'İlk Adım',
        description: 'İlk diş fırçalamanı tamamladın!',
        icon: '🌟',
        points: 10,
        requirement: 1, // 1 fırçalama
    },
    threeDayStreak: {
        id: 'three_day_streak',
        name: '3 Gün Serisi',
        description: '3 gün üst üste fırçaladın!',
        icon: '🔥',
        points: 50,
        requirement: 3,
    },
    weekStreak: {
        id: 'week_streak',
        name: 'Haftalık Kahraman',
        description: '7 gün üst üste fırçaladın!',
        icon: '⭐',
        points: 100,
        requirement: 7,
    },
    twoWeekStreak: {
        id: 'two_week_streak',
        name: 'Süper Kahraman',
        description: '14 gün üst üste fırçaladın!',
        icon: '💫',
        points: 200,
        requirement: 14,
    },
    monthStreak: {
        id: 'month_streak',
        name: 'Diş Ustası',
        description: '30 gün üst üste fırçaladın!',
        icon: '👑',
        points: 500,
        requirement: 30,
    },

    // Oyun Rozetleri
    bacteriaSlayer: {
        id: 'bacteria_slayer',
        name: 'Bakteri Avcısı',
        description: '100 bakteri temizledin!',
        icon: '🦠',
        points: 75,
        requirement: 100,
    },
    memoryMaster: {
        id: 'memory_master',
        name: 'Hafıza Ustası',
        description: 'Hafıza oyununu 1 dakikada tamamladın!',
        icon: '🧠',
        points: 100,
        requirement: 60, // 60 saniye
    },
    defenseChampion: {
        id: 'defense_champion',
        name: 'Savunma Şampiyonu',
        description: 'Diş savunmasında 1000 puan yaptın!',
        icon: '🛡️',
        points: 150,
        requirement: 1000,
    },

    // Özel Rozetler
    earlyBird: {
        id: 'early_bird',
        name: 'Erken Kuş',
        description: 'Sabah 7den önce fırçaladın!',
        icon: '🌅',
        points: 25,
        requirement: 7, // 07:00
    },
    nightOwl: {
        id: 'night_owl',
        name: 'Gece Kuşu',
        description: 'Gece fırçalamasını kaçırmadın!',
        icon: '🌙',
        points: 25,
        requirement: 22, // 22:00
    },
    perfectDay: {
        id: 'perfect_day',
        name: 'Mükemmel Gün',
        description: 'Hem sabah hem akşam fırçaladın!',
        icon: '✨',
        points: 30,
        requirement: 2,
    },
    collector: {
        id: 'collector',
        name: 'Koleksiyoncu',
        description: '5 farklı rozet topladın!',
        icon: '🎖️',
        points: 100,
        requirement: 5,
    },
    legendary: {
        id: 'legendary',
        name: 'Efsanevi',
        description: '1000 toplam puana ulaştın!',
        icon: '🏆',
        points: 250,
        requirement: 1000,
    },
};

// ⏱️ Animasyon Süreleri (ms)
export const ANIMATIONS = {
    fast: 200,
    normal: 300,
    slow: 500,
    brushingTimer: 120000,     // 2 dakika
    sectionChange: 30000,      // 30 saniye (bölge değişimi)
    gameRound: 60000,          // 1 dakika oyun
    celebrationDuration: 3000, // Kutlama animasyonu
    fadeIn: 400,
    fadeOut: 300,
    bounce: 600,
    pulse: 1000,
};

// 🎯 Puan Değerleri
export const POINTS = {
    brushingComplete: 50,      // Fırçalama tamamlama
    perfectBrushing: 75,       // 2 dakika tam süre
    morningBonus: 10,          // Sabah bonusu
    eveningBonus: 10,          // Akşam bonusu
    streakBonus: 5,            // Her gün ekstra (streak * 5)
    bacteriaKill: 1,           // Bakteri öldürme
    memoryMatch: 10,           // Kart eşleştirme
    defensePoint: 5,           // Savunma puanı
    comboMultiplier: 1.5,      // Kombo çarpanı
};

// 📊 Level Sistemi
export const LEVELS = [
    { level: 1, name: 'Çaylak', minPoints: 0, maxPoints: 99, icon: '🌱' },
    { level: 2, name: 'Acemi', minPoints: 100, maxPoints: 249, icon: '🌿' },
    { level: 3, name: 'Öğrenci', minPoints: 250, maxPoints: 499, icon: '📚' },
    { level: 4, name: 'Pratisyen', minPoints: 500, maxPoints: 999, icon: '⭐' },
    { level: 5, name: 'Uzman', minPoints: 1000, maxPoints: 1999, icon: '🌟' },
    { level: 6, name: 'Usta', minPoints: 2000, maxPoints: 3999, icon: '💫' },
    { level: 7, name: 'Kahraman', minPoints: 4000, maxPoints: 7999, icon: '🦸' },
    { level: 8, name: 'Efsane', minPoints: 8000, maxPoints: 14999, icon: '👑' },
    { level: 9, name: 'Şampiyon', minPoints: 15000, maxPoints: 29999, icon: '🏆' },
    { level: 10, name: 'Tanrısal', minPoints: 30000, maxPoints: Infinity, icon: '✨' },
];

// 🦷 Fırçalama Bölgeleri
export const BRUSHING_SECTIONS = [
    { id: 'upper_left', name: 'Üst Sol', duration: 30, icon: '↖️' },
    { id: 'upper_right', name: 'Üst Sağ', duration: 30, icon: '↗️' },
    { id: 'lower_left', name: 'Alt Sol', duration: 30, icon: '↙️' },
    { id: 'lower_right', name: 'Alt Sağ', duration: 30, icon: '↘️' },
];

// 🔔 Bildirim Mesajları
export const NOTIFICATIONS = {
    morningReminder: {
        title: '🌅 Günaydın!',
        body: 'Dişlerini fırçalama zamanı! Harika bir güne başla!',
    },
    eveningReminder: {
        title: '🌙 İyi Geceler!',
        body: 'Uyumadan önce dişlerini fırçalamayı unutma!',
    },
    streakWarning: {
        title: '⚠️ Dikkat!',
        body: 'Serisini kaybetmek üzeresin! Hemen fırçala!',
    },
    badgeUnlocked: {
        title: '🏆 Yeni Rozet!',
        body: 'Tebrikler! Yeni bir rozet kazandın!',
    },
    levelUp: {
        title: '🎉 Seviye Atladın!',
        body: 'Harika gidiyorsun! Yeni seviyene hoş geldin!',
    },
};

// 🎮 Oyun Ayarları
export const GAME_SETTINGS = {
    bacteria: {
        spawnInterval: 1000,      // Her 1 saniyede yeni bakteri
        maxBacteria: 10,          // Maksimum bakteri sayısı
        bacteriaSpeed: 2000,      // Bakteri kaybolma süresi
        gameDuration: 60,         // 60 saniye
    },
    defense: {
        fallSpeed: 3000,          // Düşme hızı
        spawnInterval: 1500,      // Spawn aralığı
        lives: 5,                 // Can sayısı (artırıldı)
        gameDuration: 90,         // 90 saniye
    },
    memory: {
        cardCount: 16,            // 4x4 kart
        flipDuration: 500,        // Kart çevirme süresi
        matchDelay: 1000,         // Eşleşme kontrolü gecikmesi
    },
};

// 👤 Avatar Seçenekleri
export const AVATARS = [
    { id: 'tooth_happy', emoji: '😁', name: 'Mutlu Diş' },
    { id: 'tooth_cool', emoji: '😎', name: 'Havalı Diş' },
    { id: 'tooth_star', emoji: '🌟', name: 'Yıldız' },
    { id: 'tooth_hero', emoji: '🦸', name: 'Süper Kahraman' },
    { id: 'tooth_crown', emoji: '👑', name: 'Kral' },
    { id: 'tooth_rocket', emoji: '🚀', name: 'Roket' },
    { id: 'tooth_rainbow', emoji: '🌈', name: 'Gökkuşağı' },
    { id: 'tooth_magic', emoji: '✨', name: 'Sihirli' },
];

// 📱 Ekran Sabitleri
export const SCREEN_NAMES = {
    HOME: 'Home',
    BRUSHING: 'Brushing',
    GAMES: 'Games',
    PROGRESS: 'Progress',
    SETTINGS: 'Settings',
    BACTERIA_GAME: 'BacteriaGame',
    DEFENSE_GAME: 'DefenseGame',
    MEMORY_GAME: 'MemoryGame',
    TIPS: 'Tips',
    PARENT_PANEL: 'ParentPanel',
};

// 💾 Storage Keys
export const STORAGE_KEYS = {
    USER_DATA: '@SmileHero:userData',
    BRUSHING_HISTORY: '@SmileHero:brushingHistory',
    BADGES: '@SmileHero:badges',
    POINTS: '@SmileHero:points',
    STREAK: '@SmileHero:streak',
    SETTINGS: '@SmileHero:settings',
    LAST_BRUSHING: '@SmileHero:lastBrushing',
    GAME_STATS: '@SmileHero:gameStats',
    PARENT_DATA: '@SmileHero:parentData',
};

// 📚 Diş Sağlığı İpuçları
export const TIPS_DATA = [
    {
        id: 'brushing',
        title: 'Doğru Fırçalama',
        icon: '🪥',
        color: '#4FC3F7',
        tips: [
            { title: '2 Dakika Kural', text: 'Her fırçalamayı en az 2 dakika yap. Bu süre tüm dişlerini temizlemen için gerekli!' },
            { title: 'Yumuşak Hareketler', text: 'Dişlerini çok sert fırçalama. Yumuşak dairesel hareketlerle fırçala.' },
            { title: 'Diş Etlerini Unutma', text: 'Dişlerinin yanı sıra diş etlerini de nazikçe fırçala.' },
            { title: 'Dil Temizliği', text: 'Dilini de temizlemeyi unutma, bakteriler orada da yaşar!' },
        ],
    },
    {
        id: 'nutrition',
        title: 'Sağlıklı Beslenme',
        icon: '🍎',
        color: '#81C784',
        tips: [
            { title: 'Şekerden Uzak Dur', text: 'Şekerli yiyecekler dişlerinde çürük yapan bakterileri besler.' },
            { title: 'Su İç', text: 'Bol su içmek ağzındaki bakterileri temizlemeye yardımcı olur.' },
            { title: 'Sebze ve Meyve', text: 'Havuç ve elma gibi yiyecekler dişlerini doğal olarak temizler.' },
            { title: 'Süt ve Peynir', text: 'Kalsiyum içeren besinler dişlerini güçlendirir.' },
        ],
    },
    {
        id: 'floss',
        title: 'Diş İpi Kullanımı',
        icon: '🧵',
        color: '#FFD54F',
        tips: [
            { title: 'Günde Bir Kez', text: 'Her gün en az bir kez diş ipi kullan.' },
            { title: 'Nazik Ol', text: 'Diş ipini diş etlerine zarar vermeden nazikçe kullan.' },
            { title: 'Her Diş Arası', text: 'Tüm dişlerin arasını temizlemeyi unutma.' },
        ],
    },
    {
        id: 'dentist',
        title: 'Diş Hekimi Ziyareti',
        icon: '👨‍⚕️',
        color: '#BA68C8',
        tips: [
            { title: '6 Ayda Bir', text: 'Yılda en az 2 kez diş hekimine git.' },
            { title: 'Korkma', text: 'Diş hekimi sana yardım etmek için oradadır, korkma!' },
            { title: 'Sorular Sor', text: 'Diş hekimine merak ettiklerini sormaktan çekinme.' },
        ],
    },
];

// 🦷 Maskot Mesajları
export const MASCOT_MESSAGES = {
    greeting: [
        'Merhaba! Ben Dişko! 🦷',
        'Bugün dişlerini fırçaladın mı?',
        'Harika görünüyorsun!',
    ],
    motivation: [
        'Harika gidiyorsun! 💪',
        'Sen bir süpersin!',
        'Dişlerin çok mutlu! 😁',
    ],
    reminder: [
        'Fırçalama zamanı geldi!',
        'Dişlerin seni bekliyor!',
        'Hadi fırçalayalım! 🪥',
    ],
    celebration: [
        'Tebrikler! 🎉',
        'Muhteşemsin!',
        'Gerçek bir kahraman! 🦸',
    ],
    streak: [
        'Serisini devam ettir!',
        'Her gün daha iyiye!',
        'Durma devam! 🔥',
    ],
};

// 👨‍👩‍👧 Ebeveyn Paneli Ayarları
export const PARENT_SETTINGS = {
    defaultPin: '1234',
    rewardTypes: [
        { id: 'sticker', name: 'Çıkartma', icon: '⭐' },
        { id: 'toy', name: 'Oyuncak', icon: '🧸' },
        { id: 'trip', name: 'Gezi', icon: '🎢' },
        { id: 'game', name: 'Oyun Süresi', icon: '🎮' },
        { id: 'treat', name: 'Tatlı', icon: '🍦' },
    ],
};

export default {
    COLORS,
    BADGES,
    ANIMATIONS,
    POINTS,
    LEVELS,
    BRUSHING_SECTIONS,
    NOTIFICATIONS,
    GAME_SETTINGS,
    AVATARS,
    SCREEN_NAMES,
    STORAGE_KEYS,
    TIPS_DATA,
    MASCOT_MESSAGES,
    PARENT_SETTINGS,
};
