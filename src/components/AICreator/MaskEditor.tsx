import React, { useRef, useEffect, useState } from 'react';
import { X, Eraser, Undo, Redo, Download } from 'lucide-react';

interface MaskEditorProps {
  imageUrl: string;
  onClose: () => void;
  onMaskGenerated: (maskDataUrl: string) => void;
}

function MaskEditor({ imageUrl, onClose, onMaskGenerated }: MaskEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [brushSize, setBrushSize] = React.useState(20);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageUrl;

    image.onload = () => {
      // Calculate scale to fit within viewport while maintaining aspect ratio
      const maxWidth = window.innerWidth * 0.8; // 80% of viewport width
      const maxHeight = window.innerHeight * 0.6; // 60% of viewport height

      const scale = Math.min(maxWidth / image.width, maxHeight / image.height);

      const scaledWidth = Math.floor(image.width * scale);
      const scaledHeight = Math.floor(image.height * scale);

      // Set canvas dimensions
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;

      // Store original image size and scale
      setImageSize({ width: image.width, height: image.height });
      setScale(scale);

      // Draw black background
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw image with very dark overlay for better visibility
      ctx.globalAlpha = 0.15; // Make image even darker
      ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);
      ctx.globalAlpha = 1.0;

      // Save initial state
      const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initialState]);
      setHistoryIndex(0);
      setImageLoaded(true);
    };
  }, [imageUrl]);

  // Apply zoom and pan transformations
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and redraw with current zoom/pan
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan
    ctx.setTransform(zoom, 0, 0, zoom, pan.x, pan.y);

    // Draw dark background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width / zoom, canvas.height / zoom);

    // Draw image with very dark overlay
    const image = new Image();
    image.src = imageUrl;
    ctx.globalAlpha = 0.15;
    ctx.drawImage(image, 0, 0, canvas.width / zoom, canvas.height / zoom);
    ctx.globalAlpha = 1.0;

    // Restore any existing mask
    if (history[historyIndex]) {
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      const maskCtx = maskCanvas.getContext('2d');
      if (maskCtx) {
        maskCtx.putImageData(history[historyIndex], 0, 0);
        ctx.drawImage(maskCanvas, 0, 0, canvas.width / zoom, canvas.height / zoom);
      }
    }
  }, [zoom, pan.x, pan.y, imageLoaded]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const zoomFactor = 0.1;
    const newZoom = Math.max(1, Math.min(5, zoom + (delta > 0 ? zoomFactor : -zoomFactor)));

    if (newZoom !== zoom) {
      // Calculate cursor position relative to canvas
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate new pan position to zoom towards cursor
      const scaleChange = newZoom - zoom;
      const newPanX = pan.x - x * scaleChange;
      const newPanY = pan.y - y * scaleChange;

      setZoom(newZoom);
      setPan({ x: newPanX, y: newPanY });
    }
  };

  const startDragging = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons === 2 || (e.buttons === 1 && e.altKey)) {
      // Right click or Alt+Left click
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    } else {
      startDrawing(e);
    }
  };

  const handleDrag = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      e.preventDefault();
    } else {
      draw(e);
    }
  };

  const stopDragging = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setIsDragging(false);
      e.preventDefault();
    } else {
      stopDrawing();
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging || e.buttons === 2 || (e.buttons === 1 && e.altKey)) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) * (canvas.width / rect.width) - pan.x) / zoom;
    const y = ((e.clientY - rect.top) * (canvas.height / rect.height) - pan.y) / zoom;

    ctx.beginPath();
    ctx.moveTo(x, y);
    draw(e); // Draw a point immediately on mouse down
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Enable anti-aliasing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) * (canvas.width / rect.width) - pan.x) / zoom;
    const y = ((e.clientY - rect.top) * (canvas.height / rect.height) - pan.y) / zoom;

    // Create gradient for brush edge
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize / zoom / 2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // White center
    gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.8)'); // Fading edge
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Transparent edge

    // Draw with gradient
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize / zoom;
    ctx.strokeStyle = gradient;
    ctx.lineTo(x, y);
    ctx.globalCompositeOperation = 'source-over';
    ctx.stroke();

    // Draw additional points between movements for smoother lines
    if (e.movementX !== 0 || e.movementY !== 0) {
      const steps = Math.ceil(Math.sqrt(e.movementX ** 2 + e.movementY ** 2) / 2);
      const dx = e.movementX / steps;
      const dy = e.movementY / steps;

      for (let i = 1; i < steps; i++) {
        const interpolatedX = x - dx * i;
        const interpolatedY = y - dy * i;

        const interpolatedGradient = ctx.createRadialGradient(
          interpolatedX,
          interpolatedY,
          0,
          interpolatedX,
          interpolatedY,
          brushSize / zoom / 2
        );
        interpolatedGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        interpolatedGradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.8)');
        interpolatedGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(interpolatedX, interpolatedY, brushSize / zoom / 2, 0, Math.PI * 2);
        ctx.fillStyle = interpolatedGradient;
        ctx.fill();
      }
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.closePath();

    // Save new state to history
    const newState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(historyIndex + 1);
  };

  const undo = () => {
    if (historyIndex <= 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newIndex = historyIndex - 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newIndex = historyIndex + 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw the image
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageUrl;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Save new state
      const newState = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newState);
      setHistory(newHistory);
      setHistoryIndex(historyIndex + 1);
    };
  };

  const handleComplete = async() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary canvas at original image size
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imageSize.width;
    tempCanvas.height = imageSize.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    try {
      // Convert canvas to blob with CORS-friendly format
      const blob = await new Promise<Blob>(resolve => canvas.toBlob(resolve as any));
      const img = new Image();
      
      // Critical CORS fix
      img.crossOrigin = "anonymous";
      img.src = URL.createObjectURL(blob);
  
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = () => {
          throw new Error('Failed to load image');
        };
      });
  
      // Set white background
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, imageSize.width, imageSize.height);

    // Set black background for unmasked areas
    tempCtx.fillStyle = 'black';
    tempCtx.fillRect(0, 0, imageSize.width, imageSize.height);

    // Draw the mask in white
    tempCtx.globalCompositeOperation = 'source-over';
    tempCtx.filter = 'brightness(0) invert(1)'; // Convert to pure white
    tempCtx.drawImage(canvas, 0, 0, imageSize.width, imageSize.height);

    // Reset composite operation and filter
    tempCtx.globalCompositeOperation = 'source-over';
    tempCtx.filter = 'none';

    // Ensure pure black and white
    const imageData = tempCtx.getImageData(0, 0, imageSize.width, imageSize.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // Convert to pure black or white
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const value = brightness > 127 ? 255 : 0;
      data[i] = value; // R
      data[i + 1] = value; // G
      data[i + 2] = value; // B
      data[i + 3] = 255; // A
    }
    tempCtx.putImageData(imageData, 0, 0);

    const maskDataUrl = tempCanvas.toDataURL('image/png');
    onMaskGenerated(maskDataUrl);
    onClose();
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1A1030] border border-white/20 rounded-xl shadow-lg w-full max-w-4xl p-6 m-4 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Eraser className="w-5 h-5" />
            Mask Editor
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium">Brush Size</label>
              <input
                type="range"
                min="1"
                max="100"
                value={brushSize}
                onChange={e => setBrushSize(parseInt(e.target.value))}
                className="w-32"
              />
            </div>
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              title="Undo"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              title="Redo"
            >
              <Redo className="w-5 h-5" />
            </button>
            <button
              onClick={clear}
              className="p-2 text-white/60 hover:text-white"
              title="Clear mask"
            >
              <Eraser className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-white/5 rounded-lg overflow-hidden flex items-center justify-center">
            <div
              ref={containerRef}
              className="relative overflow-hidden"
              onContextMenu={e => e.preventDefault()}
            >
              <canvas
                ref={canvasRef}
                onMouseDown={startDragging}
                onMouseMove={handleDrag}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                onWheel={handleWheel}
                className={`cursor-${isDragging ? 'grab' : 'crosshair'} bg-[#1A1030]`}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div className="space-y-1">
              <label className="block text-xs text-white/60">Zoom: {Math.round(zoom * 100)}%</label>
              <input
                type="range"
                min="100"
                max="500"
                value={zoom * 100}
                onChange={e => setZoom(parseInt(e.target.value) / 100)}
                className="w-32"
              />
            </div>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-lg"
            >
              Reset View
            </button>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleComplete}
              disabled={!imageLoaded}
              className="px-4 py-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] disabled:bg-[#2A1A5A] disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Save Mask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaskEditor;
