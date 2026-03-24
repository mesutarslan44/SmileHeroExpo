// =====================================================
// 🦷 DİŞ KAHRAMANI - APP NAVIGATOR
// Tab ve Stack Navigation yapılandırması
// =====================================================

import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Screens
import HomeScreen from '../screens/HomeScreen';
import BrushingScreen from '../screens/BrushingScreen';
import GameScreen from '../screens/GameScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TipsScreen from '../screens/TipsScreen';
import ParentPanelScreen from '../screens/ParentPanelScreen';

// Mini Games
import BacteriaGame from '../components/game/BacteriaGame';
import DefenseGame from '../components/game/DefenseGame';
import MemoryGame from '../components/game/MemoryGame';

import { COLORS, SCREEN_NAMES } from '../utils/constants';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();

// Tab Bar Icon Component
const TabIcon = ({ icon, label, focused }) => (
    <View style={styles.tabIconContainer}>
        <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
            {icon}
        </Text>
        <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
            {label}
        </Text>
    </View>
);

// Main Tab Navigator
const TabNavigator = () => {
    const insets = useSafeAreaInsets();
    const tabBarBottom = Math.max(insets.bottom, 10) + 10;

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    ...styles.tabBar,
                    bottom: tabBarBottom,
                },
                tabBarShowLabel: false,
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tab.Screen
                name={SCREEN_NAMES.HOME}
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="🏠" label="Ana Sayfa" focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name={SCREEN_NAMES.GAMES}
                component={GameScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="🎮" label="Oyunlar" focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name={SCREEN_NAMES.PROGRESS}
                component={ProgressScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="📊" label="İlerleme" focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name={SCREEN_NAMES.SETTINGS}
                component={SettingsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="⚙️" label="Ayarlar" focused={focused} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

// Root App Navigator (Games are outside tabs - no tab bar!)
const AppNavigator = () => {
    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                {/* Main Tabs */}
                <RootStack.Screen name="MainTabs" component={TabNavigator} />

                {/* Brushing Screen - Modal */}
                <RootStack.Screen
                    name={SCREEN_NAMES.BRUSHING}
                    component={BrushingScreen}
                    options={{ presentation: 'fullScreenModal' }}
                />

                {/* Mini Games - Full Screen (NO TAB BAR) */}
                <RootStack.Screen
                    name={SCREEN_NAMES.BACTERIA_GAME}
                    component={BacteriaGame}
                    options={{ presentation: 'fullScreenModal' }}
                />
                <RootStack.Screen
                    name={SCREEN_NAMES.DEFENSE_GAME}
                    component={DefenseGame}
                    options={{ presentation: 'fullScreenModal' }}
                />
                <RootStack.Screen
                    name={SCREEN_NAMES.MEMORY_GAME}
                    component={MemoryGame}
                    options={{ presentation: 'fullScreenModal' }}
                />

                {/* Other Modals */}
                <RootStack.Screen
                    name={SCREEN_NAMES.TIPS}
                    component={TipsScreen}
                    options={{ presentation: 'card' }}
                />
                <RootStack.Screen
                    name={SCREEN_NAMES.PARENT_PANEL}
                    component={ParentPanelScreen}
                    options={{ presentation: 'modal' }}
                />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        left: 16,
        right: 16,
        height: 75,
        backgroundColor: COLORS.surface,
        borderRadius: 40,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 12,
        borderTopWidth: 0,
        paddingHorizontal: 8,
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 8,
        minWidth: 60,
    },
    tabIcon: {
        fontSize: 28,
        opacity: 0.4,
    },
    tabIconFocused: {
        opacity: 1,
        transform: [{ scale: 1.15 }],
    },
    tabLabel: {
        fontSize: 11,
        marginTop: 5,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    tabLabelFocused: {
        color: COLORS.primary,
        fontWeight: '800',
    },
});

export default AppNavigator;
