'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Skull,
  Settings,
  Key,
  Bell,
  Shield,
  Database,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [retention, setRetention] = useState('30')

  return (
    <div className="min-h-screen bg-slab-950">
      {/* Scan line effect */}
      <div className="scan-line" />
      
      {/* Header */}
      <header className="bg-slab-900/95 backdrop-blur-sm border-b-2 border-slab-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-acid-500 flex items-center justify-center">
                  <Skull className="w-5 h-5 text-acid-500" />
                </div>
                <span className="font-display text-xl text-acid-500 tracking-wider">SALVAGE OPS</span>
              </Link>
              <span className="text-slab-600 font-mono">/</span>
              <h1 className="font-display text-lg text-slab-100 uppercase tracking-wide">Config</h1>
            </div>
            <Link href="/dashboard" className="text-slab-400 hover:text-acid-400 transition-colors text-sm uppercase tracking-wider font-mono">
              Command
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* API Configuration */}
        <div className="salvage-card p-6">
          <h2 className="font-display text-lg text-slab-100 mb-6 flex items-center gap-2 uppercase tracking-wide">
            <Key className="w-5 h-5 text-acid-400" />
            API Configuration
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slab-500 font-mono uppercase tracking-wider mb-2">
                Resource Gateway Token
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-slab-900 border-2 border-slab-700 text-slab-100 px-4 py-3 pr-12 font-mono focus:border-acid-500 focus:outline-none transition-colors placeholder:text-slab-600"
                  placeholder="> Enter your API token"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slab-500 hover:text-acid-400 transition-colors"
                >
                  {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-slab-600 font-mono mt-2">
                Get your token from the Apify console
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="salvage-card p-6">
          <h2 className="font-display text-lg text-slab-100 mb-6 flex items-center gap-2 uppercase tracking-wide">
            <Bell className="w-5 h-5 text-acid-400" />
            Notifications
          </h2>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="text-slab-100 font-mono text-sm uppercase tracking-wider">Operation Alerts</div>
                <div className="text-xs text-slab-500 font-mono mt-1">Get notified when operations complete or fail</div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 border-2 transition-colors ${notifications ? 'bg-acid-500/20 border-acid-500' : 'bg-slab-800 border-slab-600'}`}>
                  <div className={`w-4 h-4 mt-0.5 transition-transform ${notifications ? 'translate-x-6 bg-acid-500' : 'translate-x-1 bg-slab-500'}`} />
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Data Retention */}
        <div className="salvage-card p-6">
          <h2 className="font-display text-lg text-slab-100 mb-6 flex items-center gap-2 uppercase tracking-wide">
            <Database className="w-5 h-5 text-acid-400" />
            Data Retention
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slab-500 font-mono uppercase tracking-wider mb-2">
                Keep Data For
              </label>
              <select
                value={retention}
                onChange={(e) => setRetention(e.target.value)}
                className="w-full bg-slab-900 border-2 border-slab-700 text-slab-100 px-4 py-3 font-mono focus:border-acid-500 focus:outline-none transition-colors"
              >
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="salvage-card p-6">
          <h2 className="font-display text-lg text-slab-100 mb-6 flex items-center gap-2 uppercase tracking-wide">
            <Shield className="w-5 h-5 text-acid-400" />
            Security
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border-2 border-slab-700 bg-slab-800/50">
              <div>
                <div className="text-slab-100 font-mono text-sm uppercase tracking-wider">Two-Factor Auth</div>
                <div className="text-xs text-slab-500 font-mono mt-1">Add an extra layer of security</div>
              </div>
              <button className="salvage-btn-secondary text-sm">
                ENABLE
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 border-2 border-slab-700 bg-slab-800/50">
              <div>
                <div className="text-slab-100 font-mono text-sm uppercase tracking-wider">Active Sessions</div>
                <div className="text-xs text-slab-500 font-mono mt-1">Manage your logged-in devices</div>
              </div>
              <button className="salvage-btn-secondary text-sm">
                VIEW
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="salvage-btn inline-flex items-center gap-2">
            <Save className="w-4 h-4" />
            SAVE CONFIG
          </button>
        </div>
      </main>
    </div>
  )
}
