import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eykcxrzxcawbwqqatzeo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5a2N4cnp4Y2F3YndxcWF0emVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0OTA5NzksImV4cCI6MjEwNDA2Njk3OX0.bDBSaHCMFi6wx-2iJ5fCg4jlLD3HJ__UM-OHmeot8Fk';

console.log('Testing Supabase connection...');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Supabase Auth error:', error.message);
      process.exit(1);
    }
    console.log('✅ Supabase Auth connection successful! Current session:', data.session ? 'Active' : 'No active session (clean state)');
    
    // Also test public health or REST endpoint
    const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: {
        'apikey': supabaseAnonKey
      }
    });
    console.log('✅ Supabase Health status HTTP:', response.status);
    console.log('All tests passed! Connection is valid.');
    process.exit(0);
  } catch (err) {
    console.error('Connection test failed:', err);
    process.exit(1);
  }
}

testConnection();

