// =====================================================
// 🦷 DİŞ KAHRAMANI - ULTRA PREMIUM BRUSHING SCREEN
// Gerçekçi PNG görseller + Animasyon + Müzik
// =====================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    Modal,
    Easing,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

import { useGame } from '../contexts/GameContext';
import { COLORS } from '../utils/constants';
import { formatDuration } from '../utils/helpers';
import * as SoundService from '../services/SoundService';

const { width, height } = Dimensions.get('window');
const TIMER_DURATION = 120; // 12 bölge x 10 saniye = 2 dakika
const ZONE_DURATION = 10;

// PNG Görselleri
const TeethOuterImage = require('../../assets/brushing/teeth_outer_view.png');
const TeethInnerImage = require('../../assets/brushing/teeth_inner_view.png');
const ToothbrushImage = require('../../assets/brushing/toothbrush.png');
const HighlightZoneImage = require('../../assets/brushing/teeth_highlight_zone.png');

// 🦷 12 Bölgeli Profesyonel Diş Fırçalama Haritası
const BRUSHING_ZONES = [
    // ÜST DIŞ (1-3)
    { id: 0, name: 'Üst Sağ Dış', icon: '↗️', instruction: '🔄 45° açıyla dairesel hareketler yap! Diş etine doğru nazikçe fırçala', view: 'outer', jaw: 'upper', side: 'right', highlightPos: { top: '25%', right: '10%' } },
    { id: 1, name: 'Üst Ön Dış', icon: '⬆️', instruction: '😁 Ön dişlerini yukarıdan aşağıya fırçala! Gülümsemeyi unutma', view: 'outer', jaw: 'upper', side: 'center', highlightPos: { top: '20%', left: '35%' } },
    { id: 2, name: 'Üst Sol Dış', icon: '↖️', instruction: '👈 Sol tarafa geç! Aynı dairesel hareketlerle devam et', view: 'outer', jaw: 'upper', side: 'left', highlightPos: { top: '25%', left: '10%' } },
    // ÜST İÇ (4-6)
    { id: 3, name: 'Üst Sağ İç', icon: '🔄', instruction: '🪥 Fırçayı dikey tut! Yukarı-aşağı hareketlerle iç yüzeyi temizle', view: 'inner', jaw: 'upper', side: 'right', highlightPos: { top: '20%', right: '15%' } },
    { id: 4, name: 'Üst Ön İç', icon: '⬇️', instruction: '✨ Fırça ucuyla ön iç yüzeyleri nazikçe temizle', view: 'inner', jaw: 'upper', side: 'center', highlightPos: { top: '15%', left: '35%' } },
    { id: 5, name: 'Üst Sol İç', icon: '🔄', instruction: '💪 Harika gidiyorsun! İç yüzeyleri nazikçe temizle', view: 'inner', jaw: 'upper', side: 'left', highlightPos: { top: '20%', left: '15%' } },
    // ALT DIŞ (7-9)
    { id: 6, name: 'Alt Sağ Dış', icon: '↘️', instruction: '⬇️ Alt çeneye geç! Dış yüzeyleri 45° açıyla fırçala', view: 'outer', jaw: 'lower', side: 'right', highlightPos: { top: '48%', right: '10%' } },
    { id: 7, name: 'Alt Ön Dış', icon: '⬇️', instruction: '🦷 Alt ön dişleri aşağıdan yukarıya fırçala!', view: 'outer', jaw: 'lower', side: 'center', highlightPos: { top: '52%', left: '35%' } },
    { id: 8, name: 'Alt Sol Dış', icon: '↙️', instruction: '👈 Sol alt dış yüzeylere devam! Dairesel hareketler', view: 'outer', jaw: 'lower', side: 'left', highlightPos: { top: '48%', left: '10%' } },
    // ALT İÇ (10-12)
    { id: 9, name: 'Alt Sağ İç', icon: '🔄', instruction: '🔄 Alt sağ iç yüzeyleri dikey hareketlerle temizle', view: 'inner', jaw: 'lower', side: 'right', highlightPos: { bottom: '25%', right: '15%' } },
    { id: 10, name: 'Alt Ön İç', icon: '⬆️', instruction: '✨ Alt ön iç yüzeylere odaklan! Fırça ucunu kullan', view: 'inner', jaw: 'lower', side: 'center', highlightPos: { bottom: '20%', left: '35%' } },
    { id: 11, name: 'Alt Sol İç', icon: '🔄', instruction: '🎉 Son bölge! Harika iş çıkardın, biraz daha!', view: 'inner', jaw: 'lower', side: 'left', highlightPos: { bottom: '25%', left: '15%' } },
];

