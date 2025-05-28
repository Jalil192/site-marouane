// backend/database.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ihobtuplijggiwmjxewx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlob2J0dXBsaWpnZ2l3bWp4ZXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzODQ3OTcsImV4cCI6MjA2Mzk2MDc5N30.vMHhk3Yox8eqhLtiYAgLSr6LNuOgfD2PCwlk6MOXit0';
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

