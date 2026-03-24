// =====================================================
// 🦷 DİŞ KAHRAMANI - WEEKLY CHART COMPONENT
// Haftalık fırçalama grafiği
// =====================================================

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { COLORS } from '../../utils/constants';

const DAYS_TR = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const WeeklyChart = ({ weekData = [] }) => {
    // Generate last 7 days data
    const generateWeekData = () => {
        const today = new Date();
        const days = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dayIndex = (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
            const dateStr = date.toISOString().split('T')[0];

            // Find matching data
            const dayData = weekData.find(d => d.date === dateStr) || {
                morning: false,
                evening: false,
            };

            days.push({
                day: DAYS_TR[dayIndex],
                date: dateStr,
                isToday: i === 0,
                morning: dayData.morning,
                evening: dayData.evening,
            });
        }

        return days;
    };

    const days = generateWeekData();

    // Calculate success percentage
    const totalPossible = days.length * 2; // morning + evening
    const completed = days.reduce((sum, day) => {
        return sum + (day.morning ? 1 : 0) + (day.evening ? 1 : 0);
    }, 0);
    const percentage = Math.round((completed / totalPossible) * 100);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>📅 Bu Hafta</Text>
                <View style={styles.percentageBadge}>
                    <Text style={styles.percentageText}>%{percentage}</Text>
                </View>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <Text style={styles.legendIcon}>🌅</Text>
                    <Text style={styles.legendText}>Sabah</Text>
                </View>
                <View style={styles.legendItem}>
                    <Text style={styles.legendIcon}>🌙</Text>
                    <Text style={styles.legendText}>Akşam</Text>
                </View>
            </View>

            {/* Chart */}
            <View style={styles.chart}>
                {days.map((day, index) => (
                    <View
                        key={day.date}
                        style={[
                            styles.dayColumn,
                            day.isToday && styles.todayColumn,
                        ]}
                    >
                        {/* Day name */}
                        <Text style={[
                            styles.dayText,
                            day.isToday && styles.todayText,
                        ]}>
                            {day.day}
                        </Text>

                        {/* Morning indicator */}
                        <View style={[
                            styles.indicator,
                            day.morning && styles.indicatorComplete,
                        ]}>
                            <Text style={styles.indicatorEmoji}>
                                {day.morning ? '✅' : '⭕'}
                            </Text>
                        </View>

                        {/* Evening indicator */}
                        <View style={[
                            styles.indicator,
                            day.evening && styles.indicatorComplete,
                        ]}>
                            <Text style={styles.indicatorEmoji}>
                                {day.evening ? '✅' : '⭕'}
                            </Text>
                        </View>

                        {/* Today marker */}
                        {day.isToday && (
                            <View style={styles.todayMarker}>
                                <Text style={styles.todayMarkerText}>Bugün</Text>
                            </View>
                        )}
                    </View>
                ))}
            </View>

            {/* Summary */}
            <View style={styles.summary}>
                <Text style={styles.summaryText}>
                    {percentage >= 80
                        ? '🌟 Harika gidiyorsun!'
                        : percentage >= 50
                            ? '💪 Daha iyisini yapabilirsin!'
                            : '🦷 Dişlerini daha sık fırçala!'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    percentageBadge: {
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    percentageText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 15,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    legendIcon: {
        fontSize: 14,
    },
    legendText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    chart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayColumn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 10,
    },
    todayColumn: {
        backgroundColor: COLORS.primaryLight,
    },
    dayText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    todayText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    indicator: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 3,
    },
    indicatorComplete: {
        backgroundColor: COLORS.toothHealthy,
    },
    indicatorEmoji: {
        fontSize: 16,
    },
    todayMarker: {
        marginTop: 5,
    },
    todayMarkerText: {
        fontSize: 9,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    summary: {
        marginTop: 15,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.primaryLight,
        alignItems: 'center',
    },
    summaryText: {
        fontSize: 14,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
});

export default WeeklyChart;
