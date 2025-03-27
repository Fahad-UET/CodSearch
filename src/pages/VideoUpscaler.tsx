import React from 'react';
import { Maximize2 } from 'lucide-react';
import ToolLayout from '@/components/AICreator/ToolLayout';

function VideoUpscaler() {
  return (
    <ToolLayout
      title="Upscaler"
      description="Enhance video resolution with AI"
      controls={<div>Coming soon...</div>}
      result={<div>Coming soon...</div>}
      onHistoryItemClick={() => {}}
    />
  );
}

export default VideoUpscaler;
