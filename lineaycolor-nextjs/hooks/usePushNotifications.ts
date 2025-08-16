"use client";

import { useState, useEffect, useCallback } from "react";

interface PushNotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  subscription: PushSubscription | null;
}

export function usePushNotifications() {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: "default",
    subscription: null,
  });

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator) {
      setState(prev => ({
        ...prev,
        isSupported: true,
        permission: Notification.permission,
      }));

      // Get existing subscription
      navigator.serviceWorker.ready.then(async (registration) => {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          setState(prev => ({ ...prev, subscription }));
        }
      });
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!state.isSupported) {
      console.error("Push notifications are not supported");
      return false;
    }

    const permission = await Notification.requestPermission();
    setState(prev => ({ ...prev, permission }));

    if (permission === "granted") {
      return subscribeToNotifications();
    }

    return false;
  }, [state.isSupported]);

  const subscribeToNotifications = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Generate VAPID key (in production, this should come from your server)
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 
        "BKd0G1s3X5H1YXBgSZvTxMGwmfKfWZRYHMhYWmM4oKJH3YX_jFhCqP5rRYQMjhv5NMxHqQQGWqpFGlIOgR-vH0U";
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
      });

      setState(prev => ({ ...prev, subscription }));

      // Send subscription to server
      await sendSubscriptionToServer(subscription);

      return true;
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
      return false;
    }
  }, []);

  const unsubscribeFromNotifications = useCallback(async () => {
    if (!state.subscription) return false;

    try {
      await state.subscription.unsubscribe();
      setState(prev => ({ ...prev, subscription: null }));
      
      // Remove subscription from server
      await removeSubscriptionFromServer(state.subscription);
      
      return true;
    } catch (error) {
      console.error("Failed to unsubscribe from push notifications:", error);
      return false;
    }
  }, [state.subscription]);

  const sendTestNotification = useCallback(async () => {
    if (!state.isSupported || state.permission !== "granted") {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Show notification
      await registration.showNotification("Lineaycolor", {
        body: "Welcome to our exclusive fashion collection!",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        tag: "welcome-notification",
        actions: [
          { action: "explore", title: "Explore Collections" },
          { action: "close", title: "Close" },
        ],
      } as NotificationOptions);
      
      return true;
    } catch (error) {
      console.error("Failed to show notification:", error);
      return false;
    }
  }, [state.isSupported, state.permission]);

  return {
    ...state,
    requestPermission,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    sendTestNotification,
  };
}

// Helper functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

async function sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
  // In production, send this to your server
  console.log("Subscription to send to server:", subscription.toJSON());
  
  // Example API call:
  // await fetch('/api/notifications/subscribe', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(subscription.toJSON()),
  // });
}

async function removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
  // In production, remove this from your server
  console.log("Subscription to remove from server:", subscription.toJSON());
  
  // Example API call:
  // await fetch('/api/notifications/unsubscribe', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ endpoint: subscription.endpoint }),
  // });
}