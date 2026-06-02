import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function SplashScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>
          <Text style={styles.logoBlack}>CLO</Text>
          <Text style={styles.logoGreen}>7</Text>
        </Text>
        <Text style={styles.headline}>Your wardrobe,{'\n'}intelligently styled.</Text>
        <Text style={styles.sub}>
          Generate outfits based on your wardrobe{'\n'}and today's weather.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPrimaryPressed]}
          onPress={() => router.push('/signup')}
        >
          <Text style={styles.btnPrimaryText}>Sign up</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.btnSecondary, pressed && styles.btnSecondaryPressed]}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.btnSecondaryText}>Log in</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 48,
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 16,
  },
  logo: {
    fontSize: 48,
    letterSpacing: -1,
    marginBottom: 8,
  },
  logoBlack: {
    fontFamily: 'Manrope_600SemiBold',
    color: Colors.text,
  },
  logoGreen: {
    fontFamily: 'Manrope_600SemiBold',
    color: Colors.primary,
  },
  headline: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 28,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 36,
  },
  sub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnPrimaryPressed: {
    backgroundColor: Colors.primaryHover,
  },
  btnPrimaryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  btnSecondary: {
    backgroundColor: Colors.surface,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnSecondaryPressed: {
    backgroundColor: '#F5F3F0',
  },
  btnSecondaryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.text,
  },
});
