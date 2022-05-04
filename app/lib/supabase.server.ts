import { createClient } from '@supabase/supabase-js';
import invariant from 'tiny-invariant';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

invariant(supabaseUrl, 'SUPABASE_URL must be set in your environment variables.');
invariant(supabaseAnonKey, 'SUPABASE_URL must be set in your environment variables.');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
