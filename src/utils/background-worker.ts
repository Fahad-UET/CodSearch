import { useBackground } from '../store/background';
import { fal } from "@fal-ai/client";

fal.config({
  credentials: import.meta.env.VITE_FAL_KEY
});

const specialApis = ['fal-ai/fooocus/inpaint','fal-ai/bria/background/remove', 'fal-ai/bria/background/replace', 'fal-ai/any-llm/vision', 'fal-ai/ideogram/v2a/remix', ]


const POLL_INTERVAL = 5000; // 5 seconds

async function startBackgroundPolling(
  taskId: string,
  endpoint: string,
  requestId: string,
  apiKey: string,
  userId?: string
) {
  const { updateTask } = useBackground.getState();
  let attempts = 0;
  const maxAttempts = 120; // 10 minutes total

  const pollStatus = async () => {
    try {
      // Clean up endpoint path
      const cleanEndpoint = endpoint.replace(/\/+/g, '/').replace(/^\//, '');
      const statusResponse: any = specialApis.includes(endpoint) ? await fal.queue.status(cleanEndpoint, {
        requestId: requestId,
        logs: true,
      }) : await fetch(
        `https://queue.fal.run/${cleanEndpoint}/requests/${requestId}/status?logs=1`,
        {
          headers: { Authorization: `Key ${apiKey.trim()}` },
        }
      );
      const statusOk = specialApis.includes(endpoint) ? statusResponse : statusResponse.ok;

      if (!statusOk) {
        throw new Error(`Failed to check status: ${statusResponse.status}`);
      }

      const data = specialApis.includes(endpoint) ? statusResponse : await statusResponse.json();
      const logs = data.logs?.map((log: any) => log.message) || [];

      // Extract response URL from the correct location
      const responseUrl = data.response_url;

      switch (data.status) {
        case 'IN_QUEUE':
          const timeInQueue = attempts * (POLL_INTERVAL / 1000);
          updateTask(taskId, {
            progress: `Waiting in queue${
              data.queue_position !== undefined ? ` (Position: ${data.queue_position + 1})` : ''
            } - ${timeInQueue}s elapsed`,
          });
          break;

        case 'IN_PROGRESS':
          const processingTime = attempts * (POLL_INTERVAL / 1000);
          updateTask(taskId, {
            progress: `Processing request... (${processingTime}s elapsed)`,
          });
          break;

        case 'COMPLETED':
          if (!responseUrl) {
            throw new Error('No response URL provided');
          }

          const resultResponse = await fetch(responseUrl, {
            headers: { Authorization: `Key ${apiKey.trim()}` },
            signal: AbortSignal.timeout(30000), // 30 second timeout
          });

          if (!resultResponse.ok) {
            let errorMessage;
            try {
              const errorData = await resultResponse.json();
              errorMessage = errorData.error?.message || errorData.message || errorData.detail;
            } catch {
              errorMessage = `Failed to fetch result: ${resultResponse.status}`;
            }
            throw new Error(errorMessage || `Failed to fetch result: ${resultResponse.status}`);
          }

          const result = await resultResponse.json();

          // Normalize video result format
          let normalizedResult = result;

          if (cleanEndpoint.includes('kling-video')) {
            normalizedResult = {
              video: {
                url: result.video?.url || result.url,
                content_type: 'video/mp4',
                file_name: 'output.mp4',
                file_size: result.video?.file_size || 0,
              },
            };
          } else {
            // Handle other response formats
            if (endpoint === 'fal-ai/imagen3') {
              if (Array.isArray(result)) {
                normalizedResult = { images: result };
              } else if (result.images) {
                normalizedResult.images = normalizedResult.images.map((img: any) => ({
                  url: typeof img === 'string' ? img : img.url,
                  content_type: img.content_type || 'image/jpeg',
                }));
              }
            }
          }

          // Validate video URL
          if (normalizedResult.video?.url) {
            try {
              new URL(normalizedResult.video.url);
            } catch {
              throw new Error('Invalid video URL in response');
            }
          }

          updateTask(
            taskId,
            {
              status: 'completed',
              progress: 'Completed',
              result: normalizedResult,
            },
            userId
          );
          return true;

        case 'FAILED':
          updateTask(taskId, {
            status: 'failed',
            error: data.error?.message || 'Request failed',
          });
          return true;
      }

      if (attempts++ >= maxAttempts) {
        updateTask(taskId, {
          status: 'failed',
          error: 'Request timed out',
        });
        return true;
      }

      // Continue polling
      setTimeout(pollStatus, POLL_INTERVAL);
      return false;
    } catch (error) {
      updateTask(taskId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
      return true;
    }
  };

  // Start polling
  pollStatus();
}

export { startBackgroundPolling };
