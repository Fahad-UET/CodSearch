import React from 'react';
import { X, Camera, Video, Clapperboard } from 'lucide-react';

type TabType = 'presets' | 'movements';

interface CameraMovement {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  prompt: string;
  movements: string[];
}

const CAMERA_MOVEMENTS: CameraMovement[] = [
  {
    id: 'debut',
    name: 'Debut',
    description: 'Truck left, Push in, Pan right',
    previewUrl: '/videos/compressed_debut.mp4',
    prompt: 'camera movement: truck left, push in, pan right',
    movements: ['Truck left', 'Push in', 'Pan right'],
  },
  {
    id: 'freedom',
    name: 'Freedom',
    description: 'Push out, Pedestal up, Tilt down',
    previewUrl: '/videos/compressed_freedom.mp4',
    prompt: 'camera movement: push out, pedestal up, tilt down',
    movements: ['Push out', 'Pedestal up', 'Tilt down'],
  },
  {
    id: 'left-circling',
    name: 'Left Circling',
    description: 'Truck left, Pan right, Tracking shot',
    previewUrl: '/videos/leftcircling_360w_optimized_2.mp4',
    prompt: 'camera movement: truck left, pan right, tracking shot',
    movements: ['Truck left', 'Pan right', 'Tracking shot'],
  },
  {
    id: 'right-circling',
    name: 'Right Circling',
    description: 'Truck right, Pan left, Tracking shot',
    previewUrl: '/videos/rightcircling_360w_optimized_2.mp4',
    prompt: 'camera movement: truck right, pan left, tracking shot',
    movements: ['Truck right', 'Pan left', 'Tracking shot'],
  },
  {
    id: 'upward-tilt',
    name: 'Upward Tilt',
    description: 'Push in, Pedestal up',
    previewUrl: '/videos/upwardtilt_360w_optimized_2.mp4',
    prompt: 'camera movement: push in, pedestal up',
    movements: ['Push in', 'Pedestal up'],
  },
  {
    id: 'left-walking',
    name: 'Left Walking',
    description: 'Truck left, Tracking shot',
    previewUrl: '/videos/leftwalking_360w_optimized_2.mp4',
    prompt: 'camera movement: truck left, tracking shot',
    movements: ['Truck left', 'Tracking shot'],
  },
  {
    id: 'right-walking',
    name: 'Right Walking',
    description: 'Truck right, Tracking shot',
    previewUrl: '/videos/rightwalking_360w_optimized_2.mp4',
    prompt: 'camera movement: truck right, tracking shot',
    movements: ['Truck right', 'Tracking shot'],
  },
  {
    id: 'downward-tilt',
    name: 'Downward Tilt',
    description: 'Pedestal down, Tilt up',
    previewUrl: '/videos/downwardtilt_360w_optimized_2.mp4',
    prompt: 'camera movement: pedestal down, tilt up',
    movements: ['Pedestal down', 'Tilt up'],
  },
  {
    id: 'stage-left',
    name: 'Stage Left',
    description: 'Pan left, Zoom in',
    previewUrl: '/videos/stageleft_360w_optimized_2.mp4',
    prompt: 'camera movement: pan left, zoom in',
    movements: ['Pan left', 'Zoom in'],
  },
  {
    id: 'stage-right',
    name: 'Stage Right',
    description: 'Pan right, Zoom in',
    previewUrl: '/videos/stageright_360w_optimized_2.mp4',
    prompt: 'camera movement: pan right, zoom in',
    movements: ['Pan right', 'Zoom in'],
  },
  {
    id: 'scenic-shot',
    name: 'Scenic Shot',
    description: 'Truck left, Pedestal up',
    previewUrl: '/videos/scenicshot_360w_optimized_2.mp4',
    prompt: 'camera movement: truck left, pedestal up',
    movements: ['Truck left', 'Pedestal up'],
  },
];

interface CameraMovementModalProps {
  onClose: () => void;
  onSelect: (movement: CameraMovement) => void;
}

