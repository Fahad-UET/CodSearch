import axios from 'axios';
import { MAKE_CONFIG } from './config';

export interface MakeWebhookPayload {
  event: string;
  data: string | any;
  // data: Record<string, any>;
}

export const makeService = {
  async sendWebhook(payload: MakeWebhookPayload) {
    try {
      // Ensure payload is serializable by converting dates to ISO strings
      const serializedPayload = JSON.parse(JSON.stringify(payload));

      const response = await axios.post(
        MAKE_CONFIG.webhookUrl,
        serializedPayload,
        { 
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout for voice generation
        }
      );
      return response.data;
    } catch (error) {
      // Log error details but don't expose internal error to user
      console.error('Make webhook error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        payload: JSON.stringify(payload)
      });
      throw new Error('Failed to send webhook to Make');
    }
  },

  async generateVoiceOver(text: string) {
    return this.sendWebhook({
      event: 'voiceover.generate',
      data: {
        text,
        timestamp: new Date().toISOString()
      }
    });
  },

  async triggerProductCreated(product: any) {
    // Clean product data before sending
    const cleanProduct = {
      ...product,
      createdAt: product.createdAt?.toISOString(),
      updatedAt: product.updatedAt?.toISOString()
    };

    return this.sendWebhook({
      event: 'product.created',
      data: {
        product: cleanProduct,
        timestamp: new Date().toISOString()
      }
    });
  },

  async triggerProductUpdated(product: any) {
    // Clean product data before sending
    const cleanProduct = {
      ...product,
      createdAt: product.createdAt?.toISOString(),
      updatedAt: product.updatedAt?.toISOString()
    };

    return this.sendWebhook({
      event: 'product.updated',
      data: {
        product: cleanProduct,
        timestamp: new Date().toISOString()
      }
    });
  }
};