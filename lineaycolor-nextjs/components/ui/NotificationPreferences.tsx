"use client";

import { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { motion } from "framer-motion";

export default function NotificationPreferences() {
  const {
    isSupported,
    permission,
    subscription,
    requestPermission,
    unsubscribeFromNotifications,
    sendTestNotification,
  } = usePushNotifications();

  const [isLoading, setIsLoading] = useState(false);

  const handleToggleNotifications = async () => {
    setIsLoading(true);

    try {
      if (subscription) {
        await unsubscribeFromNotifications();
      } else {
        const success = await requestPermission();
        if (success) {
          // Send welcome notification
          setTimeout(() => {
            sendTestNotification();
          }, 1000);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            subscription ? "bg-accent/10" : "bg-gray-100"
          }`}>
            {subscription ? (
              <Bell className="text-accent" size={24} />
            ) : (
              <BellOff className="text-gray-400" size={24} />
            )}
          </div>
        </div>
        
        <div className="flex-grow">
          <h3 className="font-serif text-lg font-bold text-primary mb-1">
            Push Notifications
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            {subscription
              ? "You&apos;re subscribed to notifications about new collections and exclusive offers."
              : "Get notified about new collections, exclusive offers, and special events."}
          </p>
          
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleNotifications}
              disabled={isLoading || permission === "denied"}
              className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${
                subscription
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-primary text-white hover:bg-opacity-90"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                "Processing..."
              ) : subscription ? (
                "Unsubscribe"
              ) : permission === "denied" ? (
                "Notifications Blocked"
              ) : (
                "Subscribe"
              )}
            </motion.button>
            
            {permission === "denied" && (
              <p className="text-xs text-red-500">
                Please enable notifications in your browser settings.
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Notification Types */}
      {subscription && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="font-medium text-sm text-primary mb-3">
            Notification Preferences
          </h4>
          
          <div className="space-y-3">
            {[
              { id: "new-collections", label: "New Collections", default: true },
              { id: "sales", label: "Sales & Promotions", default: true },
              { id: "back-in-stock", label: "Back in Stock", default: false },
              { id: "order-updates", label: "Order Updates", default: true },
            ].map((type) => (
              <label
                key={type.id}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  defaultChecked={type.default}
                  className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <span className="text-sm text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}