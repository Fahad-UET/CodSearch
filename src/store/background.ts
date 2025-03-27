import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useHistory } from './history';
import { addAiGeneration } from '@/services/firebase/aiGenerations';

export interface BackgroundTask {
  id: string;
  type:
    | 'video'
    | 'video-background-remover'
    | 'transcribe'
    | 'speech-to-video'
    | 'prompt'
    | 'lipsync'
    | 'text-to-image'
    | 'image'
    | 'text'
    | 'veo2'
    | 'text-to-speech'
    | 'image-watermark-remover'
    | 'video-watermark-remover'
    | 'video-to-audio'
    | 'change-image-background'
    | 'remove-image-background'
    | 'face-retoucher'
    | 'face-swap'
    | 'image-to-text'
    | 'outfits-image'
    | 'outfits-video'
    | 'product-image'
    | 'product-variations'
    | 'product-video'
    | 'product-replace'
    | 'image-upscaler'
    | 'video-upscaler';
  status: 'pending' | 'completed' | 'failed';
  progress: string;
  error?: string;
  requestId?: string;
  params: any;
  result?: any;
  timestamp: number;
}

interface BackgroundState {
  tasks: BackgroundTask[];
  addTask: (task: Omit<BackgroundTask, 'id'>) => string;
  updateTask: (id: string, updates: Partial<BackgroundTask>, userId?: string) => void;
  removeTask: (id: string) => void;
  clearCompletedTasks: () => void;
  cleanupOldTasks: () => void;
}

