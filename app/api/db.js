import mysql from 'mysql2/promise'

// Database configuration based on environment
const getDbConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (isDevelopment) {
    return {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'confessly',
      port: process.env.DB_PORT || 3306
    }
  } else {
    // Production configuration
    return {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'vectrium',
      password: process.env.DB_PASSWORD || 'StrongPassword@123',
      database: process.env.DB_NAME || 'confessly',
      port: process.env.DB_PORT || 3306
    }
  }
}

// Create connection pool
const pool = mysql.createPool({
  ...getDbConfig(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Test connection function
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    console.log('Database connected successfully')
    connection.release()
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Export the pool for use in API routes
export const db = pool

// Helper function for executing queries
export const executeQuery = async (query, params = []) => {
  try {
    const [rows] = await pool.execute(query, params)
    return rows
  } catch (error) {
    console.error('Query execution failed:', error)
    throw error
  }
}

// Helper function for executing transactions
export const executeTransaction = async (queries) => {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    
    const results = []
    for (const { query, params = [] } of queries) {
      const [rows] = await connection.execute(query, params)
      results.push(rows)
    }
    
    await connection.commit()
    return results
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}
