export type SafetyTolerance = '1' | '2' | '3' | '4' | '5' | '6';
export type OutputFormat = 'jpeg' | 'png';
export type AspectRatio = '21:9' | '16:9' | '4:3' | '3:2' | '1:1' | '2:3' | '3:4' | '9:16' | '9:21';

export interface FluxRequestOptions {
  prompt: string;
  seed?: number;
  sync_mode?: boolean;
  num_images?: number;
  enable_safety_checker?: boolean;
  safety_tolerance?: SafetyTolerance;
  output_format?: OutputFormat;
  aspect_ratio?: AspectRatio;
  raw?: boolean;
}

export interface FluxResponse {
  images: Array<{
    url: string;
    content_type: string;
  }>;
  timings?: Record<string, number>;
  seed?: number;
  has_nsfw_concepts?: boolean[];
  prompt: string;
}
