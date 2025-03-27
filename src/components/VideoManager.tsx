import React, { useState } from 'react';
import {
  Video as VideoIcon,
  Plus,
  GripVertical,
  Pencil,
  Save,
  X,
  Trash2,
  Check,
} from 'lucide-react';
// to resolve build issue please check this
// import { Video } from '../types/variable';
import YouTubeIcon from './YoutubeIcon';
import {
  addYouTubeVideo,
  deleteYouTubeVideo,
  updateYouTubeVideo,
} from '../services/firebase/YoutubeVideos';
import Notification from '@/components/Notification';

interface VideoManagerProps {
  // to resolve build issue please check this
  // videos: Video[];
  // onVideosChange: (videos: Video[]) => void;
  videos: any[];
  onVideosChange: (videos: any[]) => void;
}

const VideoManager: React.FC<VideoManagerProps> = ({ videos, onVideosChange }) => {
  const [newVideo, setNewVideo] = useState({ title: '', videoId: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  // to resolve build issue please check this
  // const [draggedItem, setDraggedItem] = useState<Video | null>(null);
  const [draggedItem, setDraggedItem] = useState<any | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  // to resolve build issue please check this
  // const handleDragStart = (video: Video) => {
  const handleDragStart = (video: any) => {
    setDraggedItem(video);
  };
  // to resolve build issue please check this
  // const handleDragOver = (e: React.DragEvent, targetVideo: Video) => {
  const handleDragOver = (e: React.DragEvent, targetVideo: any) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetVideo.id) return;

    const newVideos = [...videos];
    const draggedIndex = newVideos.findIndex(v => v.id === draggedItem.id);
    const targetIndex = newVideos.findIndex(v => v.id === targetVideo.id);

    newVideos.splice(draggedIndex, 1);
    newVideos.splice(targetIndex, 0, draggedItem);

    // Update order numbers
    newVideos.forEach((video, index) => {
      video.order = index;
    });

    onVideosChange(newVideos);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleAddVideo = async () => {
    if (!newVideo.title.trim() || !newVideo.videoId.trim()) return;

    const videoIdMatch = newVideo.videoId.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/
    );
    const cleanVideoId = videoIdMatch ? videoIdMatch[1] : newVideo.videoId;
    try {
      const result = await addYouTubeVideo({ title: newVideo.title, videoId: cleanVideoId });
      if (result) {
        // to resolve build issue please check this
        // const newVideoItem: Video = {
        const newVideoItem: any = {
          id: result,
          title: newVideo.title,
          videoId: cleanVideoId,
        };

        onVideosChange([...videos, newVideoItem]);
        setNewVideo({ title: '', videoId: '' });
      }
      setNotification({
        show: true,
        message: result ? 'Video added successfully.' : 'There is some error while adding video',
        type: result ? 'success' : 'error',
      });
    } catch (error) {
      setNotification({
        show: true,
        message: 'There is some error while adding video',
        type: 'error',
      });
    }
  };
// to resolve build issue please check this
// const handleUpdateVideo = async (video: Video) => {
  const handleUpdateVideo = async (video: any) => {
    try {
      const result = await updateYouTubeVideo(video.id, video);
      result
        ? setNotification({ show: true, message: 'Video updated successfully.', type: 'success' })
        : setNotification({
            show: true,
            message: 'There is some error while updating the video.',
            type: 'error',
          });
      if (result) {
        const updatedVideos = videos?.map(v => (v.id === video.id ? video : v));
        onVideosChange(updatedVideos);
        setEditingId(null);
      }
    } catch (error) {
      console.log('There is some error while updating the video.');
    }
  };
  // to resolve build issue please check this
  // const updateVideoData = (video: Video) => {
  const updateVideoData = (video: any) => {
    const updatedVideos = videos?.map(v => (v.id === video.id ? video : v));
    onVideosChange(updatedVideos);
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const result = await deleteYouTubeVideo(videoId);
      result
        ? setNotification({ show: true, message: 'Video deleted successfully.', type: 'success' })
        : setNotification({
            show: true,
            message: 'There is some error while deleting the video.',
            type: 'error',
          });
      if (result) {
        const updatedVideos = videos?.filter(v => v.id !== videoId)?.map(video => ({ ...video }));
        onVideosChange(updatedVideos);
      }
    } catch (error) {
      console.log('There is some error while deleting the video.');
    }
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto bg-gradient-to-br from-slate-900/50 to-slate-800/50 
      rounded-2xl p-6 backdrop-blur-xl border border-white/10"
    >
      {/* Add New Video Form */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white/90 mb-4 flex items-center gap-2">
          <VideoIcon className="w-5 h-5 text-purple-400" />
          Add New Video
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Video Title"
            value={newVideo.title}
            onChange={e => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white/90 
              placeholder:text-white/30 focus:outline-none focus:border-purple-500/50
              transition-colors duration-300"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="YouTube Video ID or URL"
              value={newVideo.videoId}
              onChange={e => setNewVideo(prev => ({ ...prev, videoId: e.target.value }))}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 
                text-white/90 placeholder:text-white/30 focus:outline-none 
                focus:border-purple-500/50 transition-colors duration-300"
            />
            <button
              onClick={handleAddVideo}
              className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300
                px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
            >
              <Plus size={20} />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Video List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white/90 mb-4 flex items-center gap-2">
          <YouTubeIcon size={20} className="text-red-500" />
          Video List
        </h3>
        {!videos.length ? (
          <p className="text-white">No videos added yet.</p>
        ) : (
          videos?.map(video => (
            <div
              key={video.id}
              draggable
              onDragStart={() => handleDragStart(video)}
              onDragOver={e => handleDragOver(e, video)}
              onDragEnd={handleDragEnd}
              className={`group bg-white/5 border border-white/10 rounded-lg p-6
              hover:bg-white/10 transition-all duration-300
              ${draggedItem?.id === video.id ? 'opacity-50' : ''}
              mb-4 last:mb-0`}
            >
              <div className="flex items-center gap-4">
                <div className="cursor-move text-white/40 hover:text-white/60 transition-colors">
                  <GripVertical size={20} />
                </div>

                {editingId === video.id ? (
                  <div className="flex-1 flex items-center gap-4">
                    <input
                      type="text"
                      value={video.title}
                      onChange={e => updateVideoData({ ...video, title: e.target.value })}
                      className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-1
                      text-white/90 focus:outline-none focus:border-purple-500/50
                      text-base"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateVideo(video)}
                        className="text-green-400 hover:text-green-300 transition-colors"
                      >
                        <Save size={20} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-white/90 text-base">{video.title}</span>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingId(video.id)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div></div>
      <Notification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        setNotification={() => setNotification(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default VideoManager;
