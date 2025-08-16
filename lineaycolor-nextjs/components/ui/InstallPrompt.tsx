"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Check if prompt was previously dismissed
    const promptDismissed = localStorage.getItem("pwa-prompt-dismissed");
    const dismissedDate = promptDismissed ? new Date(promptDismissed) : null;
    const daysSinceDismissed = dismissedDate 
      ? (new Date().getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      : Infinity;

    // Show prompt again after 7 days
    if (dismissedDate && daysSinceDismissed < 7) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // For iOS, show custom instructions after delay
    if (isIOSDevice && !window.navigator.standalone) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("PWA installed");
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", new Date().toISOString());
  };

  const handleIOSInstall = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", new Date().toISOString());
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-sm z-50"
        >
          <div className="bg-white rounded-lg shadow-2xl p-6 border border-gray-100">
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Download className="text-accent" size={24} />
              </div>
              
              <div className="flex-grow">
                <h3 className="font-serif text-lg font-bold text-primary mb-1">
                  Install Lineaycolor App
                </h3>
                
                {isIOS ? (
                  <>
                    <p className="text-sm text-gray-600 mb-3">
                      Install our app for the best shopping experience. Tap the share button and select &quot;Add to Home Screen&quot;.
                    </p>
                    <button
                      onClick={handleIOSInstall}
                      className="text-sm font-medium text-accent hover:text-primary transition-colors"
                    >
                      Got it
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-3">
                      Get quick access to our collections and exclusive offers.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleInstall}
                        className="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-opacity-90 transition-all"
                      >
                        Install
                      </button>
                      <button
                        onClick={handleDismiss}
                        className="px-4 py-2 text-gray-600 text-sm font-medium hover:text-primary transition-colors"
                      >
                        Not now
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}