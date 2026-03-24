// =====================================================
// 🦷 DİŞ KAHRAMANI - GAME CONTEXT
// Global state yönetimi için Context API
// =====================================================

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import * as StorageService from '../services/StorageService';
import * as NotificationService from '../services/NotificationService';
import * as SoundService from '../services/SoundService';
import {
    getLevelFromPoints,
    checkBadgeUnlock,
    calculateBrushingPoints,
    getTimeOfDay
} from '../utils/helpers';
import { AVATARS } from '../utils/constants';

// Initial State
const initialState = {
    // Yükleme durumu
    isLoading: true,
    isInitialized: false,

    // Kullanıcı bilgileri
    user: {
        name: '',
        avatar: AVATARS[0],
        createdAt: null,
    },

    // Oyun durumu
    points: 0,
    level: null,
    streak: 0,
    badges: [],

    // Fırçalama durumu
    todayBrushing: {
        morning: false,
        evening: false,
    },
    brushingHistory: [],

    // Oyun istatistikleri
    gameStats: {
        bacteria: { gamesPlayed: 0, highScore: 0, totalScore: 0 },
        defense: { gamesPlayed: 0, highScore: 0, totalScore: 0 },
        memory: { gamesPlayed: 0, highScore: 0, bestTime: null },
    },

    // Ayarlar
    settings: {
        soundEnabled: true,
        notificationsEnabled: true,
        morningReminderTime: '08:00',
        eveningReminderTime: '21:00',
        theme: 'light',
    },

    // Son kazanılan rozet (popup için)
    newBadge: null,
};

// Action Types
const ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    INITIALIZE: 'INITIALIZE',
    SET_USER: 'SET_USER',
    ADD_POINTS: 'ADD_POINTS',
    UPDATE_STREAK: 'UPDATE_STREAK',
    ADD_BADGE: 'ADD_BADGE',
    CLEAR_NEW_BADGE: 'CLEAR_NEW_BADGE',
    COMPLETE_BRUSHING: 'COMPLETE_BRUSHING',
    UPDATE_GAME_STATS: 'UPDATE_GAME_STATS',
    UPDATE_SETTINGS: 'UPDATE_SETTINGS',
    RESET_ALL: 'RESET_ALL',
};

// Reducer
const gameReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload };

        case ACTIONS.INITIALIZE:
            const level = getLevelFromPoints(action.payload.points || 0);
            return {
                ...state,
                isLoading: false,
                isInitialized: true,
                user: action.payload.userData || initialState.user,
                points: action.payload.points || 0,
                level,
                streak: action.payload.streak || 0,
                badges: action.payload.badges || [],
                todayBrushing: action.payload.todayBrushing || initialState.todayBrushing,
                brushingHistory: action.payload.brushingHistory || [],
                gameStats: action.payload.gameStats || initialState.gameStats,
                settings: action.payload.settings || initialState.settings,
            };

        case ACTIONS.SET_USER:
            return {
                ...state,
                user: { ...state.user, ...action.payload },
            };

        case ACTIONS.ADD_POINTS:
            const newPoints = state.points + action.payload;
            const newLevel = getLevelFromPoints(newPoints);
            return {
                ...state,
                points: newPoints,
                level: newLevel,
            };

        case ACTIONS.UPDATE_STREAK:
            return { ...state, streak: action.payload };

        case ACTIONS.ADD_BADGE:
            return {
                ...state,
                badges: [...state.badges, action.payload],
                newBadge: action.payload,
            };

        case ACTIONS.CLEAR_NEW_BADGE:
            return { ...state, newBadge: null };

        case ACTIONS.COMPLETE_BRUSHING:
            return {
                ...state,
                todayBrushing: {
                    ...state.todayBrushing,
                    [action.payload.type]: true,
                },
            };

        case ACTIONS.UPDATE_GAME_STATS:
            return {
                ...state,
                gameStats: {
                    ...state.gameStats,
                    [action.payload.gameType]: action.payload.stats,
                },
            };

        case ACTIONS.UPDATE_SETTINGS:
            return {
                ...state,
                settings: { ...state.settings, ...action.payload },
            };

        case ACTIONS.RESET_ALL:
            return { ...initialState, isLoading: false, isInitialized: true };

        default:
            return state;
    }
};

// Context
const GameContext = createContext(null);

