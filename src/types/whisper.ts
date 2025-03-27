export type LanguageCode =
  | 'af'
  | 'am'
  | 'ar'
  | 'as'
  | 'az'
  | 'ba'
  | 'be'
  | 'bg'
  | 'bn'
  | 'bo'
  | 'br'
  | 'bs'
  | 'ca'
  | 'cs'
  | 'cy'
  | 'da'
  | 'de'
  | 'el'
  | 'en'
  | 'es'
  | 'et'
  | 'eu'
  | 'fa'
  | 'fi'
  | 'fo'
  | 'fr'
  | 'gl'
  | 'gu'
  | 'ha'
  | 'haw'
  | 'he'
  | 'hi'
  | 'hr'
  | 'ht'
  | 'hu'
  | 'hy'
  | 'id'
  | 'is'
  | 'it'
  | 'ja'
  | 'jw'
  | 'ka'
  | 'kk'
  | 'km'
  | 'kn'
  | 'ko'
  | 'la'
  | 'lb'
  | 'ln'
  | 'lo'
  | 'lt'
  | 'lv'
  | 'mg'
  | 'mi'
  | 'mk'
  | 'ml'
  | 'mn'
  | 'mr'
  | 'ms'
  | 'mt'
  | 'my'
  | 'ne'
  | 'nl'
  | 'nn'
  | 'no'
  | 'oc'
  | 'pa'
  | 'pl'
  | 'ps'
  | 'pt'
  | 'ro'
  | 'ru'
  | 'sa'
  | 'sd'
  | 'si'
  | 'sk'
  | 'sl'
  | 'sn'
  | 'so'
  | 'sq'
  | 'sr'
  | 'su'
  | 'sv'
  | 'sw'
  | 'ta'
  | 'te'
  | 'tg'
  | 'th'
  | 'tk'
  | 'tl'
  | 'tr'
  | 'tt'
  | 'uk'
  | 'ur'
  | 'uz'
  | 'vi'
  | 'yi'
  | 'yo'
  | 'yue'
  | 'zh';

export type WhisperTask = 'transcribe' | 'translate';
export type ChunkLevel = 'segment' | 'word';
export type WhisperVersion = '3';

export interface WhisperRequestOptions {
  audio_url: string;
  task?: WhisperTask;
  language?: LanguageCode | null;
  diarize?: boolean;
  chunk_level?: ChunkLevel;
  version?: WhisperVersion;
  batch_size?: number;
  prompt?: string;
  num_speakers?: number | null;
}

export interface DiarizationSegment {
  speaker: string;
  start: number;
  end: number;
  text: string;
}

export interface WhisperChunk {
  text: string;
  timestamp: [number, number];
  speaker?: string;
  words?: Array<{
    text: string;
    start: number;
    end: number;
    confidence: number;
  }>;
}

export interface WhisperResponse {
  text: string;
  chunks: WhisperChunk[];
  inferred_languages?: LanguageCode[];
  detected_language?: string;
  diarization_segments?: DiarizationSegment[];
  error?: string;
}