// 🎵 Müzik Hook'u
const useBrushingMusic = () => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const playMusic = async () => {
        try {
            // Yerel müzik dosyası (sonsuz döngü)
            const { sound: newSound } = await Audio.Sound.createAsync(
                require('../../assets/sounds/brushing_music.mp3'),
                { shouldPlay: true, isLooping: true, volume: 0.4 }
            );
            setSound(newSound);
            setIsPlaying(true);
        } catch (error) {
            console.log('Music error:', error);
        }
    };

    const stopMusic = async () => {
        if (sound) {
            try {
                await sound.stopAsync();
                await sound.unloadAsync();
            } catch (e) { }
            setSound(null);
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync().catch(() => { });
            }
        };
    }, [sound]);

    return { playMusic, stopMusic, isPlaying };
};

// 🪥 Animasyonlu Diş Fırçası Komponenti - 12 Bölge Destekli
const AnimatedToothbrush = ({ isActive, zoneIndex }) => {
    const moveAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isActive) {
            Animated.loop(
                Animated.parallel([
                    Animated.sequence([
                        Animated.timing(moveAnim, { toValue: 1, duration: 300, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
                        Animated.timing(moveAnim, { toValue: -1, duration: 300, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
                        Animated.timing(moveAnim, { toValue: 0, duration: 300, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
                    ]),
                    Animated.sequence([
                        Animated.timing(rotateAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
                        Animated.timing(rotateAnim, { toValue: 0, duration: 450, useNativeDriver: true }),
                    ]),
                ])
            ).start();
        }
        return () => {
            moveAnim.stopAnimation();
            rotateAnim.stopAnimation();
        };
    }, [isActive, zoneIndex]);

    const translateY = moveAnim.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [-12, 0, 12],
    });

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['-10deg', '10deg'],
    });

    const zone = BRUSHING_ZONES[zoneIndex];
    if (!isActive || !zone) return null;

    // Her bölge için fırça pozisyonu - Manuel ayar
    const getToothbrushPosition = () => {
        // Bölge bazlı özel pozisyonlar (v4 FINAL)
        const positions = {
            0: { top: '15%', right: -10 },           // Zone 1: ✓
            1: { top: '15%', left: '38%' },          // Zone 2: ✓
            2: { top: '18%', left: 25 },             // Zone 3: +x (v6)
            3: { top: '10%', right: -10 },           // Zone 4: ✓
            4: { top: '10%', left: '40%' },          // Zone 5: ✓
            5: { top: '10%', left: 15 },             // Zone 6: +x (v6)
            6: { top: '42%', right: -10 },           // Zone 7: ✓
            7: { top: '45%', left: '38%' },          // Zone 8: ✓
            8: { top: '40%', left: 15 },             // Zone 9: +x (v6)
            9: { top: '48%', right: -10 },           // Zone 10: ✓
            10: { top: '42%', left: '42%' },         // Zone 11: ✓
            11: { top: '48%', left: '8%' },          // Zone 12: ✓
        };
        return positions[zoneIndex] || { top: '30%', right: 0 };
    };

    // Fırça açısı - bölgeye göre
    const getToothbrushRotation = () => {
        if (zone.side === 'left') return '25deg';
        if (zone.side === 'right') return '-25deg';
        return '0deg';
    };

    const position = getToothbrushPosition();
    const baseRotation = getToothbrushRotation();

    return (
        <Animated.View
            style={[
                styles.toothbrushContainer,
                {
                    ...position,
                    transform: [
                        { translateY },
                        { rotate },
                        { rotate: baseRotation },
                    ],
                }
            ]}
        >
            <Image
                source={ToothbrushImage}
                style={styles.toothbrushImage}
                resizeMode="contain"
            />
        </Animated.View>
    );
};


