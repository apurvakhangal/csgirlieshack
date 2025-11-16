import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/userStore';

/**
 * Update user XP and level
 */
export async function updateUserXP(userId: string, xpToAdd: number) {
  try {
    const currentUser = useUserStore.getState().user;
    if (!currentUser) throw new Error('User not found');

    const newXP = currentUser.xp + xpToAdd;
    const newLevel = Math.floor(newXP / 100) + 1;

    // Update in database
    const { error } = await supabase
      .from('users')
      .update({
        xp: newXP,
        level: newLevel,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;

    // Update local store
    useUserStore.getState().addXP(xpToAdd);

    return { xp: newXP, level: newLevel, error: null };
  } catch (error: any) {
    console.error('Error updating XP:', error);
    return { xp: null, level: null, error: error.message };
  }
}

/**
 * Update user streak
 */
export async function updateUserStreak(userId: string, streak: number) {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        streak,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;

    // Update local store
    useUserStore.setState((state) => {
      if (state.user) {
        return {
          user: {
            ...state.user,
            streak,
          },
        };
      }
      return state;
    });

    return { error: null };
  } catch (error: any) {
    console.error('Error updating streak:', error);
    return { error: error.message };
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return { profile: null, error: error.message };
  }
}

