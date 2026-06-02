import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/colors';

export default function AddPhotoScreen() {
  const router = useRouter();
  const [clothingPhoto, setClothingPhoto] = useState<string | null>(null);
  const [tagPhoto, setTagPhoto] = useState<string | null>(null);

  async function pickImage(setter: (uri: string) => void, source: 'camera' | 'gallery') {
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera access is needed to take photos.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (!result.canceled) setter(result.assets[0].uri);
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Photo library access is needed.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (!result.canceled) setter(result.assets[0].uri);
    }
  }

  const hasPhotos = clothingPhoto || tagPhoto;

  if (!hasPhotos) {
    return (
      <SafeAreaView style={styles.safe}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>

        <View style={styles.container}>
          <Text style={styles.title}>Add Clothing</Text>
          <Text style={styles.subtitle}>Upload photos of your clothing item</Text>

          <Text style={styles.fieldLabel}>Clothing Photo <Text style={styles.required}>*</Text></Text>

          <View style={styles.pickerRow}>
            <Pressable
              style={({ pressed }) => [styles.pickerCard, pressed && styles.pickerCardPressed]}
              onPress={() => pickImage(setClothingPhoto, 'camera')}
            >
              <Text style={styles.pickerIcon}>📷</Text>
              <Text style={styles.pickerText}>Take Photo</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.pickerCard, pressed && styles.pickerCardPressed]}
              onPress={() => pickImage(setClothingPhoto, 'gallery')}
            >
              <Text style={styles.pickerIcon}>🖼</Text>
              <Text style={styles.pickerText}>Gallery</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backIcon}>←</Text>
      </Pressable>

      <View style={styles.container}>
        <Text style={styles.title}>Add Clothing</Text>
        <Text style={styles.subtitle}>Upload photos of your clothing item</Text>

        <View style={styles.photoRow}>
          <View style={styles.photoWrap}>
            <Pressable
              style={styles.removeBtn}
              onPress={() => setClothingPhoto(null)}
            >
              <Text style={styles.removeBtnText}>✕</Text>
            </Pressable>
            {clothingPhoto ? (
              <Pressable onPress={() => pickImage(setClothingPhoto, 'gallery')}>
                <Image source={{ uri: clothingPhoto }} style={styles.photoThumb} />
              </Pressable>
            ) : (
              <Pressable
                style={styles.emptyThumb}
                onPress={() => pickImage(setClothingPhoto, 'gallery')}
              >
                <Text style={styles.pickerIcon}>📷</Text>
              </Pressable>
            )}
            <Text style={styles.photoLabel}>Clothing Photo</Text>
          </View>

          <View style={styles.photoWrap}>
            <Pressable
              style={styles.removeBtn}
              onPress={() => setTagPhoto(null)}
            >
              <Text style={styles.removeBtnText}>✕</Text>
            </Pressable>
            {tagPhoto ? (
              <Pressable onPress={() => pickImage(setTagPhoto, 'gallery')}>
                <Image source={{ uri: tagPhoto }} style={styles.photoThumb} />
              </Pressable>
            ) : (
              <Pressable
                style={styles.emptyThumb}
                onPress={() => pickImage(setTagPhoto, 'gallery')}
              >
                <Text style={styles.pickerIcon}>📷</Text>
              </Pressable>
            )}
            <Text style={styles.photoLabel}>Tag Photo</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.btnContinue, pressed && styles.btnContinuePressed]}
          onPress={() =>
            router.push({
              pathname: '/add-details',
              params: {
                clothingPhoto: clothingPhoto ?? '',
                tagPhoto: tagPhoto ?? '',
              },
            })
          }
        >
          <Text style={styles.btnContinueText}>Continue to Details</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  back: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backIcon: {
    fontSize: 22,
    color: Colors.text,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 16,
  },
  title: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 26,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.primary,
  },
  fieldLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
  },
  required: {
    color: Colors.danger,
  },
  pickerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  pickerCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
  },
  pickerCardPressed: {
    backgroundColor: Colors.background,
  },
  pickerIcon: {
    fontSize: 28,
  },
  pickerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  photoWrap: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  removeBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 10,
    backgroundColor: Colors.danger,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  photoThumb: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: Colors.border,
  },
  emptyThumb: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.primary,
  },
  btnContinue: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnContinuePressed: {
    backgroundColor: Colors.primaryHover,
  },
  btnContinueText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
