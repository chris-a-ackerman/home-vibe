'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { HomeIcon, UserIcon, MailIcon, LockIcon, GoogleIcon } from '@/components/icons'

export default function SignUpPage() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name
          }
        }
      })

      if (error) throw error

      if (data.user) {
        console.log('User created successfully:', data.user)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      if (data.user) {
        console.log('User signed in successfully:', data.user)
        window.location.href = '/dashboard'
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) throw error
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full"
      style={{
        background: 'linear-gradient(124.45deg, rgb(239, 246, 255) 0%, rgb(238, 242, 255) 100%)'
      }}
    >
      <div className="w-[448px]">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="h-[148px] relative w-full">
            <div className="absolute left-[192px] top-0">
              <div className="bg-[#155dfc] rounded-2xl w-16 h-16 flex items-center justify-center">
                <HomeIcon />
              </div>
            </div>
            <h1 className="absolute top-20 w-full text-center font-normal text-[30px] leading-9 tracking-[0.3955px] text-neutral-950">
              HomeVibe
            </h1>
            <p className="absolute top-[124px] w-full text-center font-normal text-base leading-6 tracking-[-0.3125px] text-[#4a5565]">
              Find your perfect home match
            </p>
          </div>

          {/* Card */}
          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-[33px] flex flex-col gap-12">
            <div className="w-full">
              <div className="flex flex-col gap-8">
                {/* Tab List */}
                <div className="bg-[#ececf0] h-9 rounded-[14px] p-[3.5px_3px]">
                  <div className="grid grid-cols-2 h-full gap-0">
                    <button
                      onClick={() => setActiveTab('signin')}
                      className={`rounded-[14px] px-[9px] py-[5px] font-medium text-sm leading-5 tracking-[-0.1504px] text-neutral-950 border border-transparent ${
                        activeTab === 'signin' ? 'bg-white' : ''
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setActiveTab('signup')}
                      className={`rounded-[14px] px-[9px] py-[5px] font-medium text-sm leading-5 tracking-[-0.1504px] text-neutral-950 border border-transparent ${
                        activeTab === 'signup' ? 'bg-white' : ''
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>

                {/* Form */}
                {activeTab === 'signup' && (
                  <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                    {error && (
                      <div className="text-red-500 text-sm text-center">{error}</div>
                    )}

                    {/* Name Field */}
                    <div className="flex flex-col gap-2">
                      <label className="font-normal text-sm leading-5 tracking-[-0.1504px] text-neutral-950">
                        Name
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-[13px]">
                          <UserIcon />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your name"
                          className="w-full h-[42px] border border-[rgba(0,0,0,0.1)] rounded-[10px] pl-10 pr-4 py-2 font-normal text-base tracking-[-0.3125px] placeholder:text-[rgba(10,10,10,0.5)] text-black"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                      <label className="font-normal text-sm leading-5 tracking-[-0.1504px] text-neutral-950">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-[13px]">
                          <MailIcon />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className="w-full h-[42px] border border-[rgba(0,0,0,0.1)] rounded-[10px] pl-10 pr-4 py-2 font-normal text-base tracking-[-0.3125px] placeholder:text-[rgba(10,10,10,0.5)] text-black"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                      <label className="font-normal text-sm leading-5 tracking-[-0.1504px] text-neutral-950">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-[13px]">
                          <LockIcon />
                        </div>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Create a password"
                          className="w-full h-[42px] border border-[rgba(0,0,0,0.1)] rounded-[10px] pl-10 pr-4 py-2 font-normal text-base tracking-[-0.3125px] placeholder:text-[rgba(10,10,10,0.5)] text-black"
                          required
                        />
                      </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="flex flex-col gap-2">
                      <label className="font-normal text-sm leading-5 tracking-[-0.1504px] text-neutral-950">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-[13px]">
                          <LockIcon />
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your password"
                          className="w-full h-[42px] border border-[rgba(0,0,0,0.1)] rounded-[10px] pl-10 pr-4 py-2 font-normal text-base tracking-[-0.3125px] placeholder:text-[rgba(10,10,10,0.5)] text-black"
                          required
                        />
                      </div>
                    </div>

                    {/* Create Account Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#030213] text-white font-medium text-sm leading-5 tracking-[-0.1504px] h-9 rounded-lg mt-2 disabled:opacity-50"
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    {/* Divider */}
                    <div className="relative h-5 my-6">
                      <div className="absolute top-1/2 left-0 right-0 border-t border-[#d1d5dc]" />
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                        <p className="font-normal text-sm leading-5 tracking-[-0.1504px] text-[#6a7282]">
                          Or continue with
                        </p>
                      </div>
                    </div>

                    {/* Google Sign In Button */}
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="bg-white border border-[rgba(0,0,0,0.1)] h-9 rounded-lg flex items-center justify-center gap-2 font-medium text-sm leading-5 tracking-[-0.1504px] text-neutral-950 disabled:opacity-50"
                    >
                      <GoogleIcon />
                      Sign up with Google
                    </button>
                  </form>
                )}

                {activeTab === 'signin' && (
                  <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                    {error && (
                      <div className="text-red-500 text-sm text-center">{error}</div>
                    )}

                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                      <label className="font-normal text-sm leading-5 tracking-[-0.1504px] text-neutral-950">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-[13px]">
                          <MailIcon />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className="w-full h-[42px] border border-[rgba(0,0,0,0.1)] rounded-[10px] pl-10 pr-4 py-2 font-normal text-base tracking-[-0.3125px] placeholder:text-[rgba(10,10,10,0.5)] text-black"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                      <label className="font-normal text-sm leading-5 tracking-[-0.1504px] text-neutral-950">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-[13px]">
                          <LockIcon />
                        </div>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter your password"
                          className="w-full h-[42px] border border-[rgba(0,0,0,0.1)] rounded-[10px] pl-10 pr-4 py-2 font-normal text-base tracking-[-0.3125px] placeholder:text-[rgba(10,10,10,0.5)] text-black"
                          required
                        />
                      </div>
                    </div>

                    {/* Sign In Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#030213] text-white font-medium text-sm leading-5 tracking-[-0.1504px] h-9 rounded-lg mt-2 disabled:opacity-50"
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </button>

                    {/* Divider */}
                    <div className="relative h-5 my-6">
                      <div className="absolute top-1/2 left-0 right-0 border-t border-[#d1d5dc]" />
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                        <p className="font-normal text-sm leading-5 tracking-[-0.1504px] text-[#6a7282]">
                          Or continue with
                        </p>
                      </div>
                    </div>

                    {/* Google Sign In Button */}
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="bg-white border border-[rgba(0,0,0,0.1)] h-9 rounded-lg flex items-center justify-center gap-2 font-medium text-sm leading-5 tracking-[-0.1504px] text-neutral-950 disabled:opacity-50"
                    >
                      <GoogleIcon />
                      Sign in with Google
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Footer Text */}
            <div className="h-4">
              <p className="font-normal text-xs leading-4 text-[#6a7282] text-center">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
