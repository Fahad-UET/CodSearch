export type AspectRatioEnum = '16:9' | '9:16' | '1:1';
export type DurationEnum = '5' | '10';
export type MovementTypeEnum = 'horizontal' | 'vertical' | 'pan' | 'tilt' | 'roll' | 'zoom';

export interface Trajectory {
  x: number;
  y: number;
}

export interface DynamicMask {
  mask_url: string;
  trajectories: Trajectory[];
}

export interface CameraControl {
  movement_type: MovementTypeEnum;
  movement_value: number;
}

export interface KlingRequestOptions {
  prompt: string;
  image_url: string;
  model?: string;
  duration?: DurationEnum;
  aspect_ratio?: AspectRatioEnum;
  tail_image_url?: string;
  static_mask_url?: string;
  dynamic_masks?: DynamicMask[];
}

export interface KlingResponse {
  video: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
  };
}
