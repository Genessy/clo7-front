export type ClothingCategory = 'top' | 'outerwear' | 'bottom' | 'shoes' | 'accessory';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'all';

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  color: string;
  season: Season;
  material?: string;
  photoUri?: string;
  tagPhotoUri?: string;
}

export const MOCK_WARDROBE: ClothingItem[] = [
  {
    id: '1',
    name: 'White T-Shirt',
    category: 'top',
    color: 'White',
    season: 'all',
    material: '100% Cotton',
  },
  {
    id: '2',
    name: 'Denim Jacket',
    category: 'outerwear',
    color: 'Blue',
    season: 'spring',
    material: '100% Denim',
  },
  {
    id: '3',
    name: 'Black Jeans',
    category: 'bottom',
    color: 'Black',
    season: 'all',
    material: '98% Cotton, 2% Elastane',
  },
  {
    id: '4',
    name: 'White Sneakers',
    category: 'shoes',
    color: 'White',
    season: 'all',
  },
  {
    id: '5',
    name: 'Grey Hoodie',
    category: 'top',
    color: 'Grey',
    season: 'autumn',
    material: '80% Cotton, 20% Polyester',
  },
  {
    id: '6',
    name: 'Beige Chinos',
    category: 'bottom',
    color: 'Beige',
    season: 'spring',
    material: '100% Cotton',
  },
  {
    id: '7',
    name: 'Navy Coat',
    category: 'outerwear',
    color: 'Navy',
    season: 'winter',
    material: '80% Wool, 20% Polyester',
  },
  {
    id: '8',
    name: 'Chelsea Boots',
    category: 'shoes',
    color: 'Brown',
    season: 'autumn',
    material: 'Leather',
  },
];
