"use client";

import { useEffect, useState } from 'react';
import { initOneSignal, getSubscriptionStatus, subscribeUser } from '@/lib/onesignal';

export default function TestOneSignalPage() {
  const [status, setStatus] = useState<string>('Loading...');
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  useEffect(() => {
    const testOneSignal = async () => {
      try {
        setStatus('Initializing OneSignal...');
        await initOneSignal();
        
        setStatus('Getting subscription status...');
        const subStatus = await getSubscriptionStatus();
        setSubscriptionStatus(subStatus);
        
        setStatus('OneSignal test completed successfully!');
      } catch (error) {
        console.error('OneSignal test failed:', error);
        setStatus(`OneSignal test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    testOneSignal();
  }, []);

  const handleSubscribe = async () => {
    try {
      setStatus('Subscribing to notifications...');
      const success = await subscribeUser('test-user-id', {
        test_tag: 'test_value'
      });
      
      if (success) {
        setStatus('Successfully subscribed to notifications!');
        // Refresh status
        const subStatus = await getSubscriptionStatus();
        setSubscriptionStatus(subStatus);
      } else {
        setStatus('Failed to subscribe to notifications');
      }
    } catch (error) {
      console.error('Subscribe failed:', error);
      setStatus(`Subscribe failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">OneSignal Test Page</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <p className="text-gray-300">{status}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Subscription Status</h2>
          {subscriptionStatus ? (
            <pre className="bg-gray-900 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(subscriptionStatus, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-400">No status available</p>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <button
            onClick={handleSubscribe}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Subscribe to Notifications
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-400">
          <p>This page tests the OneSignal integration to ensure it works without crashing the application.</p>
          <p>Check the browser console for detailed logs.</p>
        </div>
      </div>
    </div>
  );
}
