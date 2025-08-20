"use client";

import { useEffect, useState } from 'react';
import { useDashboardRealTime } from '@/hooks/useRealTime';
import { trackBarangayEvent } from '@/lib/posthog';
import { Bell, Wifi, WifiOff, Activity, Users, MessageSquare } from 'lucide-react';

interface RealTimeNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
}

export function RealTimeDashboard() {
  const { notifications, isConnected } = useDashboardRealTime();
  const [realtimeNotifications, setRealtimeNotifications] = useState<RealTimeNotification[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);

  useEffect(() => {
    // Track real-time feature usage
    if (isConnected) {
      trackBarangayEvent.collaborationSession('dashboard', onlineUsers);
    }
  }, [isConnected, onlineUsers]);

  useEffect(() => {
    // Convert pusher notifications to our format
    const formatted = notifications.map((notif, index) => ({
      id: `realtime-${Date.now()}-${index}`,
      type: notif.type || 'info',
      title: notif.title || 'Update',
      message: notif.message || 'Something happened',
      timestamp: new Date(),
      userId: notif.userId,
      userName: notif.userName,
    }));

    setRealtimeNotifications(formatted);
  }, [notifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'project': return '🏗️';
      case 'task': return '✅';
      case 'event': return '📅';
      case 'goal': return '🎯';
      case 'announcement': return '📢';
      default: return '📋';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center gap-2 text-sm">
        {isConnected ? (
          <>
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-green-400">Connected</span>
            <span className="text-gray-400">•</span>
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">{onlineUsers} online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-red-400" />
            <span className="text-red-400">Disconnected</span>
          </>
        )}
      </div>

      {/* Real-time Notifications */}
      {realtimeNotifications.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-medium text-gray-100">Live Updates</h3>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {realtimeNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 p-2 bg-gray-750 rounded-lg text-sm"
              >
                <span className="text-lg">
                  {getNotificationIcon(notification.type)}
                </span>
                
                <div className="flex-1 min-w-0">
                  <p className="text-gray-200 font-medium">
                    {notification.title}
                  </p>
                  <p className="text-gray-400 text-xs line-clamp-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(notification.timestamp)}
                    </span>
                    {notification.userName && (
                      <>
                        <span className="text-gray-600">•</span>
                        <span className="text-xs text-gray-500">
                          {notification.userName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Pulse Indicator */}
      {isConnected && realtimeNotifications.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live activity detected</span>
        </div>
      )}
    </div>
  );
}
