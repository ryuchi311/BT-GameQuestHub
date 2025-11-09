import { supabase } from '../lib/supabase'

export async function testDatabaseConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      console.error('Database connection error:', error)
      return {
        success: false,
        error: error.message,
        details: error
      }
    }

    console.log('✅ Database connection successful!')
    return {
      success: true,
      message: 'Connected to Supabase successfully',
      data
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: 'Unexpected error occurred',
      details: error
    }
  }
}

export async function testAuthentication() {
  try {
    // Test auth connection
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Auth connection error:', error)
      return {
        success: false,
        error: error.message,
        details: error
      }
    }

    console.log('✅ Authentication service available!')
    return {
      success: true,
      message: 'Auth service connected',
      session: session ? 'User logged in' : 'No active session'
    }
  } catch (error) {
    console.error('Auth test error:', error)
    return {
      success: false,
      error: 'Auth test failed',
      details: error
    }
  }
}