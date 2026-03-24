// =====================================================
// 🦷 DİŞ KAHRAMANI - EXPO APP
// Ana uygulama giriş noktası
// =====================================================

import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GameProvider } from './src/contexts/GameContext';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <GameProvider>
          <AppNavigator />
        </GameProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
