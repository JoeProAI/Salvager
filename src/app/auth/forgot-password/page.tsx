'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Skull, ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // TODO: Implement password reset with Firebase
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slab-950 flex items-center justify-center px-6">
      {/* Scan line effect */}
      <div className="scan-line" />
      
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 border-2 border-acid-500 flex items-center justify-center">
            <Skull className="w-6 h-6 text-acid-500" />
          </div>
          <span className="font-display text-2xl text-acid-500 tracking-wider">SALVAGE OPS</span>
        </div>

        <div className="salvage-card p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 border-2 border-acid-500 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-acid-500" />
              </div>
              <h1 className="font-display text-xl text-slab-100 uppercase tracking-wide mb-2">
                Check Your Inbox
              </h1>
              <p className="text-slab-400 font-mono text-sm mb-6">
                If an account exists for {email}, you'll receive a password reset link.
              </p>
              <Link href="/auth/login" className="salvage-btn inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                BACK TO LOGIN
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="font-display text-xl text-slab-100 uppercase tracking-wide mb-2">
                  Reset Password
                </h1>
                <p className="text-slab-400 font-mono text-sm">
                  Enter your email to receive a reset link
                </p>
              </div>

              {error && (
                <div className="p-4 border-2 border-oxide-500/50 bg-oxide-500/10 text-oxide-400 font-mono text-sm mb-6">
                  <span className="text-oxide-500">[ERROR]</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slab-500 font-mono uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slab-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slab-900 border-2 border-slab-700 text-slab-100 pl-12 pr-4 py-3 font-mono focus:border-acid-500 focus:outline-none transition-colors placeholder:text-slab-600"
                      placeholder="> your@email.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full salvage-btn inline-flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Mail className="w-5 h-5" />
                  )}
                  SEND RESET LINK
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/auth/login" className="text-slab-400 hover:text-acid-400 transition-colors font-mono text-sm inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
