"use client";

import NotificationPreferences from "@/components/ui/NotificationPreferences";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-8">
            Settings
          </h1>
          
          <div className="max-w-2xl space-y-8">
            {/* PWA Install Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="font-serif text-2xl font-bold text-primary mb-4">
                App Installation
              </h2>
              <p className="text-gray-600 mb-4">
                Install the Lineaycolor app for the best shopping experience with offline access and push notifications.
              </p>
              <div className="flex items-center gap-2">
                {typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches ? (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    App Installed
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">
                    Look for the install prompt or use your browser&apos;s menu to install the app.
                  </span>
                )}
              </div>
            </div>
            
            {/* Notification Preferences */}
            <NotificationPreferences />
            
            {/* Privacy Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="font-serif text-2xl font-bold text-primary mb-4">
                Privacy
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Analytics</span>
                    <p className="text-xs text-gray-500">Help us improve by sharing anonymous usage data</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Marketing Communications</span>
                    <p className="text-xs text-gray-500">Receive emails about new collections and offers</p>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Cache Management */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="font-serif text-2xl font-bold text-primary mb-4">
                Offline Data
              </h2>
              <p className="text-gray-600 mb-4">
                Clear cached data to free up storage space. This won&apos;t affect your account or preferences.
              </p>
              <button
                onClick={async () => {
                  if (confirm("Are you sure you want to clear all cached data?")) {
                    try {
                      const cacheNames = await caches.keys();
                      await Promise.all(cacheNames.map(name => caches.delete(name)));
                      alert("Cache cleared successfully!");
                    } catch {
                      alert("Failed to clear cache. Please try again.");
                    }
                  }
                }}
                className="px-6 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
              >
                Clear Cache
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}