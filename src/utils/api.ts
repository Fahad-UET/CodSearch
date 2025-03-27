async function retryFetch(
  url: string,
  options: RequestInit,
  maxRetries = 3,
  backoff = 1000
): Promise<Response> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      // Only retry on network errors or 5xx server errors
      if (!response.ok && response.status >= 500) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry if we've been aborted
      if (lastError.name === 'AbortError') {
        throw lastError;
      }

      // Don't retry on the last attempt
      if (i === maxRetries - 1) {
        throw lastError;
      }

      // Wait with exponential backoff before retrying
      await new Promise(resolve => setTimeout(resolve, backoff * Math.pow(2, i)));
    }
  }

  throw lastError!;
}

export class QueueError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'QueueError';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      details: this.details,
    };
  }
}

export async function submitToQueue<T>(
  endpoint: string,
  apiKey: string,
  payload: any,
  onProgress?: (status: string, percentage: number, logs?: string[]) => void,
  genType?: string
): Promise<T> {
  try {
    // Validate API key
    if (!apiKey || apiKey.trim() === '') {
      throw new QueueError('Please set your FAL API key in the .env file as VITE_FAL_KEY');
    }

    const url = new URL(`https://queue.fal.run/${endpoint}`);
    // Always enable webhook processing
    url.searchParams.append('fal_webhook', `${window.location.origin}/api/fal/webhook`);

    // Submit initial request
    let response;
    try {
      // Ensure URL is properly formatted
      const cleanEndpoint = endpoint.replace(/\/+/g, '/').replace(/^\//, '');
      const apiUrl = url.toString();

      response = await retryFetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Key ${apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });
    } catch (error) {
      console.log({ error });
      if (
        error instanceof TypeError &&
        (error.message === 'Failed to fetch' || error.message.includes('Failed to fetch'))
      ) {
        throw new QueueError(
          'Network error. Please check your internet connection and try again.',
          error
        );
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new QueueError(
          'Request timed out. The server took too long to respond. Please try again.',
          error
        );
      }
      throw new QueueError(
        error instanceof Error ? error.message : 'An unexpected network error occurred',
        error
      );
    }

    if (!response.ok) {
      try {
        const error = await response.json();
        let apiError =
          error.error?.message ||
          error.message ||
          error.detail ||
          `Request failed with status ${response.status}`;

        // Handle specific error cases
        if (response.status === 413) {
          apiError =
            'File size too large. Please use a smaller file (max 2MB) or reduce the dimensions.';
        }

        // Handle validation errors (422)
        if (response.status === 422) {
          const errorLower = apiError.toLowerCase();
          if (endpoint.includes('ideogram')) {
            if (errorLower.includes('image_url')) {
              apiError =
                'Invalid image URL. Please ensure the image URL is accessible and in a supported format.';
            } else if (errorLower.includes('prompt')) {
              apiError = 'Invalid prompt. Please provide a valid prompt and try again.';
            } else if (errorLower.includes('aspect_ratio')) {
              apiError = 'Invalid aspect ratio. Please select a valid aspect ratio and try again.';
            } else if (errorLower.includes('strength')) {
              apiError = 'Invalid strength value. Please provide a value between 0 and 1.';
            } else if (errorLower.includes('style')) {
              apiError = 'Invalid style. Please select a valid style option.';
            }
          } else if (endpoint.includes('kolors')) {
            apiError = 'Invalid input images. Please ensure both images are valid and try again.';
          } else {
            apiError = 'Invalid request parameters. Please check your input and try again.';
          }
        }

        // Handle specific error cases
        if (response.status === 400) {
          // Check for common 400 error cases
          if (apiError.toLowerCase().includes('invalid request')) {
            apiError = 'Invalid request parameters. Please check your input and try again.';
          } else if (apiError.toLowerCase().includes('prompt')) {
            apiError = 'Invalid or empty prompt. Please provide a valid prompt and try again.';
          } else if (apiError.toLowerCase().includes('model')) {
            apiError = 'Invalid model selection. Please choose a different model and try again.';
          } else if (apiError.toLowerCase().includes('aspect_ratio')) {
            apiError = 'Invalid aspect ratio. Please select a valid aspect ratio and try again.';
          }
        }

        // Check for specific API key errors
        if (response.status === 401 || apiError.toLowerCase().includes('api key')) {
          throw new QueueError(
            'Invalid API key or insufficient permissions. ' +
              'Please check your FAL API key in the .env file and ensure it has the necessary permissions.'
          );
        }

        // Rate limit error
        if (response.status === 429) {
          throw new QueueError('Rate limit exceeded. Please try again in a few minutes.');
        }

        // Handle billing/balance errors
        if (response.status === 403) {
          if (apiError.toLowerCase().includes('exhausted balance')) {
            throw new QueueError(
              'Your FAL.ai account balance is exhausted. Please visit https://fal.ai/dashboard/billing to top up your balance.'
            );
          }
          if (apiError.toLowerCase().includes('user is locked')) {
            throw new QueueError(
              'Your FAL.ai account is locked. Please check your account status at https://fal.ai/dashboard.'
            );
          }
        }

        // Handle service errors
        if (response.status >= 500) {
          throw new QueueError(
            'Service temporarily unavailable. Please try again in a few minutes.'
          );
        }

        // Log the full error details for debugging
        console.error('API Error Details:', {
          status: response.status,
          error: error,
          endpoint,
          requestBody: payload,
        });

        throw new QueueError(apiError);
      } catch (e) {
        if (e instanceof QueueError) throw e;
        throw new QueueError(
          'Failed to process request. Please try again or contact support if the issue persists.'
        );
      }
    }
    const queueResponse = await response.json();
    const { request_id } = queueResponse;
    onProgress?.('Request submitted. Waiting for webhook callback...', 0);
    if (genType) {
      return {
        request_id: queueResponse.request_id,
        gateway_request_id: queueResponse.gateway_request_id,
      } as unknown as T;
    }

    // Poll for status instead of using EventSource
    const pollInterval = 5000; // 5 seconds
    const maxAttempts = 120; // 10 minutes total
    let attempts = 0;

    while (attempts < maxAttempts) {
      const statusResponse = await retryFetch(
        `https://queue.fal.run/${endpoint}/requests/${request_id}/status?logs=1`,
        {
          headers: {
            Authorization: `Key ${apiKey}`,
          },
          signal: AbortSignal.timeout(10000), // 10 second timeout for status checks
        }
      );

      if (!statusResponse.ok) {
        throw new QueueError(`Failed to check status: ${statusResponse.status}`);
      }

      const data = (await statusResponse.json()) as any;

      // Extract logs
      const logs = data.logs?.map(log => log.message) || [];

      // Update progress based on status
      switch (data.status) {
        case 'IN_QUEUE':
          const queuePosition = data.queue_position !== undefined ? data.queue_position + 1 : 0;
          const queueProgress = Math.max(5, Math.min(25, 25 - queuePosition * 5));
          const timeInQueue = attempts * (pollInterval / 1000);
          onProgress?.(
            `Waiting in queue${
              data.queue_position !== undefined ? ` (Position: ${data.queue_position + 1})` : ''
            } - ${timeInQueue}s elapsed`,
            queueProgress,
            logs
          );
          break;

        case 'IN_PROGRESS':
          const processingTime = attempts * (pollInterval / 1000);
          const processingProgress = Math.min(90, 25 + processingTime / 2);
          onProgress?.(
            `Processing request... (${processingTime}s elapsed)`,
            processingProgress,
            logs
          );
          break;

        case 'COMPLETED':
          // Fetch final result
          const resultResponse = await retryFetch(queueResponse.response_url, {
            headers: { Authorization: `Key ${apiKey}` },
            signal: AbortSignal.timeout(30000), // 30 second timeout
          });

          if (!resultResponse.ok) {
            throw new QueueError(`Failed to fetch result: ${resultResponse.status}`);
          }

          const result = await resultResponse.json();
          onProgress?.('Completed', 100, logs);

          // Normalize response format for Kolors API
          if (endpoint.includes('kolors-virtual-try-on')) {
            return {
              result: {
                image: result.image,
              },
            }as unknown as T;
          }

          return result;

        case 'FAILED':
          throw new QueueError(data.error?.message || 'Request failed', data);
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      attempts++;
    }

    throw new QueueError('Request timed out');
  } catch (error) {
    // Log the full error for debugging
    if (error instanceof QueueError) {
      console.error('Queue Error:', error.toJSON());
    } else {
      console.error('Unexpected Error:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        details: error,
      });
    }

    // Handle timeout errors with a more user-friendly message
    if (error instanceof QueueError && error.message === 'Request timed out') {
      throw new QueueError('Request is taking longer than expected. Please try again.', error);
    }
    // Handle all other errors
    if (error instanceof QueueError) {
      throw error;
    }
    throw new QueueError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      error
    );
  }
}
