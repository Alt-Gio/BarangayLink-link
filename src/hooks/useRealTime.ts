import { useEffect, useRef, useState } from 'react';
import { pusherClient, REALTIME_EVENTS, CHANNELS } from '@/lib/pusher';
import { Channel } from 'pusher-js';

interface UseRealTimeOptions {
  enabled?: boolean;
  onReconnect?: () => void;
}

export function useRealTime(options: UseRealTimeOptions = {}) {
  const { enabled = true, onReconnect } = options;
  const [isConnected, setIsConnected] = useState(false);
  const channelsRef = useRef<Map<string, Channel>>(new Map());

  useEffect(() => {
    if (!enabled) return;

    const handleConnectionStateChange = () => {
      const state = pusherClient.connection.state;
      setIsConnected(state === 'connected');
      
      if (state === 'connected' && onReconnect) {
        onReconnect();
      }
    };

    pusherClient.connection.bind('state_change', handleConnectionStateChange);
    handleConnectionStateChange(); // Set initial state

    return () => {
      pusherClient.connection.unbind('state_change', handleConnectionStateChange);
    };
  }, [enabled, onReconnect]);

  const subscribe = (channelName: string) => {
    if (channelsRef.current.has(channelName)) {
      return channelsRef.current.get(channelName)!;
    }

    const channel = pusherClient.subscribe(channelName);
    channelsRef.current.set(channelName, channel);
    return channel;
  };

  const unsubscribe = (channelName: string) => {
    const channel = channelsRef.current.get(channelName);
    if (channel) {
      pusherClient.unsubscribe(channelName);
      channelsRef.current.delete(channelName);
    }
  };

  const unsubscribeAll = () => {
    channelsRef.current.forEach((_, channelName) => {
      pusherClient.unsubscribe(channelName);
    });
    channelsRef.current.clear();
  };

  return {
    isConnected,
    subscribe,
    unsubscribe,
    unsubscribeAll,
    pusherClient,
  };
}

// Specific hooks for different use cases
export function useProjectRealTime(projectId: string | null) {
  const { subscribe, unsubscribe, isConnected } = useRealTime();
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    if (!projectId) return;

    const channelName = CHANNELS.PROJECT(projectId);
    const channel = subscribe(channelName);

    const handleProjectUpdate = (data: any) => {
      setUpdates(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 updates
    };

    channel.bind(REALTIME_EVENTS.PROJECT_UPDATED, handleProjectUpdate);
    channel.bind(REALTIME_EVENTS.TASK_UPDATED, handleProjectUpdate);
    channel.bind(REALTIME_EVENTS.TASK_ASSIGNED, handleProjectUpdate);

    return () => {
      unsubscribe(channelName);
    };
  }, [projectId, subscribe, unsubscribe]);

  return { updates, isConnected };
}

export function useTaskRealTime(taskId: string | null) {
  const { subscribe, unsubscribe, isConnected } = useRealTime();
  const [comments, setComments] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!taskId) return;

    const channelName = CHANNELS.TASK(taskId);
    const channel = subscribe(channelName);

    const handleCommentAdded = (data: any) => {
      setComments(prev => [data, ...prev]);
    };

    const handleUserTyping = (data: { userId: string; userName: string }) => {
      setTypingUsers(prev => 
        prev.includes(data.userName) ? prev : [...prev, data.userName]
      );
      
      // Remove typing user after 3 seconds
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(name => name !== data.userName));
      }, 3000);
    };

    const handleUserStoppedTyping = (data: { userName: string }) => {
      setTypingUsers(prev => prev.filter(name => name !== data.userName));
    };

    channel.bind(REALTIME_EVENTS.COMMENT_ADDED, handleCommentAdded);
    channel.bind(REALTIME_EVENTS.USER_TYPING, handleUserTyping);
    channel.bind(REALTIME_EVENTS.USER_STOPPED_TYPING, handleUserStoppedTyping);

    return () => {
      unsubscribe(channelName);
    };
  }, [taskId, subscribe, unsubscribe]);

  return { comments, typingUsers, isConnected };
}

export function useDashboardRealTime() {
  const { subscribe, unsubscribe, isConnected } = useRealTime();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const channel = subscribe(CHANNELS.DASHBOARD);

    const handleNotification = (data: any) => {
      setNotifications(prev => [data, ...prev.slice(0, 4)]); // Keep last 5 notifications
    };

    channel.bind(REALTIME_EVENTS.PROJECT_UPDATED, handleNotification);
    channel.bind(REALTIME_EVENTS.TASK_ASSIGNED, handleNotification);
    channel.bind(REALTIME_EVENTS.GOAL_UPDATED, handleNotification);
    channel.bind(REALTIME_EVENTS.MILESTONE_COMPLETED, handleNotification);
    channel.bind(REALTIME_EVENTS.EVENT_UPDATED, handleNotification);

    return () => {
      unsubscribe(CHANNELS.DASHBOARD);
    };
  }, [subscribe, unsubscribe]);

  return { notifications, isConnected };
}
