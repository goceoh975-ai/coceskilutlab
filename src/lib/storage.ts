import { supabase } from './supabase';
import type { Product } from '@/types';

/**
 * Fetch all products from Supabase, newest first.
 */
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('luts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as Product[];
}

/**
 * Insert a new product row.
 */
export async function createProduct(
  product: Omit<Product, 'id' | 'created_at'>
): Promise<Product> {
  const { data, error } = await supabase
    .from('luts')
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

/**
 * Update an existing product row.
 */
export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, 'id' | 'created_at'>>
): Promise<Product> {
  const { data, error } = await supabase
    .from('luts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

/**
 * Delete a product row.
 */
export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('luts').delete().eq('id', id);
  if (error) throw error;
}

/**
 * Upload an image to the "images" bucket and return its public URL.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from('images').upload(filename, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  const { data: urlData } = supabase.storage.from('images').getPublicUrl(filename);
  return urlData.publicUrl;
}

/**
 * Upload a single image to either the "before" or "after" folder.
 * Convenience wrapper used by the admin multi-image uploader.
 */
export async function uploadImageTo(
  file: File,
  side: 'before' | 'after'
): Promise<string> {
  return uploadImage(file, side);
}

/**
 * Upload a LUT .zip file to the "luts" bucket and return its public URL.
 */
export async function uploadZip(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'zip';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from('luts').upload(filename, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  const { data: urlData } = supabase.storage.from('luts').getPublicUrl(filename);
  return urlData.publicUrl;
}

/**
 * Compress an image File to a data URL for preview before upload.
 */
export async function compressImage(
  file: File,
  maxWidth = 1200,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
