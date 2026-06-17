let pendingClothingPhotoUrl: string | null = null;

export function setPendingPhotoUrl(url: string | null) {
  pendingClothingPhotoUrl = url;
}

export function getPendingPhotoUrl(): string | null {
  return pendingClothingPhotoUrl;
}