// ✨ Animasyonlu Bölge Vurgusu (Basitleştirilmiş - merkeze sabit)
const AnimatedHighlight = ({ isActive, zoneIndex }) => {
    const pulseAnim = useRef(new Animated.Value(0.6)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isActive) {
            Animated.loop(
                Animated.parallel([
                    Animated.sequence([
                        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
                        Animated.timing(pulseAnim, { toValue: 0.6, duration: 600, useNativeDriver: true }),
                    ]),
                    Animated.sequence([
                        Animated.timing(scaleAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
                        Animated.timing(scaleAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
                    ]),
                ])
            ).start();
        }
        return () => {
            pulseAnim.stopAnimation();
            scaleAnim.stopAnimation();
        };
    }, [isActive, zoneIndex]);

    if (!isActive) return null;

    const zone = BRUSHING_ZONES[zoneIndex];
    if (!zone) return null;

    // Her bölge için highlight pozisyonu - Manuel ayar
    const getHighlightPosition = () => {
        // Bölge bazlı özel pozisyonlar (kullanıcı geri bildirimine göre)
        const positions = {
            0: { top: '26%', right: '15%' },         // Zone 1: -y (v6)
            1: { top: '25%', left: '38%' },          // Zone 2: Sağa ve alta taşındı
            2: { top: '25%', left: '15%' },          // Zone 3: Hafif aşağı taşındı
            3: { top: '18%', right: '15%' },         // Zone 4: Doğru ✓
            4: { top: '15%', left: '40%' },          // Zone 5: Sağa taşındı
            5: { top: '18%', left: '15%' },          // Zone 6: Değişiklik yok
            6: { top: '48%', right: '15%' },         // Zone 7: Üste taşındı
            7: { top: '50%', left: '40%' },          // Zone 8: Sağa taşındı
            8: { top: '48%', left: '15%' },          // Zone 9: Hafif üste taşındı
            9: { top: '52%', right: '15%' },         // Zone 10: Yukarı taşındı
            10: { top: '48%', left: '40%' },         // Zone 11: Yukarı ve sağa taşındı
            11: { top: '52%', left: '15%' },         // Zone 12: Hafif yukarı taşındı
        };
        return positions[zoneIndex] || { top: '30%', left: '30%' };
    };

    const position = getHighlightPosition();

    return (
        <Animated.View
            style={[
                styles.highlightContainer,
                {
                    ...position,
                    opacity: pulseAnim,
                    transform: [{ scale: scaleAnim }],
                }
            ]}
        >
            <Image
                source={HighlightZoneImage}
                style={styles.highlightImage}
                resizeMode="contain"
            />
        </Animated.View>
    );
};

// 🦷 Ana Diş Görselleştirme Komponenti
const TeethVisualization = ({ activeZone, completedZones, isRunning }) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const zone = BRUSHING_ZONES[activeZone];
    const isInnerView = zone?.view === 'inner';

    // Görünüm geçiş animasyonu
    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 0.5, duration: 150, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
        ]).start();
    }, [isInnerView]);

    return (
        <View style={styles.teethContainer}>
            {/* Glow Effect */}
            {isRunning && (
                <View style={styles.teethGlow} />
            )}

            {/* Diş Görseli */}
            <Animated.View style={[styles.teethImageWrapper, { opacity: fadeAnim }]}>
                <Image
                    source={isInnerView ? TeethInnerImage : TeethOuterImage}
                    style={styles.teethImage}
                    resizeMode="contain"
                />

                {/* Aktif Bölge Vurgusu */}
                <AnimatedHighlight
                    isActive={isRunning}
                    zoneIndex={activeZone}
                />
            </Animated.View>

            {/* Animasyonlu Fırça */}
            <AnimatedToothbrush
                isActive={isRunning}
                zoneIndex={activeZone}
            />
        </View>
    );
};