// Provider Component
export const GameProvider = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    // Uygulama başlangıcında verileri yükle
    useEffect(() => {
        loadInitialData();
    }, []);

    // Ayarlar değiştiğinde sesleri ve bildirimleri güncelle
    useEffect(() => {
        if (state.isInitialized) {
            SoundService.initializeSounds(
                state.settings.soundEnabled,
                1.0
            );

            NotificationService.initializeNotifications(state.settings);
        }
    }, [state.settings, state.isInitialized]);

    // Başlangıç verilerini yükle
    const loadInitialData = async () => {
        try {
            const data = await StorageService.loadAllData();

            if (data) {
                dispatch({ type: ACTIONS.INITIALIZE, payload: data });
            } else {
                dispatch({ type: ACTIONS.SET_LOADING, payload: false });
            }
        } catch (error) {
            console.error('Error loading initial data:', error);
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        }
    };

    // Kullanıcı bilgilerini güncelle
    const updateUser = useCallback(async (userData) => {
        try {
            const result = await StorageService.saveUserData({
                ...state.user,
                ...userData,
                createdAt: state.user.createdAt || new Date().toISOString(),
            });

            if (result.success) {
                dispatch({ type: ACTIONS.SET_USER, payload: userData });
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            console.error('Error updating user:', error);
            return { success: false, error };
        }
    }, [state.user]);

    // Fırçalamayı tamamla
    const completeBrushing = useCallback(async (duration) => {
        try {
            const timeOfDay = getTimeOfDay();
            const type = timeOfDay === 'morning' || timeOfDay === 'afternoon' ? 'morning' : 'evening';

            // Puanı hesapla
            const points = calculateBrushingPoints({
                duration,
                streak: state.streak,
                isMorning: type === 'morning',
                isEvening: type === 'evening',
            });

            // Fırçalama kaydını kaydet
            const result = await StorageService.saveBrushingRecord({
                type,
                duration,
                points,
            });

            if (result.success) {
                // State güncelle
                dispatch({ type: ACTIONS.COMPLETE_BRUSHING, payload: { type } });

                // Puanları ekle
                await addPoints(points);

                // Streak'i güncelle
                const newStreak = await StorageService.getStreak();
                dispatch({ type: ACTIONS.UPDATE_STREAK, payload: newStreak });

                // Rozet kontrolü
                await checkAndUnlockBadges({
                    totalBrushings: state.brushingHistory.length + 1,
                    streak: newStreak,
                    totalPoints: state.points + points,
                });

                // Ses çal
                SoundService.playComplete();

                return { success: true, points, type };
            }

            return { success: false };
        } catch (error) {
            console.error('Error completing brushing:', error);
            return { success: false, error };
        }
    }, [state.streak, state.brushingHistory.length, state.points]);

    // Puan ekle
    const addPoints = useCallback(async (points) => {
        try {
            const result = await StorageService.addPoints(points);

            if (result.success) {
                const previousLevel = state.level?.level || 1;
                dispatch({ type: ACTIONS.ADD_POINTS, payload: points });

                // Level atladı mı kontrol et
                const newLevel = getLevelFromPoints(result.total);
                if (newLevel.level > previousLevel) {
                    SoundService.playLevelUp();
                    NotificationService.sendLevelUpNotification(newLevel);
                }

                return { success: true, total: result.total };
            }

            return { success: false };
        } catch (error) {
            console.error('Error adding points:', error);
            return { success: false, error };
        }
    }, [state.level]);

    // Rozet kontrolü ve unlock
    const checkAndUnlockBadges = useCallback(async (stats) => {
        try {
            const extendedStats = {
                ...stats,
                bacteriaKilled: state.gameStats.bacteria?.totalScore || 0,
                memoryBestTime: state.gameStats.memory?.bestTime || Infinity,
                defenseHighScore: state.gameStats.defense?.highScore || 0,
            };

            const newBadges = checkBadgeUnlock(extendedStats, state.badges);

            for (const badge of newBadges) {
                const result = await StorageService.addBadge(badge);
                if (result.success) {
                    dispatch({ type: ACTIONS.ADD_BADGE, payload: badge });
                    SoundService.playBadgeUnlock();
                    NotificationService.sendBadgeUnlockedNotification(badge.name);

                    // Rozet puanını ekle
                    await addPoints(badge.points);
                }
            }

            return newBadges;
        } catch (error) {
            console.error('Error checking badges:', error);
            return [];
        }
    }, [state.badges, state.gameStats, addPoints]);

    // Yeni rozet popup'ını kapat
    const clearNewBadge = useCallback(() => {
        dispatch({ type: ACTIONS.CLEAR_NEW_BADGE });
    }, []);

    // Oyun istatistiklerini güncelle
    const updateGameStats = useCallback(async (gameType, stats) => {
        try {
            const result = await StorageService.saveGameStats(gameType, stats);

            if (result.success) {
                dispatch({
                    type: ACTIONS.UPDATE_GAME_STATS,
                    payload: { gameType, stats: result.stats },
                });

                // Puanları ekle
                if (stats.score > 0) {
                    await addPoints(stats.score);
                }

                // Rozet kontrolü
                await checkAndUnlockBadges({
                    totalPoints: state.points + (stats.score || 0),
                });

                return { success: true };
            }

            return { success: false };
        } catch (error) {
            console.error('Error updating game stats:', error);
            return { success: false, error };
        }
    }, [state.points, addPoints, checkAndUnlockBadges]);

    // Ayarları güncelle
    const updateSettings = useCallback(async (newSettings) => {
        try {
            const result = await StorageService.saveSettings(newSettings);

            if (result.success) {
                dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: newSettings });
                return { success: true };
            }

            return { success: false };
        } catch (error) {
            console.error('Error updating settings:', error);
            return { success: false, error };
        }
    }, []);

    // Tüm verileri sıfırla
    const resetAllData = useCallback(async () => {
        try {
            const result = await StorageService.resetAllData();

            if (result.success) {
                NotificationService.cancelAllNotifications();
                dispatch({ type: ACTIONS.RESET_ALL });
                return { success: true };
            }

            return { success: false };
        } catch (error) {
            console.error('Error resetting data:', error);
            return { success: false, error };
        }
    }, []);

    // Context value
    const value = {
        // State
        ...state,

        // Actions
        updateUser,
        completeBrushing,
        addPoints,
        updateGameStats,
        updateSettings,
        resetAllData,
        clearNewBadge,
        checkAndUnlockBadges,
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

// Custom Hook
export const useGame = () => {
    const context = useContext(GameContext);

    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }

    return context;
};

export default GameContext;
