import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yftmgmpcyrxhbdzgbgrl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmdG1nbXBjeXJ4aGJkemdiZ3JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyODI3MTcsImV4cCI6MjA3ODg1ODcxN30.0P_te9rEeMUU-_CYB6b8cUKWa_PTKXLIWjEuPA_Bxeg';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Database types (will be generated from Supabase)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          xp: number;
          level: number;
          streak: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          xp?: number;
          level?: number;
          streak?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          xp?: number;
          level?: number;
          streak?: number;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          progress: number;
          total_modules: number;
          completed_modules: number;
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
          estimated_hours: number;
          rating: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          progress?: number;
          total_modules: number;
          completed_modules?: number;
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
          estimated_hours: number;
          rating?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          progress?: number;
          total_modules?: number;
          completed_modules?: number;
          difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
          estimated_hours?: number;
          rating?: number;
          updated_at?: string;
        };
      };
      study_sessions: {
        Row: {
          id: string;
          user_id: string;
          duration_minutes: number;
          xp_earned: number;
          mode: 'focus' | 'break';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          duration_minutes: number;
          xp_earned: number;
          mode: 'focus' | 'break';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          duration_minutes?: number;
          xp_earned?: number;
          mode?: 'focus' | 'break';
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          summary: string | null;
          file_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          summary?: string | null;
          file_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          summary?: string | null;
          file_url?: string | null;
          updated_at?: string;
        };
      };
      roadmaps: {
        Row: {
          id: string;
          user_id: string;
          goal: string;
          milestones: any; // JSON array
          progress_percentage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          goal: string;
          milestones: any;
          progress_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          goal?: string;
          milestones?: any;
          progress_percentage?: number;
          updated_at?: string;
        };
      };
    };
  };
};

