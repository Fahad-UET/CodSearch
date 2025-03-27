import { useState, useCallback } from 'react';
import { google } from 'googleapis';
import { useGoogleAuth } from './useGoogleAuth';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const ROOT_FOLDER_NAME = 'cod-track.com';

interface UploadOptions {
  file: File;
  folderId: string;
  onProgress?: (progress: number) => void;
}

export function useGoogleDrive() {
  const { token, signIn } = useGoogleAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeDrive = useCallback(async () => {
    if (!token) {
      await signIn();
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: token });
    return google.drive({ version: 'v3', auth });
  }, [token, signIn]);

  const createFolder = useCallback(async (name: string, parentId?: string) => {
    try {
      const drive = await initializeDrive();
      
      const fileMetadata = {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentId ? [parentId] : undefined
      };

      const response = await drive.files.create({
        requestBody: fileMetadata,
        fields: 'id'
      });

      return response.data.id;
    } catch (error) {
      console.error('Failed to create folder:', error);
      throw error;
    }
  }, [initializeDrive]);

  const findOrCreateFolder = useCallback(async (name: string, parentId?: string) => {
    try {
      const drive = await initializeDrive();
      
      // Search for existing folder
      const query = [
        `mimeType="application/vnd.google-apps.folder"`,
        `name="${name}"`,
        ...(parentId ? [`"${parentId}" in parents`] : [])
      ].filter(Boolean).join(' and ');

      const response = await drive.files.list({
        q: query,
        fields: 'files(id, name)',
        spaces: 'drive'
      });

      if (response.data.files && response.data.files.length > 0) {
        return response.data.files[0].id;
      }

      // Create new folder if not found
      return createFolder(name, parentId);
    } catch (error) {
      console.error('Failed to find or create folder:', error);
      throw error;
    }
  }, [initializeDrive, createFolder]);

  const createFolderStructure = useCallback(async (productId: string) => {
    try {
      // Find or create root folder
      const rootFolderId = await findOrCreateFolder(ROOT_FOLDER_NAME);
      
      // Find or create product folder
      return await findOrCreateFolder(`product-${productId}`, rootFolderId);
    } catch (error) {
      console.error('Failed to create folder structure:', error);
      throw error;
    }
  }, [findOrCreateFolder]);

  const uploadFiles = useCallback(async ({ file, folderId, onProgress }: UploadOptions) => {
    try {
      const drive = await initializeDrive();
      
      const fileMetadata = {
        name: file.name,
        parents: [folderId]
      };

      const media = {
        mimeType: file.type,
        body: file
      };

      const response = await drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id',
        uploadType: 'resumable'
      }, {
        onUploadProgress: evt => {
          if (evt.bytesRead && evt.total) {
            const progress = (evt.bytesRead / evt.total) * 100;
            onProgress?.(progress);
          }
        }
      });

      return response.data.id;
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }, [initializeDrive]);

  const listFiles = useCallback(async (folderId: string) => {
    try {
      const drive = await initializeDrive();
      
      const response = await drive.files.list({
        q: `"${folderId}" in parents and trashed = false`,
        fields: 'files(id, name, mimeType, size, modifiedTime, thumbnailLink)',
        spaces: 'drive'
      });

      return response.data.files || [];
    } catch (error) {
      console.error('Failed to list files:', error);
      throw error;
    }
  }, [initializeDrive]);

  const deleteFile = useCallback(async (fileId: string) => {
    try {
      const drive = await initializeDrive();
      await drive.files.delete({ fileId });
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }, [initializeDrive]);

  const shareFile = useCallback(async (fileId: string, email: string, role: 'reader' | 'writer' = 'reader') => {
    try {
      const drive = await initializeDrive();
      
      await drive.permissions.create({
        fileId,
        requestBody: {
          type: 'user',
          role,
          emailAddress: email
        }
      });

      const response = await drive.files.get({
        fileId,
        fields: 'webViewLink'
      });

      return response.data.webViewLink;
    } catch (error) {
      console.error('Failed to share file:', error);
      throw error;
    }
  }, [initializeDrive]);

  return {
    isLoading,
    error,
    createFolderStructure,
    uploadFiles,
    listFiles,
    deleteFile,
    shareFile
  };
}