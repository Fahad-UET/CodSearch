import React, { useState, useEffect } from 'react';
import { X, HardDrive, Upload, List } from 'lucide-react';
import { DriveFileUploader } from './DriveFileUploader';
import { FileList } from './FileList';
import { useGoogleDrive } from '../../hooks/useGoogleDrive';
import { DriveFile } from '../../types/files';

interface FileManagerProps {
  productId: string;
  onClose: () => void;
  embedded?: boolean;
}

export function FileManager({ productId, onClose, embedded = false }: FileManagerProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'list'>('list');
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { listFiles, deleteFile, shareFile } = useGoogleDrive();

  const loadFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const driveFiles: any = await listFiles(productId);
      setFiles(driveFiles);
    } catch (err) {
      setError('Failed to load files');
      console.error('Failed to load files:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [productId]);

  const handleDownload = async (fileId: string) => {
    // Implement download logic
  };

  const handleDelete = async (fileId: string) => {
    try {
      await deleteFile(fileId);
      await loadFiles(); // Refresh list
    } catch (err) {
      setError('Failed to delete file');
    }
  };

  const handleShare = async (fileId: string) => {
    try {
      const shareUrl = await shareFile(fileId, 'user@example.com');
      // Handle successful share - maybe show the URL in a modal
    } catch (err) {
      setError('Failed to share file');
    }
  };

  const mainContent = (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'list'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <List size={16} />
            Files
          </div>
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'upload'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Upload size={16} />
            Upload
          </div>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'upload' ? (
        <DriveFileUploader
          productId={productId}
          onUploadComplete={loadFiles}
        />
      ) : (
        <FileList
          files={files}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onShare={handleShare}
        />
      )}
    </div>
  );

  if (embedded) {
    return mainContent;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-md z-[200] flex items-center justify-center">
      <div className="relative w-full max-w-7xl h-[90vh] mx-4 bg-gradient-to-br from-white via-purple-50 to-indigo-50 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
        <div className="flex justify-between items-center p-6 border-b border-purple-100">
          <div className="flex items-center gap-3">
            <HardDrive size={24} className="text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">File Manager</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-5rem)]">
          {mainContent}
        </div>
      </div>
    </div>
  );
}