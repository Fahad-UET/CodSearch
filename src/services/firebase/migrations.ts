import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { db } from './config';
import { createUserSubscription } from './subscriptions';

export async function migrateExistingUsers() {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const batch = writeBatch(db);
    
    for (const userDoc of snapshot.docs) {
      const userId = userDoc.id;
      // Create starter subscription for existing users
      await createUserSubscription(userId);
    }

    await batch.commit();
  } catch (error) {
    console.error('Failed to migrate users:', error);
    throw error;
  }
}