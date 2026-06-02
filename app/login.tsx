import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) return;
    setLoading(true);
    await AsyncStorage.setItem('user', JSON.stringify({ email }));
    setLoading(false);
    router.replace('/(tabs)/home');
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>

        <Text style={styles.logo}>
          <Text style={styles.logoBlack}>CLO</Text>
          <Text style={styles.logoGreen}>7</Text>
        </Text>
        <Text style={styles.title}>Welcome back</Text>

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          <View>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.btnPrimary,
            pressed && styles.btnPrimaryPressed,
            (!email || !password) && styles.btnDisabled,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.btnPrimaryText}>
            {loading ? 'Logging in…' : 'Log in'}
          </Text>
        </Pressable>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable style={({ pressed }) => [styles.btnSocial, pressed && styles.btnSocialPressed]}>
          <Text style={styles.btnSocialText}>Continue with Google</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.btnSocial, pressed && styles.btnSocialPressed]}>
          <Text style={styles.btnSocialText}>Continue with Apple</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/signup')}>
          <Text style={styles.switchText}>
            Don't have an account? <Text style={styles.switchLink}>Sign up</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
    gap: 16,
  },
  back: {
    marginBottom: 8,
  },
  backIcon: {
    fontSize: 22,
    color: Colors.text,
  },
  logo: {
    fontSize: 28,
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
  title: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 24,
    color: Colors.text,
    marginBottom: 8,
  },
  form: {
    gap: 16,
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.text,
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnPrimaryPressed: {
    backgroundColor: Colors.primaryHover,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnPrimaryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
  },
  btnSocial: {
    backgroundColor: Colors.surface,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnSocialPressed: {
    backgroundColor: '#F5F3F0',
  },
  btnSocialText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.text,
  },
  switchText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  switchLink: {
    color: Colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
});
