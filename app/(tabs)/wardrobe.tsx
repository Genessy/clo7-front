import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/colors';
import { type ClothingItem, type ClothingCategory } from '@/constants/mock-data';
import { getClothes, deleteClothing } from '@/services/clothes';

const CATEGORY_LABELS: Record<ClothingCategory | 'all', string> = {
  all: 'All',
  top: 'Tops',
  outerwear: 'Outerwear',
  bottom: 'Bottoms',
  shoes: 'Shoes',
  accessory: 'Accessories',
};

const CATEGORIES: Array<ClothingCategory | 'all'> = [
  'all', 'top', 'outerwear', 'bottom', 'shoes', 'accessory',
];

function ClothingCard({ item, onDelete }: { item: ClothingItem; onDelete: () => void }) {
  function handleDelete() {
    Alert.alert('Delete', `Remove "${item.name}" from your wardrobe?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  }

  return (
    <View style={styles.card}>
      {item.photoUri ? (
        <Image source={{ uri: item.photoUri }} style={styles.thumb} />
      ) : (
        <View style={styles.thumb} />
      )}
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardMeta}>
          {item.color} · {CATEGORY_LABELS[item.category]}
        </Text>
      </View>
      <View style={styles.seasonBadge}>
        <Text style={styles.seasonText}>{item.season}</Text>
      </View>
      <Pressable onPress={handleDelete} style={styles.deleteBtn} hitSlop={8}>
        <Text style={styles.deleteIcon}>✕</Text>
      </Pressable>
    </View>
  );
}

export default function WardrobeScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<ClothingCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [clothes, setClothes] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getClothes()
        .then(setClothes)
        .catch(console.error)
        .finally(() => setLoading(false));
    }, [])
  );

  async function handleDelete(id: string) {
    try {
      await deleteClothing(id);
      setClothes((prev) => prev.filter((c) => c.id !== id));
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to delete clothing.');
    }
  }

  const filtered = clothes.filter((item) => {
    const matchCategory = filter === 'all' || item.category === filter;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wardrobe</Text>
        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
          onPress={() => router.push('/add-photo')}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          placeholder="Search clothing…"
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filtersWrap}>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(c) => c}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
          renderItem={({ item: cat }) => (
            <Pressable
              onPress={() => setFilter(cat)}
              style={[styles.chip, filter === cat && styles.chipActive]}
            >
              <Text style={[styles.chipText, filter === cat && styles.chipTextActive]}>
                {CATEGORY_LABELS[cat]}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {loading ? (
        <View style={styles.empty}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No items found.</Text>
            </View>
          }
          renderItem={({ item }) => <ClothingCard item={item} onDelete={() => handleDelete(item.id)} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 26,
    color: Colors.text,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addBtnPressed: {
    backgroundColor: Colors.primaryHover,
  },
  addBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  searchWrap: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  search: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.text,
  },
  filtersWrap: {
    marginBottom: 8,
  },
  filters: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 10,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.border,
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  cardName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.text,
  },
  cardMeta: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
  },
  seasonBadge: {
    backgroundColor: Colors.background,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  seasonText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'capitalize',
  },
  deleteBtn: {
    padding: 4,
    marginLeft: 4,
  },
  deleteIcon: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textMuted,
  },
});
