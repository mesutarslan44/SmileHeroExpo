// =====================================================
// 🦷 DİŞ KAHRAMANI - SETTINGS SCREEN (PROFESSIONAL)
// Minimal ve profesyonel ayarlar ekranı
// =====================================================

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    TextInput,
    Modal,
    Alert,
    Dimensions,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useGame } from '../contexts/GameContext';
import { COLORS, AVATARS, SCREEN_NAMES } from '../utils/constants';

const { width } = Dimensions.get('window');

// Setting Item Component
const SettingItem = ({ icon, title, subtitle, onPress, rightElement, danger }) => (
    <TouchableOpacity
        style={styles.settingItem}
        onPress={onPress}
        disabled={!onPress && !rightElement}
        activeOpacity={onPress ? 0.7 : 1}
    >
        <View style={[styles.settingIconBg, danger && styles.dangerIconBg]}>
            <Text style={styles.settingIcon}>{icon}</Text>
        </View>
        <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, danger && styles.dangerTitle]}>{title}</Text>
            {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
        {rightElement || (onPress && <Text style={styles.chevron}>›</Text>)}
    </TouchableOpacity>
);

// Section Component
const Section = ({ title, children }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionContent}>{children}</View>
    </View>
);

const SettingsScreen = () => {
    const navigation = useNavigation();
    const { user, settings, updateUser, updateSettings, resetAllData } = useGame();

    const [showEditProfile, setShowEditProfile] = useState(false);
    const [editName, setEditName] = useState(user?.name || '');
    const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || AVATARS[0]);

    const handleSoundToggle = useCallback(value => updateSettings({ soundEnabled: value }), [updateSettings]);
    const handleNotificationToggle = useCallback(value => updateSettings({ notificationsEnabled: value }), [updateSettings]);

    const handleSaveProfile = useCallback(async () => {
        await updateUser({ name: editName, avatar: selectedAvatar });
        setShowEditProfile(false);
    }, [editName, selectedAvatar, updateUser]);

    const handleResetData = useCallback(() => {
        Alert.alert('Verileri Sıfırla', 'Tüm verileriniz silinecek. Bu işlem geri alınamaz!', [
            { text: 'İptal', style: 'cancel' },
            {
                text: 'Sıfırla', style: 'destructive', onPress: async () => {
                    await resetAllData();
                    Alert.alert('Başarılı', 'Tüm veriler sıfırlandı.');
                }
            },
        ]);
    }, [resetAllData]);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <Text style={styles.headerTitle}>Ayarlar</Text>

                    {/* Profile Card */}
                    <TouchableOpacity style={styles.profileCard} onPress={() => setShowEditProfile(true)} activeOpacity={0.8}>
                        <View style={styles.profileAvatar}>
                            <Text style={styles.avatarEmoji}>{user?.avatar?.emoji || '😁'}</Text>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{user?.name || 'Kullanıcı'}</Text>
                            <Text style={styles.profileEdit}>Profili düzenle</Text>
                        </View>
                        <Text style={styles.chevron}>›</Text>
                    </TouchableOpacity>

                    {/* Notifications */}
                    <Section title="Bildirimler">
                        <SettingItem
                            icon="🔔"
                            title="Hatırlatıcılar"
                            subtitle="Fırçalama bildirimleri"
                            rightElement={
                                <Switch
                                    value={settings?.notificationsEnabled ?? true}
                                    onValueChange={handleNotificationToggle}
                                    trackColor={{ false: '#E5E7EB', true: COLORS.primaryLight }}
                                    thumbColor={settings?.notificationsEnabled ? COLORS.primary : '#F9FAFB'}
                                />
                            }
                        />
                        {settings?.notificationsEnabled && (
                            <>
                                <SettingItem
                                    icon="🌅"
                                    title="Sabah Hatırlatıcısı"
                                    subtitle={settings?.morningReminderTime || '08:00'}
                                    onPress={() => {
                                        Alert.alert(
                                            '🌅 Sabah Saati',
                                            'Sabah hatırlatıcı saatini seçin:',
                                            [
                                                { text: '06:00', onPress: () => updateSettings({ morningReminderTime: '06:00' }) },
                                                { text: '07:00', onPress: () => updateSettings({ morningReminderTime: '07:00' }) },
                                                { text: '08:00', onPress: () => updateSettings({ morningReminderTime: '08:00' }) },
                                                { text: '09:00', onPress: () => updateSettings({ morningReminderTime: '09:00' }) },
                                                { text: 'İptal', style: 'cancel' },
                                            ]
                                        );
                                    }}
                                />
                                <SettingItem
                                    icon="🌙"
                                    title="Akşam Hatırlatıcısı"
                                    subtitle={settings?.eveningReminderTime || '21:00'}
                                    onPress={() => {
                                        Alert.alert(
                                            '🌙 Akşam Saati',
                                            'Akşam hatırlatıcı saatini seçin:',
                                            [
                                                { text: '19:00', onPress: () => updateSettings({ eveningReminderTime: '19:00' }) },
                                                { text: '20:00', onPress: () => updateSettings({ eveningReminderTime: '20:00' }) },
                                                { text: '21:00', onPress: () => updateSettings({ eveningReminderTime: '21:00' }) },
                                                { text: '22:00', onPress: () => updateSettings({ eveningReminderTime: '22:00' }) },
                                                { text: 'İptal', style: 'cancel' },
                                            ]
                                        );
                                    }}
                                />
                            </>
                        )}
                        <SettingItem
                            icon="🔊"
                            title="Ses Efektleri"
                            subtitle="Oyun ve uygulama sesleri"
                            rightElement={
                                <Switch
                                    value={settings?.soundEnabled ?? true}
                                    onValueChange={handleSoundToggle}
                                    trackColor={{ false: '#E5E7EB', true: COLORS.primaryLight }}
                                    thumbColor={settings?.soundEnabled ? COLORS.primary : '#F9FAFB'}
                                />
                            }
                        />
                    </Section>

                    {/* Features */}
                    <Section title="Özellikler">
                        <SettingItem
                            icon="📚"
                            title="Diş Sağlığı İpuçları"
                            subtitle="Faydalı bilgiler ve tavsiyeler"
                            onPress={() => navigation.navigate(SCREEN_NAMES.TIPS)}
                        />
                        <SettingItem
                            icon="👨‍👩‍👧"
                            title="Ebeveyn Paneli"
                            subtitle="İstatistikler ve ödül yönetimi"
                            onPress={() => navigation.navigate(SCREEN_NAMES.PARENT_PANEL)}
                        />
                    </Section>

                    {/* Data */}
                    <Section title="Veri">
                        <SettingItem
                            icon="🗑️"
                            title="Verileri Sıfırla"
                            subtitle="Tüm ilerleme silinir"
                            onPress={handleResetData}
                            danger
                        />
                    </Section>

                    {/* About */}
                    <Section title="Hakkında">
                        <SettingItem icon="ℹ️" title="Versiyon" rightElement={<Text style={styles.versionText}>1.0.0</Text>} />
                    </Section>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerLogo}>🦷</Text>
                        <Text style={styles.footerText}>SmileHero</Text>
                        <Text style={styles.footerSubtext}>Sağlıklı gülüşler için</Text>
                    </View>

                    <View style={styles.bottomSpacing} />
                </ScrollView>

                {/* Edit Profile Modal */}
                <Modal visible={showEditProfile} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHandle} />
                            <Text style={styles.modalTitle}>Profili Düzenle</Text>

                            {/* Avatar Selection */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarScroll}>
                                {AVATARS.map(avatar => (
                                    <TouchableOpacity
                                        key={avatar.id}
                                        style={[styles.avatarOption, selectedAvatar?.id === avatar.id && styles.avatarSelected]}
                                        onPress={() => setSelectedAvatar(avatar)}
                                    >
                                        <Text style={styles.avatarOptionEmoji}>{avatar.emoji}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Name Input */}
                            <Text style={styles.inputLabel}>İsim</Text>
                            <TextInput
                                style={styles.textInput}
                                value={editName}
                                onChangeText={setEditName}
                                placeholder="İsminizi girin"
                                placeholderTextColor="#9CA3AF"
                            />

                            {/* Buttons */}
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowEditProfile(false)}>
                                    <Text style={styles.cancelBtnText}>İptal</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                                    <Text style={styles.saveBtnText}>Kaydet</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    safeArea: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 10 },

    headerTitle: { fontSize: 32, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 24, letterSpacing: -0.5 },

    // Profile Card
    profileCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    profileAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    avatarEmoji: { fontSize: 32 },
    profileInfo: { flex: 1 },
    profileName: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
    profileEdit: { fontSize: 13, color: COLORS.primary, marginTop: 2, fontWeight: '600' },
    chevron: { fontSize: 24, color: COLORS.textSecondary, fontWeight: '300' },

    // Section
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    sectionContent: { backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },

    // Setting Item
    settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    settingIconBg: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    dangerIconBg: { backgroundColor: '#FEE2E2' },
    settingIcon: { fontSize: 20 },
    settingContent: { flex: 1 },
    settingTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
    dangerTitle: { color: COLORS.danger },
    settingSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
    versionText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },

    // Footer
    footer: { alignItems: 'center', marginTop: 20, marginBottom: 10 },
    footerLogo: { fontSize: 40, marginBottom: 8 },
    footerText: { fontSize: 18, fontWeight: '700', color: COLORS.primary },
    footerSubtext: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },

    bottomSpacing: { height: 130 },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    modalHandle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center', marginBottom: 20 },
    avatarScroll: { marginBottom: 24 },
    avatarOption: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    avatarSelected: { backgroundColor: COLORS.primaryLight, borderWidth: 2, borderColor: COLORS.primary },
    avatarOptionEmoji: { fontSize: 28 },
    inputLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8 },
    textInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: COLORS.textPrimary, marginBottom: 24 },
    modalButtons: { flexDirection: 'row', gap: 12 },
    cancelBtn: { flex: 1, paddingVertical: 16, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center' },
    cancelBtnText: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary },
    saveBtn: { flex: 1, paddingVertical: 16, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center' },
    saveBtnText: { fontSize: 16, fontWeight: '600', color: COLORS.white },
});

export default SettingsScreen;
