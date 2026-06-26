import { useEffect, useState } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { supabase } from '../lib/supabase'
import { TrpcProvider } from '../components/TrpcProvider'
import type { Session } from '@supabase/supabase-js'

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (loading) return
    const inAuthGroup = segments[0] === '(auth)'
    const inWelcome = segments[0] === 'welcome'

    if (!session && !inAuthGroup && !inWelcome) {
      router.replace('/welcome')
    } else if (session && (inAuthGroup || inWelcome)) {
      router.replace('/(app)/dashboard')
    }
  }, [session, loading, segments])

  return (
    <TrpcProvider>
      <StatusBar style="auto" />
      <Slot />
    </TrpcProvider>
  )
}
