import { db } from './config';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

const youtubeCollection = collection(db, 'youtubeVideos'); // Collection name

interface YouTubeVideo {
  title: string;
  videoId: string;
}

// ✅ Create a new video record with timestamps
export const addYouTubeVideo = async (videoData: YouTubeVideo) => {
  try {
    const docRef = await addDoc(youtubeCollection, {
      ...videoData,
      createdAt: serverTimestamp(), // Stores the creation time
      updatedAt: serverTimestamp(), // Initially, same as createdAt
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding video:', error);
    return null;
  }
};

// Get all videos
export const getAllYouTubeVideos = async () => {
  try {
    const querySnapshot = await getDocs(youtubeCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching videos:', error);
    return null;
  }
};

// Get a video by ID
export const getYouTubeVideoById = async (id: string) => {
  try {
    const videoRef = doc(db, 'youtubeVideos', id);
    const videoSnap = await getDoc(videoRef);
    if (videoSnap.exists()) {
      return { id: videoSnap.id, ...videoSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching video:', error);
    return null;
  }
};

// Update a video by ID
export const updateYouTubeVideo = async (id: string, updatedData: YouTubeVideo) => {
  try {
    const videoRef = doc(db, 'youtubeVideos', id);
    await updateDoc(videoRef, { ...updatedData, updatedAt: serverTimestamp() });
    return true;
  } catch (error) {
    console.error('Error updating video:', error);
    return false;
  }
};

// Delete a video by ID
export const deleteYouTubeVideo = async (id: string) => {
  try {
    const videoRef = doc(db, 'youtubeVideos', id);
    await deleteDoc(videoRef);
    return true;
  } catch (error) {
    console.error('Error deleting video:', error);
    return false;
  }
};
