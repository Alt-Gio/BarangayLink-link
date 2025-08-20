"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Bell, BellOff, X, Check } from 'lucide-react';
import { initOneSignal, subscribeUser, getSubscriptionStatus, setUserTags } from '@/lib/onesignal';
import { useAuth } from '@/context/AuthContext';

interface NotificationPermissionState {
  isSupported: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
  showPrompt: boolean;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser } = useUser();
  const { user: dbUser } = useAuth();
  const [permissionState, setPermissionState] = useState<NotificationPermissionState>({
    isSupported: false,
    isSubscribed: false,
    isLoading: true,
    showPrompt: false,
  });

  useEffect(() => {
    const initNotifications = async () => {
      try {
        // Initialize OneSignal
        await initOneSignal();
        
        // Get subscription status
        const status = await getSubscriptionStatus();
        
        setPermissionState(prev => ({
          ...prev,
          isSupported: status.isPushSupported,
          isSubscribed: status.isSubscribed,
          isLoading: false,
          showPrompt: status.isPushSupported && !status.isSubscribed,
        }));

        // Set user tags for targeting if user is authenticated
        if (dbUser && status.isSubscribed) {
          try {
            await setUserTags({
              user_role: dbUser.role,
              user_position: dbUser.position,
              barangay_member: 'true',
              notification_preferences: 'all' // Can be customized based on user preferences
            });
          } catch (error) {
            console.warn('Failed to set user tags:', error);
          }
        }
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
        // Set default state on error
        setPermissionState(prev => ({ 
          ...prev, 
          isLoading: false,
          isSupported: false,
          isSubscribed: false,
          showPrompt: false
        }));
      }
    };

    initNotifications();
  }, [dbUser]);

  const handleSubscribe = async () => {
    setPermissionState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const success = await subscribeUser(
        clerkUser?.id,
        dbUser ? {
          user_role: dbUser.role,
          user_position: dbUser.position,
          user_name: dbUser.name,
          barangay_member: 'true'
        } : undefined
      );

      if (success) {
        setPermissionState(prev => ({
          ...prev,
          isSubscribed: true,
          showPrompt: false,
          isLoading: false,
        }));
      } else {
        setPermissionState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Failed to subscribe to notifications:', error);
      setPermissionState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDismiss = () => {
    setPermissionState(prev => ({ ...prev, showPrompt: false }));
    
    // Remember user's choice for this session
    sessionStorage.setItem('notification-prompt-dismissed', 'true');
  };

  // Check if user has already dismissed the prompt this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('notification-prompt-dismissed');
    if (dismissed) {
      setPermissionState(prev => ({ ...prev, showPrompt: false }));
    }
  }, []);

  return (
    <>
      {children}
      
      {/* Notification Permission Prompt */}
      {permissionState.showPrompt && !permissionState.isLoading && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-100 text-sm">
                  Stay Updated
                </h3>
                <p className="text-gray-400 text-xs mt-1 line-clamp-3">
                  Get notified about important barangay announcements, project updates, and events
                </p>
                
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={handleSubscribe}
                    disabled={permissionState.isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {permissionState.isLoading ? (
                      <div className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    {permissionState.isLoading ? 'Setting up...' : 'Allow Notifications'}
                  </button>
                  
                  <button
                    onClick={handleDismiss}
                    className="px-3 py-1.5 text-gray-400 text-xs font-medium rounded-lg hover:text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    Not now
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleDismiss}
                className="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Notification status indicator component
export function NotificationStatus() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await getSubscriptionStatus();
        setIsSubscribed(status.isSubscribed);
      } catch (error) {
        console.error('Failed to check notification status:', error);
        setIsSubscribed(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      {isSubscribed ? (
        <>
          <Bell className="w-3.5 h-3.5 text-green-400" />
          <span>Notifications enabled</span>
        </>
      ) : (
        <>
          <BellOff className="w-3.5 h-3.5" />
          <span>Notifications disabled</span>
        </>
      )}
    </div>
  );
}
