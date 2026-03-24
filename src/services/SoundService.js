// =====================================================
// 🦷 DİŞ KAHRAMANI - SOUND SERVICE
// Ses efektleri ve titreşim yönetimi (Yerel dosyalar)
// =====================================================

import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

let isSoundEnabled = true;
let isVibrationEnabled = true;
let soundVolume = 0.7;

// Önceden yüklenmiş sesler
let loadedSounds = {};

// Yerel ses dosyaları - mevcut dosyalar ile eşleştirme
const SOUND_FILES = {
    // Oyun sesleri
    select: require('../../assets/sounds/select.mp3'),
    capture: require('../../assets/sounds/capture.mp3'),
    attack: require('../../assets/sounds/attack.mp3'),
    powerup: require('../../assets/sounds/powerup.mp3'),
    victory: require('../../assets/sounds/victory.mp3'),
    defeat: require('../../assets/sounds/defeat.mp3'),
};

// Ses eşleştirmeleri (fonksiyon adı -> dosya)
const SOUND_MAP = {
    success: 'capture',
    gameStart: 'select',
    gameOver: 'defeat',
    bacteriaHit: 'attack',
    combo: 'powerup',
    cardFlip: 'select',
    match: 'capture',
    complete: 'victory',
    levelUp: 'powerup',
    badgeUnlock: 'victory',
    buttonClick: 'select',
    tick: 'select',
    countdown: 'select',
};

/**
 * Sesleri önceden yükle
 */
export const preloadSounds = async () => {
    try {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            staysActiveInBackground: false,
        });

        for (const [key, source] of Object.entries(SOUND_FILES)) {
            try {
                const { sound } = await Audio.Sound.createAsync(source, { volume: soundVolume });
                loadedSounds[key] = sound;
            } catch (e) {
                console.log(`Failed to load sound: ${key}`, e);
            }
        }
        console.log('Sounds preloaded successfully');
    } catch (error) {
        console.log('Error preloading sounds:', error);
    }
};

/**
 * Ses çal
 */
const playSound = async (soundName) => {
    if (!isSoundEnabled) return;

    const mappedSound = SOUND_MAP[soundName] || soundName;
    const sound = loadedSounds[mappedSound];

    if (sound) {
        try {
            await sound.setPositionAsync(0);
            // Powerup sesi için %60 azaltılmış volume (0.4 çarpanı)
            const volume = mappedSound === 'powerup' ? soundVolume * 0.4 : soundVolume;
            await sound.setVolumeAsync(volume);
            await sound.playAsync();
        } catch (e) {
            console.log('Error playing sound:', e);
        }
    }
};

/**
 * Ses servisini başlat
 */
export const initializeSounds = (enabled = true, volume = 0.7) => {
    isSoundEnabled = enabled;
    soundVolume = Math.min(1, Math.max(0, volume));
    preloadSounds();
};

// Ses fonksiyonları
export const playSuccess = () => playSound('success');
export const playTick = () => playSound('tick');
export const playComplete = () => playSound('complete');
export const playLevelUp = () => playSound('levelUp');
export const playBadgeUnlock = () => playSound('badgeUnlock');
export const playButtonClick = () => playSound('buttonClick');
export const playGameStart = () => playSound('gameStart');
export const playGameOver = () => playSound('gameOver');
export const playBacteriaHit = () => playSound('bacteriaHit');
export const playCombo = () => playSound('combo');
export const playCardFlip = () => playSound('cardFlip');
export const playMatch = () => playSound('match');
export const playCountdown = () => playSound('countdown');

/**
 * Ses aç/kapat
 */
export const toggleSound = (enabled) => {
    isSoundEnabled = enabled;
};

/**
 * Ses seviyesini ayarla
 */
export const setVolume = (volume) => {
    soundVolume = Math.min(1, Math.max(0, volume));
};

/**
 * Ses durumunu al
 */
export const getSoundStatus = () => ({
    enabled: isSoundEnabled,
    volume: soundVolume,
});

/**
 * Haptic feedback (titreşim)
 */
export const vibrate = async (type = 'light') => {
    if (!isVibrationEnabled) return;

    try {
        switch (type) {
            case 'light':
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                break;
            case 'medium':
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                break;
            case 'heavy':
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                break;
            case 'success':
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                break;
            case 'warning':
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                break;
            case 'error':
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                break;
            case 'selection':
                await Haptics.selectionAsync();
                break;
            default:
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    } catch (e) {
        // Haptics not available
    }
};

/**
 * Titreşimi aç/kapat
 */
export const toggleVibration = (enabled) => {
    isVibrationEnabled = enabled;
};

/**
 * Fırçalama sesi
 */
export const playBrushingSound = (remainingSeconds) => {
    if (remainingSeconds > 0 && remainingSeconds % 30 === 0) {
        playSound('countdown');
        vibrate('medium');
    }
    if (remainingSeconds <= 10 && remainingSeconds > 0) {
        playSound('tick');
    }
    if (remainingSeconds === 0) {
        playComplete();
        vibrate('heavy');
    }
};

/**
 * Sesleri temizle
 */
export const unloadSounds = async () => {
    for (const sound of Object.values(loadedSounds)) {
        try {
            await sound.unloadAsync();
        } catch (e) { }
    }
    loadedSounds = {};
};

export default {
    initializeSounds,
    preloadSounds,
    unloadSounds,
    playSuccess,
    playTick,
    playComplete,
    playLevelUp,
    playBadgeUnlock,
    playButtonClick,
    playGameStart,
    playGameOver,
    playBacteriaHit,
    playCombo,
    playCardFlip,
    playMatch,
    playCountdown,
    toggleSound,
    toggleVibration,
    setVolume,
    getSoundStatus,
    vibrate,
    playBrushingSound,
};
