export type AspectRatioEnum = '1:1' | '16:9' | '9:16' | '3:4' | '4:3';

export interface Imagen3RequestOptions {
  prompt: string;
  negative_prompt?: string;
  aspect_ratio?: AspectRatioEnum;
  num_images?: number;
  seed?: number;
}

export interface Imagen3Response {
  images: Array<{
    url: string;
    content_type?: string;
  }>;
  seed: number;
}
