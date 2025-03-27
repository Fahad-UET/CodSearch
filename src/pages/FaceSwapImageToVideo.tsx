import React from 'react';
import { UserPlus } from 'lucide-react';
import ToolLayout from '@/components/AICreator/ToolLayout';

function FaceSwapImageToVideo() {
  return (
    <ToolLayout
      title="Face Swap"
      description="Swap faces between images and videos with AI"
      controls={<div>Coming soon...</div>}
      result={<div>Coming soon...</div>}
      onHistoryItemClick={() => {}}
    />
  );
}

export default FaceSwapImageToVideo;
