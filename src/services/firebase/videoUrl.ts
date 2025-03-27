import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './config';

export const getUserVideosUrl = async (userId: string) => {
  try {
    if (!userId) {
      console.warn('No userId provided, returning empty video list');
      return [];
    }

    const videosRef = collection(db, 'ads');
    const q = query(videosRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    const videos = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return videos;
  } catch (error) {
    console.error('Failed to fetch user videos:', error);
    return [];
  }
};

export const createVideoUrl = async (userId: string, videoData: Record<string, any>) => {
  try {
    if (!userId) {
      throw new Error('userId are required');
    }

    const videoRef = doc(collection(db, 'ads'));
    const data = {
      ...videoData, // Spread additional fields like rating and type
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(videoRef, data);

    return { ...data, id: videoRef.id };
  } catch (error) {
    console.error('Failed to create video:', error);
    throw error;
  }
};

export const updateVideoUrl = async (videoId: string, updates: Record<string, any>) => {
  try {
    if (!videoId || !updates || Object.keys(updates).length === 0) {
      throw new Error('videoId and at least one update field are required');
    }

    const videoRef = doc(db, 'ads', videoId);
    const updatedData = { ...updates, updatedAt: serverTimestamp() };

    await updateDoc(videoRef, updatedData);

    const videoSnap = await getDoc(videoRef);
    if (!videoSnap.exists()) {
      throw new Error('Video not found after update');
    }

    return { ...videoSnap.data(), id: videoId };
  } catch (error) {
    console.error('Failed to update video:', error);
    throw error;
  }
};

export const deleteVideoUrl = async (videoId: string) => {
  try {
    if (!videoId) {
      throw new Error('videoId is required');
    }

    const videoRef = doc(db, 'ads', videoId);
    await deleteDoc(videoRef);
  } catch (error) {
    console.error('Failed to delete video:', error);
    throw error;
  }
};
