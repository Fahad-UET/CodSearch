export type AspectRatio = '16:9' | '9:16';
export type Duration = '5s' | '6s' | '7s' | '8s';

export interface Veo2RequestOptions {
  prompt: string;
  aspect_ratio?: AspectRatio;
  duration?: Duration;
}

export interface Veo2Response {
  video: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
  };
  seed?: number;
  prompt: string;
}