// 📊 Bölge İlerleme Göstergesi (2 Satır: 6+6)
const ZoneProgressBar = ({ zones, activeZone, completedZones }) => {
    const firstRow = zones.slice(0, 6);
    const secondRow = zones.slice(6, 12);

    const renderRow = (rowZones, startIdx) => (
        <View style={styles.progressRow}>
            {rowZones.map((zone, idx) => {
                const realIdx = startIdx + idx;
                return (
                    <View key={zone.id} style={styles.progressItem}>
                        <View style={[
                            styles.progressDot,
                            completedZones.includes(realIdx) && styles.progressDotComplete,
                            realIdx === activeZone && styles.progressDotActive,
                        ]}>
                            {completedZones.includes(realIdx) ? (
                                <Text style={styles.progressCheck}>✓</Text>
                            ) : (
                                <Text style={styles.progressNumber}>{realIdx + 1}</Text>
                            )}
                        </View>
                        {idx < rowZones.length - 1 && (
                            <View style={[
                                styles.progressLine,
                                completedZones.includes(realIdx) && styles.progressLineComplete,
                            ]} />
                        )}
                    </View>
                );
            })}
        </View>
    );

    return (
        <View style={styles.progressBar}>
            {renderRow(firstRow, 0)}
            {renderRow(secondRow, 6)}
        </View>
    );
};

