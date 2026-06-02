import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { ClothingCategory, Season } from '@/constants/mock-data';

const CATEGORIES: Array<{ value: ClothingCategory; label: string }> = [
  { value: 'top', label: 'Top' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessory', label: 'Accessory' },
];

const SEASONS: Array<{ value: Season; label: string }> = [
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'autumn', label: 'Autumn' },
  { value: 'winter', label: 'Winter' },
  { value: 'all', label: 'All seasons' },
];

function SelectField<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ value: T; label: string }>;
  value: T | null;
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable
        style={[styles.input, styles.selectInput]}
        onPress={() => setOpen(!open)}
      >
        <Text style={[styles.inputText, !selected && styles.placeholder]}>
          {selected ? selected.label : `Select ${label.toLowerCase()}`}
        </Text>
        <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
      </Pressable>
      {open && (
        <View style={styles.dropdown}>
          {options.map((opt) => (
            <Pressable
              key={opt.value}
              style={({ pressed }) => [
                styles.dropdownItem,
                pressed && styles.dropdownItemPressed,
                value === opt.value && styles.dropdownItemActive,
              ]}
              onPress={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              <Text
                style={[
                  styles.dropdownText,
                  value === opt.value && styles.dropdownTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export default function AddDetailsScreen() {
  const router = useRouter();
  const { clothingPhoto, tagPhoto } = useLocalSearchParams<{
    clothingPhoto: string;
    tagPhoto: string;
  }>();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory | null>(null);
  const [color, setColor] = useState('');
  const [season, setSeason] = useState<Season | null>(null);
  const [material] = useState('100% Cotton');

  function handleSave() {
    if (!name || !category || !season) {
      Alert.alert('Missing fields', 'Please fill in Name, Category, and Season.');
      return;
    }
    Alert.alert('Saved!', `${name} added to your wardrobe.`, [
      {
        text: 'OK',
        onPress: () => router.replace('/(tabs)/wardrobe'),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>

        <Text style={styles.title}>Add Clothing</Text>

        <View style={styles.photosHeader}>
          <Text style={styles.fieldLabel}>Uploaded Photos</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.editPhotos}>Edit Photos</Text>
          </Pressable>
        </View>

        <View style={styles.photoRow}>
          <View style={styles.photoWrap}>
            {clothingPhoto ? (
              <Image source={{ uri: clothingPhoto }} style={styles.photoThumb} />
            ) : (
              <View style={[styles.photoThumb, styles.emptyThumb]}>
                <Text style={styles.thumbIcon}>📷</Text>
              </View>
            )}
            <Text style={styles.photoLabel}>Clothing Photo</Text>
          </View>

          <View style={styles.photoWrap}>
            {tagPhoto ? (
              <Image source={{ uri: tagPhoto }} style={styles.photoThumb} />
            ) : (
              <View style={[styles.photoThumb, styles.emptyThumb]}>
                <Text style={styles.thumbIcon}>📷</Text>
              </View>
            )}
            <Text style={styles.photoLabel}>Tag Photo</Text>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., White T-Shirt"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <SelectField
          label="Category"
          options={CATEGORIES}
          value={category}
          onChange={setCategory}
        />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Color</Text>
          <TextInput
            style={styles.input}
            value={color}
            onChangeText={setColor}
            placeholder="e.g., White, Black, Blue"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <SelectField
          label="Season"
          options={SEASONS}
          value={season}
          onChange={setSeason}
        />

        <View style={styles.fieldGroup}>
          <View style={styles.materialHeader}>
            <Text style={styles.fieldLabel}>Material</Text>
            <Text style={styles.autoDetected}> (Auto-detected from tag)</Text>
          </View>
          <TextInput
            style={[styles.input, styles.inputMuted]}
            value={material}
            editable={false}
          />
          <Text style={styles.hint}>Material composition detected from clothing tag photo</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.btnSave, pressed && styles.btnSavePressed]}
          onPress={handleSave}
        >
          <Text style={styles.btnSaveText}>Save Clothing</Text>
        </Pressable>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  back: {
    marginBottom: 4,
  },
  backIcon: {
    fontSize: 22,
    color: Colors.text,
  },
  title: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 26,
    color: Colors.text,
  },
  photosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editPhotos: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.primary,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  photoWrap: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  photoThumb: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
  },
  emptyThumb: {
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbIcon: {
    fontSize: 24,
  },
  photoLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
  },
  materialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  autoDetected: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.primary,
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
  inputMuted: {
    color: Colors.textMuted,
  },
  inputText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.text,
    flex: 1,
  },
  placeholder: {
    color: Colors.textMuted,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  dropdown: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginTop: -8,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemPressed: {
    backgroundColor: Colors.background,
  },
  dropdownItemActive: {
    backgroundColor: `${Colors.primary}15`,
  },
  dropdownText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.text,
  },
  dropdownTextActive: {
    color: Colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
  hint: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
  },
  btnSave: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnSavePressed: {
    backgroundColor: Colors.primaryHover,
  },
  btnSaveText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
