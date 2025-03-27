import React, { useState } from 'react';
import { 
  File, Grid, List as ListIcon, Download, Share2, Trash2, 
  Search, Filter, SortAsc, Image, FileText, Film, Music, 
  Archive, FileIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { DriveFile } from '../../types/files';

interface FileListProps {
  files: DriveFile[];
  onDownload: (fileId: string) => void;
  onDelete: (fileId: string) => void;
  onShare: (fileId: string) => void;
}

const FILE_ICONS: Record<string, React.ReactNode> = {
  'image': <Image size={20} />,
  'video': <Film size={20} />,
  'audio': <Music size={20} />,
  'text': <FileText size={20} />,
  'archive': <Archive size={20} />,
  'default': <FileIcon size={20} />
};

export function FileList({ files, onDownload, onDelete, onShare }: FileListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [filterType, setFilterType] = useState<string | null>(null);

  const getFileIcon = (mimeType: string) => {
    const type = mimeType.split('/')[0];
    return FILE_ICONS[type] || FILE_ICONS.default;
  };

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const filteredFiles = files
    .filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || file.mimeType.startsWith(filterType);
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        default:
          return new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime();
      }
    });

  const fileTypes = Array.from(new Set(files.map(f => f.mimeType.split('/')[0])));

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <input
            type="search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-10 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          />
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <select
          value={filterType || ''}
          onChange={e => setFilterType(e.target.value || null)}
          className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
        >
          <option value="">All Types</option>
          {fileTypes.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>

        <button
          onClick={() => setSortBy(prev => 
            prev === 'date' ? 'name' : prev === 'name' ? 'size' : 'date'
          )}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Change sort order"
        >
          <SortAsc size={20} />
        </button>

        <button
          onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
        >
          {viewMode === 'grid' ? <ListIcon size={20} /> : <Grid size={20} />}
        </button>
      </div>

      {/* Files Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map(file => (
            <div
              key={file.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:border-purple-200 transition-all group"
            >
              <div className="aspect-square mb-4 bg-gray-50 rounded-lg flex items-center justify-center">
                {getFileIcon(file.mimeType)}
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900 truncate" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.size)}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(file.modifiedTime), { addSuffix: true })}
                </p>
              </div>

              <div className="mt-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onDownload(file.id)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={() => onShare(file.id)}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Share"
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(file.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y">
          {filteredFiles.map(file => (
            <div
              key={file.id}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 group"
            >
              <div className="p-2 bg-gray-50 rounded-lg">
                {getFileIcon(file.mimeType)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {file.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(file.modifiedTime), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDownload(file.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download size={20} />
                </button>
                <button
                  onClick={() => onShare(file.id)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Share"
                >
                  <Share2 size={20} />
                </button>
                <button
                  onClick={() => onDelete(file.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredFiles.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <File size={48} className="mx-auto mb-4 text-gray-400" />
          <p>No files found</p>
        </div>
      )}
    </div>
  );
}