// 🎯 Ana Komponent
const BrushingScreen = () => {
    const navigation = useNavigation();
    const { completeBrushing } = useGame();
    const { playMusic, stopMusic, isPlaying } = useBrushingMusic();

    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
    const [activeZone, setActiveZone] = useState(0);
    const [completedZones, setCompletedZones] = useState([]);
    const [zoneTimeRemaining, setZoneTimeRemaining] = useState(ZONE_DURATION);
    const [showComplete, setShowComplete] = useState(false);
    const [earnedPoints, setEarnedPoints] = useState(0);
    const [musicEnabled, setMusicEnabled] = useState(true);

    const timerRef = useRef(null);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const celebrationAnim = useRef(new Animated.Value(0)).current;

    // Timer Logic
    useEffect(() => {
        if (isRunning && !isPaused && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    const newTime = prev - 1;
                    const elapsedTime = TIMER_DURATION - newTime;
                    const newZone = Math.min(Math.floor(elapsedTime / ZONE_DURATION), 11);
                    const zoneElapsed = elapsedTime % ZONE_DURATION;

                    setZoneTimeRemaining(ZONE_DURATION - zoneElapsed);

                    if (newZone !== activeZone && newZone < 12) {
                        setCompletedZones(prev => [...prev, activeZone]);
                        setActiveZone(newZone);
                        SoundService.vibrate('medium');
                    }

                    const progress = elapsedTime / TIMER_DURATION;
                    Animated.timing(progressAnim, { toValue: progress, duration: 500, useNativeDriver: false }).start();

                    if (newTime === 0) {
                        clearInterval(timerRef.current);
                        setCompletedZones(prev => [...prev, 11]);
                        handleComplete();
                    }

                    return newTime;
                });
            }, 1000);
        }

        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isRunning, isPaused, activeZone]);

    const handleComplete = useCallback(async () => {
        stopMusic();
        const result = await completeBrushing(TIMER_DURATION);
        setEarnedPoints(result?.points || 75);
        setShowComplete(true);
        Animated.spring(celebrationAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
        SoundService.playComplete();
    }, [completeBrushing, stopMusic]);

    const startTimer = async () => {
        setIsRunning(true);
        setIsPaused(false);
        if (musicEnabled) {
            await playMusic();
        }
    };

    const pauseTimer = async () => {
        setIsPaused(true);
        if (timerRef.current) clearInterval(timerRef.current);
        await stopMusic();
    };

    const resumeTimer = async () => {
        setIsPaused(false);
        if (musicEnabled) {
            await playMusic();
        }
    };

    const cancelTimer = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        await stopMusic();
        navigation.goBack();
    };

    const toggleMusic = async () => {
        if (musicEnabled && isPlaying) {
            await stopMusic();
        }
        setMusicEnabled(!musicEnabled);
    };

    const zone = BRUSHING_ZONES[activeZone];

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0077B6', '#00B4D8', '#48CAE4']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={cancelTimer} style={styles.backBtn}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Premium Fırçalama</Text>
                    <View style={styles.headerRight}>
                        <TouchableOpacity onPress={toggleMusic} style={styles.musicBtn}>
                            <Text style={styles.musicIcon}>{musicEnabled ? '🎵' : '🔇'}</Text>
                        </TouchableOpacity>
                        <View style={styles.timerBadge}>
                            <Text style={styles.timerBadgeText}>{formatDuration(timeRemaining)}</Text>
                        </View>
                    </View>
                </View>

                {/* Ana İçerik */}
                <View style={styles.mainContent}>
                    {/* Bölge Bilgisi */}
                    {isRunning && (
                        <View style={styles.zoneInfo}>
                            <View style={[styles.viewModeTag, zone?.view === 'inner' && styles.viewModeTagInner]}>
                                <Text style={styles.viewModeText}>{zone?.view === 'inner' ? 'İÇ' : 'DIŞ'}</Text>
                            </View>
                            <Text style={styles.zoneIcon}>{zone?.icon}</Text>
                            <Text style={styles.zoneName}>{zone?.name}</Text>
                            <View style={styles.zoneTimerPill}>
                                <Text style={styles.zoneTimerText}>{zoneTimeRemaining}s</Text>
                            </View>
                        </View>
                    )}

                    {/* Talimat */}
                    {isRunning && (
                        <View style={styles.instructionBox}>
                            <Text style={styles.instructionText}>{zone?.instruction}</Text>
                        </View>
                    )}

                    {/* Diş Görselleştirmesi */}
                    <View style={styles.teethWrapper}>
                        <TeethVisualization
                            activeZone={activeZone}
                            completedZones={completedZones}
                            isRunning={isRunning && !isPaused}
                        />
                    </View>

                    {/* İlerleme Çubuğu */}
                    {isRunning && (
                        <ZoneProgressBar
                            zones={BRUSHING_ZONES}
                            activeZone={activeZone}
                            completedZones={completedZones}
                        />
                    )}

                    {/* Başlangıç Metni */}
                    {!isRunning && (
                        <View style={styles.startInfo}>
                            <Text style={styles.startInfoTitle}>🦷 Premium Fırçalama Rehberi</Text>
                            <Text style={styles.startInfoText}>12 bölgede detaylı animasyonlu rehberlik. Her bölge 10 saniye!</Text>
                            <View style={styles.featureRow}>
                                <View style={styles.featureItem}>
                                    <Text style={styles.featureIcon}>🎵</Text>
                                    <Text style={styles.featureText}>Müzik</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Text style={styles.featureIcon}>🔄</Text>
                                    <Text style={styles.featureText}>İç/Dış</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Text style={styles.featureIcon}>🪥</Text>
                                    <Text style={styles.featureText}>Animasyon</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                {/* Kontroller */}
                <View style={styles.controls}>
                    {!isRunning ? (
                        <TouchableOpacity style={styles.startBtn} onPress={startTimer} activeOpacity={0.9}>
                            <LinearGradient
                                colors={['#FFB703', '#FB8500']}
                                style={styles.startBtnGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.startBtnIcon}>▶</Text>
                                <Text style={styles.startBtnText}>BAŞLA</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.controlBtn, isPaused && styles.controlBtnResume]}
                            onPress={isPaused ? resumeTimer : pauseTimer}
                        >
                            <Text style={styles.controlBtnIcon}>{isPaused ? '▶' : '⏸'}</Text>
                            <Text style={styles.controlBtnText}>{isPaused ? 'Devam' : 'Duraklat'}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Tamamlama Modalı */}
                <Modal visible={showComplete} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <Animated.View style={[styles.completeCard, { transform: [{ scale: celebrationAnim }] }]}>
                            <View style={styles.completeIconBg}>
                                <Text style={styles.completeIconEmoji}>🏆</Text>
                            </View>
                            <Text style={styles.completeTitle}>Mükemmel!</Text>
                            <Text style={styles.completeSubtitle}>Tüm bölgeleri tamamladın!</Text>

                            <View style={styles.statsRow}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>12/12</Text>
                                    <Text style={styles.statLabel}>Bölge</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>2:00</Text>
                                    <Text style={styles.statLabel}>Süre</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>+{earnedPoints}</Text>
                                    <Text style={styles.statLabel}>Puan</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.doneBtn}
                                onPress={() => { setShowComplete(false); navigation.goBack(); }}
                            >
                                <Text style={styles.doneBtnText}>Harika!</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </Modal>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    backIcon: { fontSize: 22, color: '#FFF', fontWeight: '300' },
    headerTitle: { fontSize: 17, fontWeight: '700', color: '#FFF' },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    musicBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    musicIcon: { fontSize: 18 },
    timerBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    timerBadgeText: { fontSize: 15, fontWeight: '700', color: '#FFF' },

    // Main Content
    mainContent: { flex: 1, alignItems: 'center', paddingHorizontal: 16 },

    // Zone Info
    zoneInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        gap: 8,
        marginBottom: 8,
    },
    viewModeTag: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    viewModeTagInner: { backgroundColor: '#FF9800' },
    viewModeText: { fontSize: 10, fontWeight: '800', color: '#FFF' },
    zoneIcon: { fontSize: 20 },
    zoneName: { fontSize: 16, fontWeight: '700', color: '#FFF', flex: 1 },
    zoneTimerPill: {
        backgroundColor: '#FFB703',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10
    },
    zoneTimerText: { fontSize: 13, fontWeight: '700', color: '#FFF' },

    // Instruction
    instructionBox: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        marginBottom: 10,
    },
    instructionText: { fontSize: 13, color: '#FFF', textAlign: 'center', fontWeight: '500' },

    // Teeth
    teethWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    teethContainer: {
        width: width * 0.85,
        height: height * 0.45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    teethGlow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    teethImageWrapper: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    teethImage: {
        width: '100%',
        height: '100%',
    },

    // Toothbrush
    toothbrushContainer: {
        position: 'absolute',
        zIndex: 10,
    },
    toothbrushImage: {
        width: 80,
        height: 200,
    },

    // Highlight
    highlightContainer: {
        position: 'absolute',
        width: 80,
        height: 80,
    },
    highlightImage: {
        width: '100%',
        height: '100%',
    },

    // Completed marks
    completedMark: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    completedCheckmark: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: '700',
    },

    // Progress Bar (2 rows)
    progressBar: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        gap: 6,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressItem: { flexDirection: 'row', alignItems: 'center' },
    progressDot: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    progressDotComplete: { backgroundColor: '#4CAF50' },
    progressDotActive: { backgroundColor: '#FFB703', transform: [{ scale: 1.15 }] },
    progressCheck: { fontSize: 10, color: '#FFF', fontWeight: '700' },
    progressNumber: { fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
    progressLine: { width: 8, height: 2, backgroundColor: 'rgba(255,255,255,0.25)', marginHorizontal: 2 },
    progressLineComplete: { backgroundColor: '#4CAF50' },

    // Start Info
    startInfo: { alignItems: 'center', paddingHorizontal: 20, marginTop: 15 },
    startInfoTitle: { fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 8, textAlign: 'center' },
    startInfoText: { fontSize: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 20, marginBottom: 15 },
    featureRow: { flexDirection: 'row', gap: 25 },
    featureItem: { alignItems: 'center' },
    featureIcon: { fontSize: 24, marginBottom: 4 },
    featureText: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },

    // Controls
    controls: { paddingHorizontal: 30, paddingBottom: 30 },
    startBtn: {
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: '#FB8500',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8
    },
    startBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10
    },
    startBtnIcon: { fontSize: 18, color: '#FFF' },
    startBtnText: { fontSize: 18, fontWeight: '800', color: '#FFF', letterSpacing: 2 },
    controlBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 35,
        paddingVertical: 14,
        borderRadius: 28,
        gap: 8
    },
    controlBtnResume: { backgroundColor: '#4CAF50' },
    controlBtnIcon: { fontSize: 16, color: '#FFF' },
    controlBtnText: { fontSize: 15, fontWeight: '700', color: '#FFF' },

    // Complete Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center' },
    completeCard: {
        backgroundColor: '#FFF',
        borderRadius: 28,
        padding: 30,
        alignItems: 'center',
        width: width * 0.85,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.25,
        shadowRadius: 25,
        elevation: 20
    },
    completeIconBg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFB703',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    completeIconEmoji: { fontSize: 40 },
    completeTitle: { fontSize: 28, fontWeight: '800', color: '#1E3A5F', marginBottom: 6 },
    completeSubtitle: { fontSize: 15, color: '#64748B', marginBottom: 20 },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        paddingVertical: 16,
        marginBottom: 20,
    },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 22, fontWeight: '800', color: '#0077B6' },
    statLabel: { fontSize: 11, color: '#64748B', marginTop: 3 },
    doneBtn: { backgroundColor: '#0077B6', paddingHorizontal: 50, paddingVertical: 14, borderRadius: 25 },
    doneBtnText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
});

export default BrushingScreen;
