import { useEffect } from 'react';
import { useProductStore } from '../store';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { getUserSubscription } from '../services/firebase/subscriptions';

export function useSubscription() {
  const { user } = useProductStore();
  const { setCurrentSubscription } = useSubscriptionStore();

  useEffect(() => {
    if (!user) return;

    const loadSubscription = async () => {
      try {
        const subscription = await getUserSubscription(user.uid);
        setCurrentSubscription(subscription);
      } catch (error) {
        console.error('Failed to load subscription:', error);
      }
    };

    loadSubscription();
  }, [user, setCurrentSubscription]);
}