// import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

// const ffmpeg = createFFmpeg({
//   log: true,
//   corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
// });

export async function extractAudio(
  videoFile: File | Blob | string,
  format: string = 'mp3',
  quality: string = 'high',
  onProgress?: (progress: number) => void
): Promise<Blob> {
  try {
    // Load FFmpeg
    // if (!ffmpeg.isLoaded()) {
    //   onProgress?.(0);
    //   await ffmpeg.load();
    // }

    onProgress?.(20);

    // Handle input file
    let inputData;
    if (typeof videoFile === 'string') {
      // Handle remote URL
      const response = await fetch(videoFile);
      const buffer = await response.arrayBuffer();
      inputData = new Uint8Array(buffer);
    }
    // else {
    //   // Handle File or Blob
    //   inputData = await fetchFile(videoFile);
    // }

    // Write input file
    // ffmpeg.FS('writeFile', 'input.mp4', inputData);
    onProgress?.(40);

    // Set quality parameters
    let outputArgs: string[] = [];
    switch (format) {
      case 'mp3':
        const bitrate = quality === 'high' ? '320k' : quality === 'medium' ? '192k' : '128k';
        outputArgs = ['-q:a', '0', '-b:a', bitrate];
        break;
      case 'wav':
        // WAV is always lossless
        outputArgs = [];
        break;
      case 'aac':
        const aacBitrate = quality === 'high' ? '256k' : quality === 'medium' ? '192k' : '128k';
        outputArgs = ['-b:a', aacBitrate];
        break;
    }

    // Run FFmpeg command
    onProgress?.(60);
    // await ffmpeg.run(
    //   '-i', 'input.mp4',
    //   ...outputArgs,
    //   '-map', 'a',
    //   `output.${format}`
    // );
    onProgress?.(80);

    // Read output file
    // const data = ffmpeg.FS('readFile', `output.${format}`);
    onProgress?.(90);

    // Clean up files
    // ffmpeg.FS('unlink', 'input.mp4');
    // ffmpeg.FS('unlink', `output.${format}`);

    // Determine MIME type
    const mimeTypes: Record<string, string> = {
      mp3: 'audio/mp3',
      wav: 'audio/wav',
      aac: 'audio/aac',
    };

    onProgress?.(100);

    // Create and return blob
    // return new Blob([data.buffer], { type: mimeTypes[format] || 'audio/mpeg' });
    return new Blob([inputData], { type: mimeTypes[format] || 'audio/mpeg' });
  } catch (error) {
    console.error('FFmpeg error:', error);
    throw new Error(
      'Failed to extract audio: ' + (error instanceof Error ? error.message : String(error))
    );
  }
}
