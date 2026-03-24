// =====================================================
// 🦷 DİŞ KAHRAMANI - TIPS SCREEN (PROFESSIONAL)
// Minimal ve profesyonel ipuçları ekranı
// =====================================================

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, TIPS_DATA } from '../utils/constants';

const { width } = Dimensions.get('window');

const TipCard = ({ tip, index, isExpanded, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, { toValue: 1, delay: index * 80, friction: 8, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 300, delay: index * 80, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[styles.tipCard, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(tip.id)}>
                <LinearGradient
                    colors={[tip.color, tip.color + 'DD']}
                    style={styles.tipGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.tipHeader}>
                        <Text style={styles.tipIcon}>{tip.icon}</Text>
                        <Text style={styles.tipTitle}>{tip.title}</Text>
                        <View style={styles.tipArrow}>
                            <Text style={styles.tipArrowIcon}>{isExpanded ? '−' : '+'}</Text>
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.tipContent}>
                    {tip.tips.map((item, idx) => (
                        <View key={idx} style={styles.tipItem}>
                            <View style={[styles.tipBullet, { backgroundColor: tip.color }]} />
                            <View style={styles.tipTextWrap}>
                                <Text style={styles.tipItemTitle}>{item.title}</Text>
                                <Text style={styles.tipItemText}>{item.text}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </Animated.View>
    );
};

const TipsScreen = () => {
    const navigation = useNavigation();
    const [expandedTip, setExpandedTip] = useState(null);

    const handleTipPress = (tipId) => {
        setExpandedTip(expandedTip === tipId ? null : tipId);
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Diş Sağlığı İpuçları</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Intro */}
                    <View style={styles.introCard}>
                        <Text style={styles.introEmoji}>💡</Text>
                        <Text style={styles.introText}>
                            Sağlıklı dişler için bilmen gereken her şey burada!
                        </Text>
                    </View>

                    {/* Tips List */}
                    {TIPS_DATA.map((tip, index) => (
                        <TipCard
                            key={tip.id}
                            tip={tip}
                            index={index}
                            isExpanded={expandedTip === tip.id}
                            onPress={handleTipPress}
                        />
                    ))}

                    {/* Fun Fact */}
                    <View style={styles.funFactCard}>
                        <View style={styles.funFactIconBg}>
                            <Text style={styles.funFactIcon}>🧠</Text>
                        </View>
                        <Text style={styles.funFactTitle}>Bunu Biliyor Muydun?</Text>
                        <Text style={styles.funFactText}>
                            İnsan hayatı boyunca sadece 2 set diş çıkarır. Kalıcı dişlerine iyi bak!
                        </Text>
                    </View>

                    <View style={styles.bottomSpacing} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    safeArea: { flex: 1 },

    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
    backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    backIcon: { fontSize: 22, color: COLORS.textPrimary },
    headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
    placeholder: { width: 44 },

    scrollContent: { paddingHorizontal: 20 },

    // Intro
    introCard: { backgroundColor: COLORS.primary + '10', borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    introEmoji: { fontSize: 28, marginRight: 12 },
    introText: { flex: 1, fontSize: 14, color: COLORS.textPrimary, lineHeight: 20, fontWeight: '500' },

    // Tip Card
    tipCard: { marginBottom: 12, borderRadius: 16, overflow: 'hidden', backgroundColor: COLORS.white, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    tipGradient: { padding: 18 },
    tipHeader: { flexDirection: 'row', alignItems: 'center' },
    tipIcon: { fontSize: 28, marginRight: 12 },
    tipTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: COLORS.white },
    tipArrow: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
    tipArrowIcon: { fontSize: 18, color: COLORS.white, fontWeight: '700' },

    tipContent: { padding: 16, paddingTop: 0 },
    tipItem: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    tipBullet: { width: 8, height: 8, borderRadius: 4, marginTop: 6, marginRight: 12 },
    tipTextWrap: { flex: 1 },
    tipItemTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 4 },
    tipItemText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },

    // Fun Fact
    funFactCard: { backgroundColor: COLORS.accent + '15', borderRadius: 16, padding: 24, alignItems: 'center', marginTop: 8 },
    funFactIconBg: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.accent + '30', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    funFactIcon: { fontSize: 28 },
    funFactTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
    funFactText: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },

    bottomSpacing: { height: 30 },
});

export default TipsScreen;
