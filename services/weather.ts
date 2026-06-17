import * as Location from 'expo-location';

export interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  condition: string;
  conditionCode: number;
  city: string;
  tip: string;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
  uvIndex: number;
}

const WMO_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Foggy',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  80: 'Light showers',
  81: 'Showers',
  82: 'Heavy showers',
  95: 'Thunderstorm',
  99: 'Thunderstorm with hail',
};

function getTip(temp: number, code: number, precipProb: number, windSpeed: number): string {
  if (code === 95 || code === 99) return 'Storm incoming — stay indoors if possible.';
  if (code >= 71 && code <= 75) return 'Snow likely — dress warmly and wear boots.';
  if (code >= 61 && code <= 82) return 'Rain expected — grab a waterproof jacket.';
  if (precipProb >= 50) return 'High chance of rain — bring an umbrella.';
  if (windSpeed >= 40) return 'Very windy — avoid loose clothing.';
  if (temp >= 28) return 'Hot day ahead — light, breathable fabrics recommended.';
  if (temp >= 20) return 'Warm and pleasant — a light outfit works great.';
  if (temp >= 12) return 'Cool morning, light layers recommended.';
  if (temp >= 5) return 'Cold outside — wear a coat and layer up.';
  return 'Very cold — heavy coat, scarf, and gloves essential.';
}

async function getCityName(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { 'Accept-Language': 'en', 'User-Agent': 'CLO7App/1.0' } }
    );
    const data = await res.json();
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.municipality ||
      'Unknown'
    );
  } catch {
    return 'Unknown';
  }
}

function getCurrentHourIndex(times: string[]): number {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const currentHour = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:00`;
  const index = times.indexOf(currentHour);
  return index >= 0 ? index : 0;
}

export async function getWeather(): Promise<WeatherData> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') throw new Error('Location permission denied');

  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  const [weatherRes, city] = await Promise.all([
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,weathercode` +
      `&hourly=apparent_temperature,precipitation,precipitation_probability,wind_speed_180m,uv_index` +
      `&timezone=auto&forecast_days=1`
    ),
    getCityName(latitude, longitude),
  ]);

  const data = await weatherRes.json();
  const temperature = Math.round(data.current.temperature_2m);
  const conditionCode = data.current.weathercode;
  const condition = WMO_CODES[conditionCode] ?? 'Unknown';

  const i = getCurrentHourIndex(data.hourly.time);
  const apparentTemperature = Math.round(data.hourly.apparent_temperature[i]);
  const precipitation = data.hourly.precipitation[i];
  const precipitationProbability = data.hourly.precipitation_probability[i];
  const windSpeed = Math.round(data.hourly.wind_speed_180m[i]);
  const uvIndex = data.hourly.uv_index[i];

  const result = {
    temperature,
    apparentTemperature,
    condition,
    conditionCode,
    city,
    tip: getTip(temperature, conditionCode, precipitationProbability, windSpeed),
    precipitation,
    precipitationProbability,
    windSpeed,
    uvIndex,
  };
  console.log('[Weather]', JSON.stringify(result, null, 2));
  return result;
}
