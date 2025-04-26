import { useEffect } from 'react'
import { testDatabaseConnection } from '@/lib/supabase'

export function TestConnection() {
  useEffect(() => {
    testDatabaseConnection()
  }, [])

  return null
}