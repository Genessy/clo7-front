import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { Manrope_600SemiBold } from '@expo-google-fonts/manrope';
import { Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { type User } from 'firebase/auth';
import { subscribeToAuthState } from '@/services/auth';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_600SemiBold,
    Inter_400Regular,
    Inter_600SemiBold,
  });
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    return subscribeToAuthState(setUser);
  }, []);

  useEffect(() => {
    if (!fontsLoaded || user === undefined) return;
    SplashScreen.hideAsync();

    const inTabs = segments[0] === '(tabs)';
    if (user && !inTabs) {
      router.replace('/(tabs)/home');
    } else if (!user && inTabs) {
      router.replace('/splash');
    }
  }, [fontsLoaded, user, segments]);

  if (!fontsLoaded || user === undefined) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="splash" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="add-photo" />
        <Stack.Screen name="add-details" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
