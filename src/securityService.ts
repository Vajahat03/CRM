import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Security Service for Al Uzer CRM
 * Manages Owner PIN / Password, PIN customization, database synchronization, and Employee vs Owner app mode.
 */

const LOCAL_STORAGE_KEYS = {
  OWNER_PIN: 'al_uzer_crm_owner_pin',
  APP_ROLE: 'al_uzer_crm_app_role',
};

const DEFAULT_OWNER_PIN = '163692';
let cachedPin: string | null = null;

export type AppRole = 'employee' | 'owner';

export function getOwnerPin(): string {
  if (cachedPin && cachedPin.trim().length >= 4) {
    return cachedPin;
  }
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.OWNER_PIN);
    if (stored && stored.trim().length >= 4) {
      cachedPin = stored.trim();
      return cachedPin;
    }
  } catch {}
  return DEFAULT_OWNER_PIN;
}

/**
 * Loads the Owner PIN from Supabase database `app_security` table on startup
 */
export async function fetchOwnerPinFromDb(supabase?: SupabaseClient | null): Promise<string> {
  if (!supabase) return getOwnerPin();
  try {
    const { data, error } = await supabase
      .from('app_security')
      .select('owner_pin')
      .eq('id', 'owner_pin_config')
      .maybeSingle();

    if (!error && data?.owner_pin) {
      const pin = String(data.owner_pin).trim();
      if (pin.length >= 4) {
        cachedPin = pin;
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.OWNER_PIN, pin);
        } catch {}
        return pin;
      }
    }
  } catch (e) {
    console.warn('Could not fetch PIN from Supabase app_security:', e);
  }
  return getOwnerPin();
}

/**
 * Saves new Owner PIN / Password both locally and to Supabase database
 */
export async function setOwnerPin(newPin: string, supabase?: SupabaseClient | null): Promise<boolean> {
  const clean = newPin ? newPin.trim() : '';
  if (!clean || clean.length < 4) {
    return false;
  }
  cachedPin = clean;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.OWNER_PIN, clean);
  } catch {}

  if (supabase) {
    try {
      const { error } = await supabase
        .from('app_security')
        .upsert({
          id: 'owner_pin_config',
          owner_pin: clean,
          updated_at: new Date().toISOString(),
        });
      if (error) {
        console.warn('Note on Supabase app_security upsert:', error);
      }
    } catch (err) {
      console.warn('Failed to upsert owner PIN to Supabase app_security:', err);
    }
  }
  return true;
}

export function verifyOwnerPin(inputPin: string): boolean {
  const currentPin = getOwnerPin();
  return inputPin.trim() === currentPin;
}

export function getStoredAppRole(): AppRole {
  try {
    const role = localStorage.getItem(LOCAL_STORAGE_KEYS.APP_ROLE);
    if (role === 'owner' || role === 'employee') {
      return role;
    }
  } catch {}
  return 'employee'; // Default to Employee mode for privacy safety
}

export function setStoredAppRole(role: AppRole): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.APP_ROLE, role);
  } catch {}
}
