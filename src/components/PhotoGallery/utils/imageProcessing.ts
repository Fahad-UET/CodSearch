import JSZip from "jszip";

async function createPhotoZip(photos: any[]): Promise<{ success: boolean; blob?: Blob; error?: string }> {
  const zip = new JSZip();
  const failedDownloads: string[] = [];
  const successfulDownloads: string[] = [];

  try {
    for (const photo of photos) {
      try {
        const response = await fetch(photo.url);
        if (!response.ok) {
          failedDownloads.push(photo.filename || photo.url);
          continue;
        }

        const blob = await response.blob();
        if (blob.size === 0) {
          failedDownloads.push(photo.filename || photo.url);
          continue;
        }

        const filename = photo.filename || `photo-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
        zip.file(filename, blob);
        successfulDownloads.push(filename);
      } catch (error) {
        failedDownloads.push(photo.filename || photo.url);
      }
    }

    if (successfulDownloads.length === 0) {
      return {
        success: false,
        error: 'No photos could be downloaded successfully'
      };
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    return {
      success: true,
      blob,
      error: failedDownloads.length > 0 
        ? `Failed to download ${failedDownloads.length} photos: ${failedDownloads.join(', ')}`
        : undefined
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create ZIP file: ' + (error instanceof Error ? error.message : 'Unknown error')
    };
  }
}