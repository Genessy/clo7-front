import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { logout } from '@/services/auth';
import { auth } from '@/services/firebase';

type Theme = 'light' | 'dark' | 'system';

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function Row({ label, value, onPress, last }: { label: string; value?: string; onPress?: () => void; last?: boolean }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, !last && styles.rowBorder, pressed && onPress && styles.rowPressed]}
      onPress={onPress}
    >
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        {value && <Text style={styles.rowValue}>{value}</Text>}
      </View>
      {onPress && <Text style={styles.rowChevron}>›</Text>}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const [theme, setTheme] = useState<Theme>('system');
  const user = auth.currentUser;

  function handleLogout() {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>

        <Section label="ACCOUNT">
          <Row label="Name" value={user?.displayName || '—'} onPress={() => {}} />
          <Row label="Email" value={user?.email || '—'} onPress={() => {}} />
          <Row label="Edit Profile" onPress={() => {}} last />
        </Section>

        <Section label="APPEARANCE">
          <View style={styles.themeRow}>
            <Text style={styles.rowLabel}>Theme</Text>
            <View style={styles.themePicker}>
              {(['light', 'dark', 'system'] as Theme[]).map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setTheme(t)}
                  style={[styles.themeBtn, theme === t && styles.themeBtnActive]}
                >
                  <Text style={styles.themeIcon}>
                    {t === 'light' ? '☀' : t === 'dark' ? '☽' : '⊡'}
                  </Text>
                  <Text style={[styles.themeBtnText, theme === t && styles.themeBtnTextActive]}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Section>

        <Section label="PREFERENCES">
          <Row label="Language" value="Auto-detected from device" last />
        </Section>

        <Section label="SECURITY">
          <Row label="Change Password" onPress={() => {}} last />
        </Section>

        <Section label="SESSION">
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>↪ Logout</Text>
          </Pressable>
        </Section>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 20,
  },
  title: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 26,
    color: Colors.text,
    marginBottom: 4,
  },
  section: {
    gap: 6,
  },
  sectionLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowPressed: {
    backgroundColor: Colors.background,
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.text,
  },
  rowValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  rowChevron: {
    fontSize: 18,
    color: Colors.textMuted,
  },
  themeRow: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  themePicker: {
    flexDirection: 'row',
    gap: 8,
  },
  themeBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.background,
    gap: 4,
  },
  themeBtnActive: {
    backgroundColor: Colors.primary,
  },
  themeIcon: {
    fontSize: 18,
  },
  themeBtnText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
  },
  themeBtnTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
  },
  logoutText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.danger,
  },
});
