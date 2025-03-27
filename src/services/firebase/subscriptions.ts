import { collection, doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { SubscriptionTier, UserSubscription } from '@/types';
import { subscriptionTiers } from '@/store/subscriptionStore';

export async function createUserSubscription(userId: string, tierId: string = 'starter') {
  try {
    const subscriptionRef = doc(db, 'users', userId, 'subscription', 'current');
    const subscription: UserSubscription = {
      userId,
      tierId,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      isActive: true,
      autoRenew: true
    };

    await setDoc(subscriptionRef, {
      ...subscription,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return subscription;
  } catch (error) {
    console.error('Failed to create subscription:', error);
    throw error;
  }
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    const subscriptionRef = doc(db, 'users', userId, 'subscription', 'current');
    const subscriptionSnap = await getDoc(subscriptionRef);
    
    if (!subscriptionSnap.exists()) {
      // Create starter subscription if none exists
      return createUserSubscription(userId);
    }

    return subscriptionSnap.data() as UserSubscription;
  } catch (error) {
    console.error('Failed to get subscription:', error);
    throw error;
  }
}

export async function startTrial(userId: string) {
  try {
    const subscriptionRef = doc(db, 'users', userId, 'subscription', 'current');
    const subscription: UserSubscription = {
      userId,
      tierId: 'starter',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      isActive: true,
      autoRenew: false
    };

    await setDoc(subscriptionRef, {
      ...subscription,
      isTrial: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return subscription;
  } catch (error) {
    console.error('Failed to start trial:', error);
    throw error;
  }
}

export async function upgradeSubscription(userId: string, tierId: string) {
  try {
    const subscriptionRef = doc(db, 'users', userId, 'subscription', 'current');
    const subscription: UserSubscription = {
      userId,
      tierId,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      isActive: true,
      autoRenew: true
    };

    await updateDoc(subscriptionRef, {
      ...subscription,
      updatedAt: serverTimestamp()
    });

    return subscription;
  } catch (error) {
    console.error('Failed to upgrade subscription:', error);
    throw error;
  }
}