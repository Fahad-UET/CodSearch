import {  db, storage } from './config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';

type aiContent = {
  response?: string;
  prompt?: string;
  source?: string;
  imageUrl?: string;
  sourceImage?: string;
  systemPrompt?: string;
  reasoning?: string;
  seed?: string;
  videoUrl?: string;
  aspectRatio?: string;
  duration?: string;
  audioUrl?: string;
};
interface AiProps {
  content: aiContent;
  type: string;
  userId: string;
  id: string;
  currentTime: number
}
export interface audioUrlProps {
  userId: string;
  id: String;
  buffer: Uint8Array
}

export const audioUrl = async ({userId, id, buffer} : audioUrlProps) => {
  try {
    const audioBlob = new Blob([buffer], { type: 'audio/mpeg' });
    const audioRef = ref(storage, `users/${userId}/audio/${id}.mp3`);
    await uploadBytes(audioRef, audioBlob);
    const audioUrl = await getDownloadURL(audioRef);
    return audioUrl
  } catch (error) {
      console.log(error)
  }
}

// ✅ Create a new video record with timestamps
export const addAiGeneration = async ({ userId, id, currentTime, ...aiData }: AiProps) => {
  try {
    const aiDataCollection = collection(db, 'users', userId, 'aiGenerations');
    const docRef = await addDoc(aiDataCollection, {
      ...aiData,
      id: id,
      createdAt: currentTime, // Stores the creation time
      updatedAt: serverTimestamp(), // Initially, same as createdAt
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding video:', error);
    return null;
  }
};

// Get all videos
export const getAiGenerations = async (userId: string, id: string) => {
  if (!userId) return null;
  try {
    const querySnapshot = query(
      collection(db, 'users', userId, 'aiGenerations'),
      where('id', '==', id)
    );
    const snapshot = await getDocs(querySnapshot);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching videos:', error);
    return null;
  }
};

export const getAllAiGenerations = async (userId: string) => {
  try {
    const querySnapshot = collection(db, 'users', userId, 'aiGenerations');
    const snapshot = await getDocs(querySnapshot);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching videos:', error);
    return null;
  }
};
// Get a video by ID
