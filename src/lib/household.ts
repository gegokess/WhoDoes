import { supabase } from './supabase';
import { nanoid } from 'nanoid';

/**
 * Create a new household with a generated code
 */
export const createHousehold = async (name: string) => {
  // Generate 6-character code (uppercase alphanumeric)
  const code = nanoid(6).toUpperCase().replace(/[^A-Z0-9]/g, '0');
  
  const { data, error } = await supabase
    .from('households')
    .insert({ name, code })
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};

/**
 * Join an existing household by code
 */
export const joinHousehold = async (code: string) => {
  const { data, error } = await supabase
    .from('households')
    .select('*')
    .eq('code', code.toUpperCase())
    .single();
  
  if (error || !data) {
    throw new Error('Invalid household code');
  }
  
  return data;
};

/**
 * Validate a household code exists
 */
export const validateHouseholdCode = async (code: string): Promise<boolean> => {
  const { data } = await supabase
    .from('households')
    .select('id')
    .eq('code', code.toUpperCase())
    .single();
  
  return !!data;
};

/**
 * Create a new partner in the household
 */
export const createPartner = async (householdId: string, name: string, avatarUrl?: string) => {
  const { data, error } = await supabase
    .from('partners')
    .insert({
      household_id: householdId,
      name,
      avatar_url: avatarUrl || null,
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};
