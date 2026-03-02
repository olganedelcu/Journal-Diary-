import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pcngqnxeyelhwsjvnbeo.supabase.co';
const supabaseKey = 'sb_publishable_fmvuuqXWb2lSBFOBtlyRNg_yQY17JlJ';

export const supabase = createClient(supabaseUrl, supabaseKey);
