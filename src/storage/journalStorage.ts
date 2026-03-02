import type { JournalEntry, JournalImage } from '../types/journal';
import { supabase } from './supabase';

// ---- Entries (Supabase table: journal_entries) ----

export async function getEntries(): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch entries:', error.message);
    return [];
  }

  return (data ?? []).map(rowToEntry);
}

export async function getEntry(id: string): Promise<JournalEntry | undefined> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;
  return rowToEntry(data);
}

export async function saveEntry(entry: JournalEntry): Promise<void> {
  const now = new Date().toISOString();
  const row = {
    id: entry.id,
    title: entry.title,
    content: entry.content,
    images: entry.images,
    created_at: entry.createdAt || now,
    updated_at: entry.updatedAt || now,
  };

  const { error } = await supabase
    .from('journal_entries')
    .upsert(row, { onConflict: 'id' });

  if (error) {
    console.error('Failed to save entry:', error.message);
  }
}

export async function deleteEntry(id: string): Promise<void> {
  const entry = await getEntry(id);
  if (entry) {
    const paths = entry.images
      .filter((img) => img.storagePath)
      .map((img) => img.storagePath);
    if (paths.length > 0) {
      await supabase.storage.from('diary-images').remove(paths);
    }
  }

  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete entry:', error.message);
  }
}

// ---- Image uploads (Supabase Storage bucket: diary-images) ----

export async function uploadImage(
  file: File,
  entryId: string
): Promise<JournalImage | null> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${entryId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from('diary-images')
    .upload(path, file);

  if (error) {
    console.error('Failed to upload image:', error.message);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('diary-images').getPublicUrl(path);

  return {
    id: crypto.randomUUID(),
    url: publicUrl,
    storagePath: path,
    name: file.name,
    addedAt: new Date().toISOString(),
  };
}

export async function deleteImage(storagePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from('diary-images')
    .remove([storagePath]);

  if (error) {
    console.error('Failed to delete image:', error.message);
  }
}

// ---- Helpers ----

function rowToEntry(row: Record<string, unknown>): JournalEntry {
  return {
    id: row.id as string,
    title: row.title as string,
    content: (row.content as string) ?? '',
    images: (row.images as JournalImage[]) ?? [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
