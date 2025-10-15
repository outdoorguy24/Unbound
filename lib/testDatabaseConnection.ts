import { supabase } from './supabaseClient';

/**
 * Test function to verify database connections are working
 * This can be called during development to ensure Supabase is properly connected
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection by querying user_profiles table
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
    
    console.log('✅ Database connection successful');
    return true;
    
  } catch (error) {
    console.error('Database connection test error:', error);
    return false;
  }
}

/**
 * Test function to verify all required tables exist
 */
export async function testRequiredTables(): Promise<boolean> {
  try {
    console.log('Testing required tables...');
    
    const tables = [
      'user_profiles',
      'blocked_sessions', 
      'porn_blocking_sessions',
      'phone_usage_tracking',
      'user_responses'
    ];
    
    const results = await Promise.all(
      tables.map(async (table) => {
        try {
          const { error } = await supabase
            .from(table)
            .select('*')
            .limit(1);
          
          if (error) {
            console.error(`❌ Table ${table} not accessible:`, error.message);
            return false;
          }
          
          console.log(`✅ Table ${table} accessible`);
          return true;
        } catch (err) {
          console.error(`❌ Table ${table} error:`, err);
          return false;
        }
      })
    );
    
    const allTablesExist = results.every(result => result);
    
    if (allTablesExist) {
      console.log('✅ All required tables are accessible');
    } else {
      console.log('❌ Some required tables are not accessible');
    }
    
    return allTablesExist;
    
  } catch (error) {
    console.error('Table test error:', error);
    return false;
  }
}

/**
 * Run all database tests
 */
export async function runAllDatabaseTests(): Promise<void> {
  console.log('🧪 Running database tests...');
  
  const connectionTest = await testDatabaseConnection();
  const tablesTest = await testRequiredTables();
  
  if (connectionTest && tablesTest) {
    console.log('🎉 All database tests passed! Ready for real data.');
  } else {
    console.log('⚠️ Some database tests failed. Check your Supabase setup.');
  }
}