export const useBackground = create<BackgroundState>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: task => {
        const id = crypto.randomUUID();
        // Clean up old tasks before adding new ones
        get().cleanupOldTasks();
        set(state => ({
          tasks: [{ ...task, id }, ...state.tasks].slice(0, 50), // Keep only last 50 tasks
        }));
        return id;
      },
      updateTask: async (id, updates, userId) => {
        set(state => ({
          tasks: state.tasks.map(task => {
            if (task.id === id) {
              const updatedTask = { ...task, ...updates };

              // If task completed successfully, save to history
              if (updates.status === 'completed' && updatedTask.result) {
                const { addItem } = useHistory.getState();

                // Update UI state based on task type
                if (
                  task.type === 'prompt' ||
                  task.type === 'text' ||
                  task.type === 'image-to-text' ||
                  task.type === 'transcribe'
                ) {
                  // Update text generator UI
                  window.dispatchEvent(
                    new CustomEvent('response-update', {
                      detail: {
                        type: task.type,
                        response: updatedTask.result.output || updatedTask.result.prompt,
                        reasoning: updatedTask.result.reasoning,
                      },
                    })
                  );
                  if (userId) {
                    const currentTime = Date.now();
                    addAiGeneration({
                      userId,
                      type: task.type,
                      id: task.id,
                      currentTime,
                      content: {
                        prompt: task.params.prompt || '',
                        systemPrompt: task.params.system_prompt || '',
                        response: updatedTask.result.output || updatedTask.result.prompt || '',
                        reasoning: updatedTask.result.reasoning || '',
                      },
                    })
                      .then(result => {
                        addItem({
                          type: task.type,
                          id: task.id,
                          content: {
                            prompt: task.params.prompt,
                            systemPrompt: task.params.system_prompt,
                            response: updatedTask.result.output || updatedTask.result.prompt,
                            reasoning: updatedTask.result.reasoning,
                          },
                          timestamp: currentTime,
                        });
                      })
                      .catch(error => {
                        // Handle any errors that may occur during the process
                        console.error(error);
                      });
                  } else {
                    addItem({
                      type: task.type,
                      id: task.id,
                      content: {
                        prompt: task.params.prompt,
                        systemPrompt: task.params.system_prompt,
                        response: updatedTask.result.output || updatedTask.result.prompt,
                        reasoning: updatedTask.result.reasoning,
                      },
                      timestamp: Date.now(),
                    });
                  }
                }
                if (
                  task.type === 'image' ||
                  task.type === 'image-upscaler' ||
                  task.type === 'change-image-background' ||
                  task.type === 'face-retoucher' ||
                  task.type === 'image-watermark-remover' ||
                  task.type === 'face-swap' ||
                  task.type === 'outfits-image' ||
                  task.type === 'product-image' ||
                  task.type === 'product-variations' ||
                  task.type === 'remove-image-background' ||
                  task.type === 'text-to-image' ||
                  task.type === 'product-replace'
                ) {
                  if(updatedTask.result?.images?.length){
                    updatedTask.result.images.forEach(async (image: any) => {
                      if (userId) {
                        const currentTime = Date.now();
                        const result = await addAiGeneration({
                          userId,
                          type: task.type,
                          id: task.id,
                          currentTime,
                          content: {
                            ...(task.params?.prompt ? { prompt: task.params.prompt } : {}),
                            imageUrl: image.url || '',
                            ...(task.params?.seed ? { prompt: task.params.seed } : {}),
                          },
                        });
                        addItem({
                          type: task.type,
                          id: task.id,
                          content: {
                            ...(task.params?.prompt ? { prompt: task.params.prompt } : {}),
                            imageUrl: image.url,
                            ...(task.params?.seed ? { prompt: task.params.seed } : {}),
                          },
                          timestamp: currentTime,
                        });
                      } else {
                        addItem({
                          type: task.type,
                          id: task.id,
                          content: {
                            ...(task.params?.prompt ? { prompt: task.params.prompt } : {}),
                            imageUrl: image.url,
                            ...(task.params?.seed ? { prompt: task.params.seed } : {}),
                          },
                          timestamp: Date.now(),
                        });
                      }
                    });
  
                    const responseEvent = new CustomEvent('response-update', {
                      detail: {
                        type: task.type,
                        images: updatedTask.result.images,
                        prompt: task.params?.prompt || '',
                        seed: task.params?.seed || '',
                      },
                    });
                    window.dispatchEvent(responseEvent);
                  }else if (updatedTask.result?.image?.url) {
                    if (userId) {
                      const currentTime = Date.now();
                      addAiGeneration({
                        userId,
                        type: task.type,
                        id: task.id,
                        currentTime,
                        content: {
                          ...(task.params?.prompt ? { prompt: task.params.prompt } : {}),
                          imageUrl: updatedTask.result.image.url || '',
                          ...(task.params?.seed ? { prompt: task.params.seed } : {}),
                        },
                      }).then(result => {
                        addItem({
                          type: task.type,
                          id: task.id,
                          content: {
                            ...(task.params?.prompt ? { prompt: task.params.prompt } : {}),
                            imageUrl: updatedTask.result.image.url,
                            ...(task.params?.seed ? { prompt: task.params.seed } : {}),
                          },
                          timestamp: currentTime,
                        });
                      }).catch(err => console.log(err))
                  
                    } else {
                      addItem({
                        type: task.type,
                        id: task.id,
                        content: {
                          ...(task.params?.prompt ? { prompt: task.params.prompt } : {}),
                          imageUrl: updatedTask.result.image.url,
                          ...(task.params?.seed ? { prompt: task.params.seed } : {}),
                        },
                        timestamp: Date.now(),
                      });
                    }
                    const responseEvent = new CustomEvent('response-update', {
                      detail: {
                        type: task.type,
                        images: updatedTask.result.image,
                        prompt: task.params?.prompt || '',
                        seed: task.params?.seed || '',
                      },
                    });
                    window.dispatchEvent(responseEvent);
                  };
                  
                }
                if (
                  task.type === 'video' ||
                  task.type === 'lipsync' ||
                  task.type === 'veo2' ||
                  task.type === 'video-background-remover' ||
                  task.type === 'video-watermark-remover' ||
                  task.type === 'outfits-video' ||
                  task.type === 'product-video' ||
                  task.type === 'video-upscaler'
                ) {
                  if (updatedTask.result?.video?.url) {
                    const responseEvent = new CustomEvent('video-update', {
                      detail: {
                        type: task.type,
                        videoUrl: updatedTask.result.video.url,
                        prompt: task.params.prompt,
                      },
                    });
                    window.dispatchEvent(responseEvent);
                    if (userId) {
                      const currentTime = Date.now();
                      addAiGeneration({
                        userId,
                        type: task.type,
                        id: task.id,
                        currentTime,
                        content: {
                          prompt: task.params.prompt || '',
                          videoUrl: updatedTask.result.video.url || '',
                          aspectRatio: task.params.aspect_ratio || '',
                          duration: task.params.duration || '',
                        },
                      }).then(result => {
                        addItem({
                          type: task.type,
                          id: task.id,
                          content: {
                            prompt: task.params.prompt,
                            videoUrl: updatedTask.result.video.url,
                            aspectRatio: task.params.aspect_ratio,
                            duration: task.params.duration,
                          },
                          timestamp: currentTime,
                        });
                      });
                    } else {
                      addItem({
                        type: task.type,
                        id: task.id,
                        content: {
                          prompt: task.params.prompt,
                          videoUrl: updatedTask.result.video.url,
                          aspectRatio: task.params.aspect_ratio,
                          duration: task.params.duration,
                        },
                        timestamp: Date.now(),
                      });
                    }
                  }
                }
              }

              return updatedTask;
            }
            return task;
          }),
        }));
      },
      removeTask: id => {
        set(state => ({
          tasks: state.tasks.filter(task => task.id !== id),
        }));
      },
      clearCompletedTasks: () => {
        set(state => ({
          tasks: state.tasks.filter(task => task.status === 'pending'),
        }));
      },
      cleanupOldTasks: () => {
        const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        set(state => ({
          tasks: state.tasks
            .filter(task => {
              // Keep pending tasks and tasks from the last 24 hours
              return task.status === 'pending' || Date.now() - task.timestamp < ONE_DAY;
            })
            .slice(0, 50), // Keep only last 50 tasks
        }));
      },
    }),
    {
      name: 'ai-tools-background',
      partialize: state => ({
        // Only persist essential task data
        tasks: state.tasks.map(task => ({
          id: task.id,
          type: task.type,
          status: task.status,
          timestamp: task.timestamp,
          error: task.error,
        })),
      }),
    }
  )
);
