import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { getWeather, WeatherData } from '@/services/weather';
import { generateOutfit, OutfitResult } from '@/services/outfit';
import { MOCK_WARDROBE, ClothingItem } from '@/constants/mock-data';

function WeatherCard({ weather }: { weather: WeatherData }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.weatherIcon}>☀️</Text>
        <Text style={styles.city}>{weather.city}</Text>
      </View>
      <Text style={styles.temp}>{weather.temperature}°C</Text>
      <Text style={styles.condition}>{weather.condition}</Text>
      <View style={styles.tipBox}>
        <Text style={styles.tipText}>{weather.tip}</Text>
      </View>
    </View>
  );
}

function OutfitCard({ label, item }: { label: string; item: ClothingItem | null }) {
  if (!item) return null;
  return (
    <View style={styles.outfitItem}>
      <View style={styles.outfitThumb} />
      <View>
        <Text style={styles.outfitLabel}>{label}</Text>
        <Text style={styles.outfitName}>{item.name}</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [outfit, setOutfit] = useState<OutfitResult | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingOutfit, setLoadingOutfit] = useState(false);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    loadWeather();
  }, []);

  async function loadWeather() {
    try {
      setLoadingWeather(true);
      setWeatherError(false);
      const data = await getWeather();
      setWeather(data);
    } catch {
      setWeatherError(true);
    } finally {
      setLoadingWeather(false);
    }
  }

  async function handleGenerate() {
    if (!weather) return;
    setLoadingOutfit(true);
    try {
      const result = await generateOutfit(weather, MOCK_WARDROBE);
      setOutfit(result);
    } finally {
      setLoadingOutfit(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.logo}>
          <Text style={styles.logoBlack}>CLO</Text>
          <Text style={styles.logoGreen}>7</Text>
        </Text>

        {loadingWeather ? (
          <View style={[styles.card, styles.cardCenter]}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.loadingText}>Getting your weather…</Text>
          </View>
        ) : weatherError ? (
          <View style={[styles.card, styles.cardCenter]}>
            <Text style={styles.errorText}>Could not load weather.</Text>
            <Pressable onPress={loadWeather}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : weather ? (
          <WeatherCard weather={weather} />
        ) : null}

        {outfit && (
          <View style={styles.outfitSection}>
            <Text style={styles.sectionTitle}>Today's Outfit</Text>
            <View style={styles.outfitList}>
              <OutfitCard label="Top" item={outfit.top} />
              <OutfitCard label="Outerwear" item={outfit.outerwear} />
              <OutfitCard label="Bottom" item={outfit.bottom} />
              <OutfitCard label="Shoes" item={outfit.shoes} />
            </View>

            <View style={styles.outfitActions}>
              <Pressable
                style={({ pressed }) => [styles.btnSave, pressed && styles.btnSavePressed]}
              >
                <Text style={styles.btnSaveText}>♡ Save Outfit</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.btnRegenerate, pressed && styles.btnRegeneratePressed]}
                onPress={handleGenerate}
                disabled={loadingOutfit}
              >
                {loadingOutfit ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.btnRegenerateText}>↺ Regenerate</Text>
                )}
              </Pressable>
            </View>

            <Pressable style={styles.viewSaved}>
              <Text style={styles.viewSavedText}>View Saved Outfits</Text>
            </Pressable>
          </View>
        )}

        {!outfit && !loadingWeather && (
          <Pressable
            style={({ pressed }) => [
              styles.btnGenerate,
              pressed && styles.btnGeneratePressed,
              loadingOutfit && styles.btnGenerateLoading,
            ]}
            onPress={handleGenerate}
            disabled={loadingOutfit || !weather}
          >
            {loadingOutfit ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.btnGenerateText}>✦ Generate Outfit</Text>
            )}
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 20,
  },
  logo: {
    fontSize: 24,
    letterSpacing: -0.5,
  },
  logoBlack: {
    fontFamily: 'Manrope_600SemiBold',
    color: Colors.text,
  },
  logoGreen: {
    fontFamily: 'Manrope_600SemiBold',
    color: Colors.primary,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardCenter: {
    alignItems: 'center',
    gap: 8,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  weatherIcon: {
    fontSize: 16,
  },
  city: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textMuted,
  },
  temp: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 40,
    color: Colors.text,
    lineHeight: 48,
  },
  condition: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textMuted,
  },
  tipBox: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
  },
  tipText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.text,
    lineHeight: 20,
  },
  loadingText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textMuted,
  },
  errorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.text,
  },
  retryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.primary,
  },
  btnGenerate: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  btnGeneratePressed: {
    backgroundColor: Colors.primaryHover,
  },
  btnGenerateLoading: {
    opacity: 0.8,
  },
  btnGenerateText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  outfitSection: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 22,
    color: Colors.text,
  },
  outfitList: {
    gap: 10,
  },
  outfitItem: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  outfitThumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.border,
  },
  outfitLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  outfitName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.text,
  },
  outfitActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  btnSave: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  btnSavePressed: {
    backgroundColor: '#F5F3F0',
  },
  btnSaveText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
  },
  btnRegenerate: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  btnRegeneratePressed: {
    backgroundColor: Colors.primaryHover,
  },
  btnRegenerateText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  viewSaved: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  viewSavedText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
  },
});
