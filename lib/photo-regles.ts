// Règles photo, partagées avec le formulaire (mêmes limites que le bucket).
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const PHOTO_MAX_OCTETS = 5 * 1024 * 1024;

export function erreurPhoto(file: File): string {
  if (!PHOTO_TYPES.includes(file.type)) return "Format non accepté : utilisez une photo JPG, PNG ou WebP.";
  if (file.size > PHOTO_MAX_OCTETS) return "Photo trop lourde : 5 Mo maximum.";
  return "";
}
