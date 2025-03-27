import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle } from 'lucide-react';
import { useGoogleDrive } from '../../hooks/useGoogleDrive';

interface DriveUploaderProps {
  productId: string;
  onUploadComplete?: () => void;
}

export function DriveUploader({ productId, onUploadComplete }: DriveUploaderProps) {
  const { uploadFiles, createFolderStructure } = useGoogleDrive();
  const [error, setError] = React.useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<Record<string, number>>({});

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    
    try {
      // Create folder structure for product
      const folderId = await createFolderStructure(productId);
      
      // Upload each file
      const uploadPromises = acceptedFiles.map(async file => {
        try {
          await uploadFiles({
            file,
            folderId,
            onProgress: (progress) => {
              setUploadProgress(prev => ({
                ...prev,
                [file.name]: Math.round(progress)
              }));
            }
          });
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err);
          setError(`Failed to upload ${file.name}`);
        }
      });

      await Promise.all(uploadPromises);
      onUploadComplete?.();
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload files to Google Drive');
    }
  }, [productId, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragActive
            ? 'border-purple-400 bg-purple-50'
            : 'border-gray-300 hover:border-purple-300'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <Upload
            size={40}
            className={isDragActive ? 'text-purple-500' : 'text-gray-400'}
          />
          <div>
            <p className="text-sm font-medium text-gray-700">
              {isDragActive
                ? 'Drop files here...'
                : 'Drag & drop files here, or click to select'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Files will be uploaded to Google Drive
            </p>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {Object.entries(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileName}
                  </p>
                  <div className="mt-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}