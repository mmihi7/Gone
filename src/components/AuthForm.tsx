'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  Mail, Lock, User, LogIn, UserPlus, 
  Fingerprint 
} from 'lucide-react'
import { 
  FaGoogle, FaFacebook, FaApple 
} from 'react-icons/fa'

type AuthMode = 'login' | 'signup' | 'reset' | 'magic-link'

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { 
    signIn, 
    signUp, 
    resetPassword, 
    signInWithMagicLink,
    signInWithOAuth 
  } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      switch (mode) {
        case 'login':
          const { error: loginError } = await signIn(email, password)
          if (loginError) {
            setError(loginError.message)
            return
          }
          router.push('/deals')
          break

        case 'signup':
          if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
          }
          
          // Password validation
          if (password.length < 8) {
            setError('Password must be at least 8 characters long')
            return
          }

          const { error: signupError } = await signUp(email, password, {
            registered_at: new Date().toISOString(),
            email_verified: false
          })

          if (signupError) {
            setError(signupError.message)
            return
          }
          router.push('/onboarding')
          break

        case 'reset':
          const { error: resetError } = await resetPassword(email)
          if (resetError) {
            setError(resetError.message)
            return
          }
          setMode('login')
          break
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setError(null)
    setIsLoading(true)

    try {
      const result = await signInWithOAuth(provider)

      if (result?.error) {
        // Detailed error handling
        const errorMessage = result.error.message || `${provider} sign-in failed`
        
        // Check for specific Supabase OAuth errors
        if (errorMessage.includes('provider is not enabled')) {
          setError(`${provider} authentication is not configured. Please contact support.`)
        } else if (errorMessage.includes('validation_failed')) {
          setError(`${provider} authentication failed. Please try again later.`)
        } else {
          setError(errorMessage)
        }
        
        return
      }

      router.push('/deals')
    } catch (err: any) {
      setError(err.message || `${provider} sign-in failed`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'login' ? 'Sign in to your account' : 
             mode === 'signup' ? 'Create a new account' : 
             'Reset your password'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>
            {mode !== 'reset' && (
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>
            )}
            {mode === 'signup' && (
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 
               mode === 'login' ? 'Sign In' : 
               mode === 'signup' ? 'Sign Up' : 
               'Reset Password'}
            </button>
          </div>
        </form>

        <div className="text-center">
          {mode === 'login' && (
            <>
              <button 
                onClick={() => setMode('reset')}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </button>
              <p className="mt-2 text-sm text-gray-600">
                Don't have an account?{' '}
                <button 
                  onClick={() => setMode('signup')}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign up
                </button>
              </p>
            </>
          )}
          {mode === 'signup' && (
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={() => setMode('login')}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </button>
            </p>
          )}
          {mode === 'reset' && (
            <p className="mt-2 text-sm text-gray-600">
              Remember your password?{' '}
              <button 
                onClick={() => setMode('login')}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </button>
            </p>
          )}
        </div>

        {/* Social Login Buttons */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <FaGoogle className="h-5 w-5 mr-2" />
            Google
          </button>
          <button
            onClick={() => handleSocialLogin('facebook')}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <FaFacebook className="h-5 w-5 mr-2" />
            Facebook
          </button>
          <button
            onClick={() => handleSocialLogin('apple')}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <FaApple className="h-5 w-5 mr-2" />
            Apple
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthForm