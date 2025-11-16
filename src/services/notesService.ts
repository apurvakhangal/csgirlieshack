import { supabase } from '@/lib/supabase';
import { generateSummary } from '@/lib/gemini';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  summary: string | null;
  file_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Upload a note file to Supabase Storage
 */
export async function uploadNoteFile(file: File, userId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('notes')
      .upload(fileName, file);

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('notes')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}

/**
 * Extract text from uploaded file (basic implementation)
 * In production, you'd use a proper text extraction library
 */
export async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    } else if (file.type.startsWith('text/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    } else {
      // For PDFs, images, etc., we'll need OCR or PDF parsing
      // For now, return a placeholder message
      resolve(`[File: ${file.name}]\n\nThis file type (${file.type || 'unknown'}) requires additional processing. For now, please upload a text file (.txt) or paste your content directly.`);
    }
  });
}

/**
 * Create a new note
 */
export async function createNote(
  userId: string,
  title: string,
  content: string,
  fileUrl?: string | null
) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: userId,
        title,
        content,
        file_url: fileUrl,
      })
      .select()
      .single();

    if (error) throw error;
    return { note: data, error: null };
  } catch (error: any) {
    console.error('Error creating note:', error);
    return { note: null, error: error.message };
  }
}

/**
 * Generate summary for a note using Gemini
 */
export async function generateNoteSummary(noteId: string, content: string) {
  try {
    const summary = await generateSummary(content);

    // Update note with summary
    const { error } = await supabase
      .from('notes')
      .update({ summary })
      .eq('id', noteId);

    if (error) throw error;

    return { summary, error: null };
  } catch (error: any) {
    console.error('Error generating summary:', error);
    return { summary: null, error: error.message };
  }
}


/**
 * Get all notes for a user
 */
export async function getUserNotes(userId: string) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { notes: data, error: null };
  } catch (error: any) {
    console.error('Error fetching notes:', error);
    return { notes: null, error: error.message };
  }
}

/**
 * Delete a note
 */
export async function deleteNote(noteId: string) {
  try {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error('Error deleting note:', error);
    return { error: error.message };
  }
}

