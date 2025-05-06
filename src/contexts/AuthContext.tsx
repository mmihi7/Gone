'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type AuthProvider = 'google' | 'facebook' | 'apple'

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithMagicLink: (email: string) => Promise<{ error: AuthError | null }>
  signInWithOAuth: (provider: AuthProvider) => Promise<{ error: AuthError | null; data?: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updateProfile: (updates: any) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    }
    fetchSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  }

  const signInWithMagicLink = async (email: string) => {
    return await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  const signInWithOAuth = async (provider: AuthProvider) => {
    try {
      // Map our custom providers to Supabase providers
      const providerMap: Record<AuthProvider, string> = {
        'google': 'google',
        'facebook': 'facebook',
        'apple': 'apple'
      }

      const supabaseProvider = providerMap[provider]

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: supabaseProvider as any,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: provider === 'google' 
            ? 'email profile' 
            : provider === 'facebook' 
              ? 'email public_profile' 
              : ''
        }
      })

      // Normalize the return type to match AuthContextType
      if (error) {
        console.error(`${provider.toUpperCase()} Sign-In Error:`, error)
        return { 
          error: new AuthError(error.message || `${provider} sign-in failed`),
          data: undefined 
        }
      }

      return { 
        error: null, 
        data: data 
      }
    } catch (err: any) {
      console.error(`Unexpected ${provider.toUpperCase()} Sign-In Error:`, err)
      return { 
        error: new AuthError(err.message || `${provider} sign-in failed`),
        data: undefined 
      }
    }
  }

  const signUp = async (email: string, password: string, metadata: any = {}) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
  }

  const signOut = async () => {
    return await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
  }

  const updateProfile = async (updates: any) => {
    if (!user) {
      return { error: new AuthError('No user logged in') }
    }
    
    return await supabase.auth.updateUser({
      data: updates
    })
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signInWithMagicLink,
    signInWithOAuth,
    signUp,
    signOut,
    resetPassword,
    updateProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}