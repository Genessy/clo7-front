import { apiFetch } from './api';
import { type ClothingItem, type ClothingCategory, type Season } from '@/constants/mock-data';

interface ApiClothingItem {
  id: string;
  name: string;
  type: string[];
  color: string[];
  imageUrls: string[];
  season: string[];
  fabricType: string[];
}

export interface CreateClothingPayload {
  name: string;
  category: ClothingCategory;
  color: string;
  season: Season;
  material?: string;
  clothingPhotoUri?: string;
}

function adaptFromApi(api: ApiClothingItem): ClothingItem {
  return {
    id: api.id,
    name: api.name,
    category: (api.type[0] as ClothingCategory) ?? 'top',
    color: api.color[0] ?? '',
    season: (api.season[0] as Season) ?? 'all',
    material: api.fabricType[0],
    photoUri: api.imageUrls[0],
  };
}

export async function deleteClothing(id: string): Promise<void> {
  await apiFetch<void>(`/api/clothes/${id}`, { method: 'DELETE' });
}

export async function getClothes(): Promise<ClothingItem[]> {
  const items = await apiFetch<ApiClothingItem[]>('/api/clothes');
  return items.map(adaptFromApi);
}

export async function createClothing(payload: CreateClothingPayload): Promise<void> {
  await apiFetch<void>('/api/clothes', {
    method: 'POST',
    body: JSON.stringify({
      name: payload.name,
      type: [payload.category],
      color: [payload.color],
      imageUrls: payload.clothingPhotoUri ? [payload.clothingPhotoUri] : [],
      season: [payload.season],
      fabricType: payload.material ? [payload.material] : [],
    }),
  });
}
