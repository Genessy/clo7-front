import { ClothingItem } from '@/constants/mock-data';
import { WeatherData } from './weather';

const USE_MOCK = true;

export interface OutfitResult {
  top: ClothingItem | null;
  outerwear: ClothingItem | null;
  bottom: ClothingItem | null;
  shoes: ClothingItem | null;
  weatherTip: string;
}

function pickByCategory(wardrobe: ClothingItem[], category: ClothingItem['category'], season?: string): ClothingItem | null {
  const matches = wardrobe.filter(
    (item) => item.category === category && (!season || item.season === season || item.season === 'all')
  );
  if (matches.length === 0) {
    const fallback = wardrobe.filter((item) => item.category === category);
    return fallback[Math.floor(Math.random() * fallback.length)] ?? null;
  }
  return matches[Math.floor(Math.random() * matches.length)];
}

function getSeason(temp: number): ClothingItem['season'] {
  if (temp >= 25) return 'summer';
  if (temp >= 15) return 'spring';
  if (temp >= 5) return 'autumn';
  return 'winter';
}

function generateMockOutfit(weather: WeatherData, wardrobe: ClothingItem[]): OutfitResult {
  const season = getSeason(weather.temperature);
  const needsOuterwear = weather.temperature < 18 || weather.conditionCode >= 61;

  return {
    top: pickByCategory(wardrobe, 'top', season),
    outerwear: needsOuterwear ? pickByCategory(wardrobe, 'outerwear', season) : null,
    bottom: pickByCategory(wardrobe, 'bottom', season),
    shoes: pickByCategory(wardrobe, 'shoes', season),
    weatherTip: weather.tip,
  };
}

export async function generateOutfit(
  weather: WeatherData,
  wardrobe: ClothingItem[]
): Promise<OutfitResult> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return generateMockOutfit(weather, wardrobe);
  }

  const res = await fetch('https://api.clo7.app/outfit/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weather, wardrobe }),
  });
  if (!res.ok) throw new Error('Backend error');
  return res.json();
}
