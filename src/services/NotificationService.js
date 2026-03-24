// =====================================================
// 🦷 DİŞ KAHRAMANI - NOTIFICATION SERVICE
// Fırçalama hatırlatıcıları ve bildirim yönetimi
// =====================================================

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import { NOTIFICATIONS } from '../utils/constants';

// Bildirim yapılandırması
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

/**
 * Bildirim izni iste
 * @returns {Promise<boolean>}
 */
export const requestNotificationPermission = async () => {
    try {
        if (!Device.isDevice) {
            console.log('Push notifications require a physical device');
            return false;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return false;
        }

        // Android için bildirim kanalı oluştur
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('brushing_reminders', {
                name: 'Fırçalama Hatırlatıcıları',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                sound: 'default',
            });
        }

        return true;
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
    }
};

/**
 * Bildirim izni kontrol et
 * @returns {Promise<boolean>}
 */
export const checkNotificationPermission = async () => {
    try {
        const { status } = await Notifications.getPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        return false;
    }
};

/**
 * Sabah hatırlatıcısını planla
 * @param {string} time - Saat (HH:MM formatı)
 */
export const scheduleMorningReminder = async (time = '08:00') => {
    try {
        const [hours, minutes] = time.split(':').map(Number);

        // Mevcut sabah hatırlatıcısını iptal et
        await cancelNotification('morning_reminder');

        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: NOTIFICATIONS.morningReminder.title,
                body: NOTIFICATIONS.morningReminder.body,
                sound: 'default',
                data: { type: 'morning_reminder' },
            },
            trigger: {
                hour: hours,
                minute: minutes,
                repeats: true,
                channelId: 'brushing_reminders',
            },
            identifier: 'morning_reminder',
        });

        console.log('Morning reminder scheduled:', identifier);
        return { success: true, identifier };
    } catch (error) {
        console.error('Error scheduling morning reminder:', error);
        return { success: false, error };
    }
};

/**
 * Akşam hatırlatıcısını planla
 * @param {string} time - Saat (HH:MM formatı)
 */
export const scheduleEveningReminder = async (time = '21:00') => {
    try {
        const [hours, minutes] = time.split(':').map(Number);

        // Mevcut akşam hatırlatıcısını iptal et
        await cancelNotification('evening_reminder');

        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: NOTIFICATIONS.eveningReminder.title,
                body: NOTIFICATIONS.eveningReminder.body,
                sound: 'default',
                data: { type: 'evening_reminder' },
            },
            trigger: {
                hour: hours,
                minute: minutes,
                repeats: true,
                channelId: 'brushing_reminders',
            },
            identifier: 'evening_reminder',
        });

        console.log('Evening reminder scheduled:', identifier);
        return { success: true, identifier };
    } catch (error) {
        console.error('Error scheduling evening reminder:', error);
        return { success: false, error };
    }
};

/**
 * Streak uyarı bildirimi gönder
 */
export const sendStreakWarning = async () => {
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '⚠️ Seri Tehlikede!',
                body: 'Bugün henüz dişlerini fırçalamadın. Serini kaybetme!',
                sound: 'default',
            },
            trigger: null, // Hemen gönder
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending streak warning:', error);
        return { success: false, error };
    }
};

/**
 * Rozet kazanma bildirimi gönder
 * @param {string} badgeName - Rozet adı
 */
export const sendBadgeUnlockedNotification = async (badgeName) => {
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '🏆 Yeni Rozet!',
                body: `${badgeName} rozetini kazandın!`,
                sound: 'default',
            },
            trigger: null,
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending badge notification:', error);
        return { success: false, error };
    }
};

/**
 * Level atlama bildirimi gönder
 * @param {Object} level - Level bilgisi
 */
export const sendLevelUpNotification = async (level) => {
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '🎉 Level Atladın!',
                body: `Artık ${level.name} seviyesindesin! ${level.icon}`,
                sound: 'default',
            },
            trigger: null,
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending level up notification:', error);
        return { success: false, error };
    }
};

/**
 * Belirli bir bildirimi iptal et
 * @param {string} notificationId
 */
export const cancelNotification = async (notificationId) => {
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        console.log('Notification cancelled:', notificationId);
        return { success: true };
    } catch (error) {
        // Bildirim bulunamadıysa sessizce geç
        return { success: true };
    }
};

/**
 * Tüm bildirimleri iptal et
 */
export const cancelAllNotifications = async () => {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log('All notifications cancelled');
        return { success: true };
    } catch (error) {
        console.error('Error cancelling all notifications:', error);
        return { success: false, error };
    }
};

/**
 * Planlanmış bildirimleri getir
 * @returns {Promise<Array>}
 */
export const getScheduledNotifications = async () => {
    try {
        return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
        return [];
    }
};

/**
 * Bildirimleri başlat (ayarlara göre)
 * @param {Object} settings - { morningReminderTime, eveningReminderTime, notificationsEnabled }
 */
export const initializeNotifications = async (settings) => {
    try {
        if (!settings.notificationsEnabled) {
            await cancelAllNotifications();
            return { success: true, enabled: false };
        }

        const hasPermission = await requestNotificationPermission();

        if (!hasPermission) {
            return { success: false, reason: 'Permission denied' };
        }

        await scheduleMorningReminder(settings.morningReminderTime || '08:00');
        await scheduleEveningReminder(settings.eveningReminderTime || '21:00');

        return { success: true, enabled: true };
    } catch (error) {
        console.error('Error initializing notifications:', error);
        return { success: false, error };
    }
};

/**
 * Uygulama içi uyarı göster
 * @param {string} title
 * @param {string} message
 * @param {Array} buttons
 */
export const showInAppAlert = (title, message, buttons = [{ text: 'Tamam' }]) => {
    Alert.alert(title, message, buttons);
};

export default {
    checkNotificationPermission,
    requestNotificationPermission,
    scheduleMorningReminder,
    scheduleEveningReminder,
    sendStreakWarning,
    sendBadgeUnlockedNotification,
    sendLevelUpNotification,
    cancelNotification,
    cancelAllNotifications,
    getScheduledNotifications,
    initializeNotifications,
    showInAppAlert,
};