function CameraMovementModal({ onClose, onSelect }: CameraMovementModalProps) {
  const [selectedMovement, setSelectedMovement] = React.useState<string | null>(null);
  const [hoveredMovement, setHoveredMovement] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<TabType>('presets');
  const [selectedMoves, setSelectedMoves] = React.useState<string[]>([]);

  const CAMERA_MOVES = {
    horizontal: [
      { name: 'Truck left', icon: '←', preview: '/videos/camera 2/truckleft_360w_optimized_2.mp4' },
      {
        name: 'Truck right',
        icon: '→',
        preview: '/videos/camera 2/truckright_360w_optimized_2.mp4',
      },
    ],
    pan: [
      { name: 'Pan left', icon: '⟲', preview: '/videos/camera 2/panleft_360w_optimized_2.mp4' },
      { name: 'Pan right', icon: '⟳', preview: '/videos/camera 2/panright_360w_optimized_2.mp4' },
    ],
    vertical: [
      { name: 'Push in', icon: '↑', preview: '/videos/camera 2/pushin_360w_optimized_2.mp4' },
      { name: 'Pull out', icon: '↓', preview: '/videos/camera 2/pullout_360w_optimized_2.mp4' },
    ],
    pedestal: [
      {
        name: 'Pedestal up',
        icon: '⇡',
        preview: '/videos/camera 2/pedestalup_360w_optimized_2.mp4',
      },
      {
        name: 'Pedestal down',
        icon: '⇣',
        preview: '/videos/camera 2/pedestaldown_360w_optimized_2.mp4',
      },
    ],
    tilt: [
      { name: 'Tilt up', icon: '⇧', preview: '/videos/camera 2/tiltup_360w_optimized_2.mp4' },
      { name: 'Tilt down', icon: '⇩', preview: '/videos/camera 2/tiltdown_360w_optimized_2.mp4' },
    ],
    zoom: [
      { name: 'Zoom in', icon: '⊕', preview: '/videos/camera 2/zoomin_360w_optimized_2.mp4' },
      { name: 'Zoom out', icon: '⊖', preview: '/videos/camera 2/zoomout_360w_optimized_2.mp4' },
    ],
    special: [
      { name: 'Shake', icon: '↯', preview: '/videos/camera 2/shake_360w_optimized_2.mp4' },
      {
        name: 'Tracking shot',
        icon: '⇝',
        preview: '/videos/camera 2/trackingshot_360w_optimized_2.mp4',
      },
      {
        name: 'Static shot',
        icon: '⊡',
        preview: '/videos/camera 2/staticshot_360w_optimized_2.mp4',
      },
    ],
  };

  const handleMoveToggle = (move: string) => {
    setSelectedMoves(prev => {
      if (prev.includes(move)) {
        return prev.filter(m => m !== move);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), move];
      }
      return [...prev, move];
    });
  };

  const handleSelect = () => {
    if (activeTab === 'presets') {
      const movement = CAMERA_MOVEMENTS.find(m => m.id === selectedMovement);
      if (movement) {
        onSelect(movement);
      }
    } else {
      if (selectedMoves.length > 0) {
        onSelect({
          id: 'custom',
          name: 'Custom Movement',
          description: selectedMoves.join(', '),
          previewUrl: '',
          prompt: `camera movement: ${selectedMoves.join(', ').toLowerCase()}`,
          movements: selectedMoves,
        });
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-1">
      <div className="bg-[#1A1030] border border-white/20 rounded-xl shadow-lg w-full max-w-4xl p-6 h-[90vh] flex flex-col animate-fade-in">
        <div className="relative flex items-center justify-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('presets')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'presets'
                  ? 'bg-[#4A2A7A] text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Video className="w-4 h-4" />
              <span className="text-sm">Presets</span>
            </button>
            <button
              onClick={() => setActiveTab('movements')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'movements'
                  ? 'bg-[#4A2A7A] text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Clapperboard className="w-4 h-4" />
              <span className="text-sm">Movements</span>
            </button>
          </div>
          <button onClick={onClose} className="absolute right-0 p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {activeTab === 'movements' ? (
          <div className="space-y-6 mb-6 flex-1 overflow-y-auto">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex flex-wrap gap-2 min-h-[2.5rem] mb-4">
                {selectedMoves.length === 0 ? (
                  <div className="text-white/40 text-sm">No movements selected</div>
                ) : (
                  selectedMoves.map((move, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-[#4A2A7A] px-3 py-1.5 rounded-lg text-sm"
                    >
                      <span>{move}</span>
                      <button
                        onClick={() => setSelectedMoves(prev => prev.filter(m => m !== move))}
                        className="hover:text-white/60"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="grid gap-4">
                {Object.entries(CAMERA_MOVES).map(([category, moves]) => (
                  <div key={category}>
                    <h3 className="text-sm font-medium capitalize mb-2">{category} Movements</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {moves.map(move => (
                        <button
                          key={move.name}
                          onClick={() => handleMoveToggle(move.name)}
                          disabled={!selectedMoves.includes(move.name) && selectedMoves.length >= 3}
                          className={`relative aspect-video rounded-lg overflow-hidden transition-all ${
                            selectedMoves.includes(move.name)
                              ? 'ring-2 ring-[#9A6ACA] shadow-[0_0_20px_-5px_rgba(154,106,202,0.5)]'
                              : 'ring-1 ring-white/10 hover:ring-white/20 disabled:opacity-40'
                          }`}
                        >
                          <video
                            src={move.preview}
                            className="absolute inset-0 w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-mono">{move.icon}</span>
                              <span className="text-sm font-medium">{move.name}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedMoves.length > 0 && (
              <div className="bg-[#4A2A7A]/30 border border-[#4A2A7A] rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">Preview</h3>
                <p className="text-sm text-white/80 font-mono">
                  camera movement: {selectedMoves.join(', ').toLowerCase()}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mb-6 flex-1 overflow-y-auto">
            {CAMERA_MOVEMENTS.map(movement => (
              <button
                key={movement.id}
                onClick={() => setSelectedMovement(movement.id)}
                onMouseEnter={() => setHoveredMovement(movement.id)}
                onMouseLeave={() => setHoveredMovement(null)}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all w-full ${
                  selectedMovement === movement.id
                    ? 'border-[#9A6ACA] shadow-[0_0_20px_-5px_rgba(154,106,202,0.5)]'
                    : 'border-transparent hover:border-white/20'
                }`}
              >
                <video
                  key={movement.id}
                  src={movement.previewUrl}
                  className="w-full h-full object-cover bg-black/20"
                  autoPlay
                  muted
                  loop
                  playsInline
                  onError={e => {
                    console.error(`Failed to load video: ${movement.previewUrl}`, e);
                    // Retry loading
                    const video = e.currentTarget;
                    video.src = movement.previewUrl;
                    video.load();
                  }}
                  style={{ opacity: 0 }}
                  onLoadedData={e => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.play().catch(console.error);
                  }}
                />
                {/* Loading state */}
                <div className="absolute inset-0 bg-black/40" />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-3 transition-opacity ${
                    hoveredMovement === movement.id || selectedMovement === movement.id
                      ? 'opacity-100'
                      : 'opacity-0'
                  }`}
                >
                  <h3 className="text-sm font-medium">{movement.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {movement.movements.map((move, index) => (
                      <span
                        key={index}
                        className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded-full text-white/80"
                      >
                        {move}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
        <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            disabled={activeTab === 'presets' ? !selectedMovement : selectedMoves.length === 0}
            className="px-4 py-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] disabled:bg-[#2A1A4A] disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Apply Movement
          </button>
        </div>
      </div>
    </div>
  );
}

export default CameraMovementModal;
