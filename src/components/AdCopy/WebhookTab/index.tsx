import { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { useWebhook } from './useWebhook';
import { makeService } from '@/services/make';

export function WebhookTab() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [text, setText] = useState('');
  const {sendWebhook} = makeService;
  // to resolve build issue please check this
  // const { sendWebhook, response, error, loading } = useWebhook();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.trim() || !text.trim()) return;
    // to resolve build issue please check this
    // await sendWebhook(webhookUrl, text);
    await sendWebhook({event: webhookUrl, data: text});
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="webhook" className="block text-sm font-medium text-gray-700">
            Webhook URL
          </label>
          <input
            id="webhook"
            type="url"
            value={webhookUrl}
            onChange={e => setWebhookUrl(e.target.value)}
            placeholder="https://..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700">
            Text to Send
          </label>
          <textarea
            id="text"
            value={text}
            onChange={e => setText(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter your text here..."
            required
          />
        </div>

        <button
          type="submit"
          // to resolve build issue please check this
          // disabled={loading}
          disabled={false}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {/* // to resolve build issue please check this */}
          {/* {loading ? (
            'Sending...'
          ) : (
            <> */}
              <Send className="w-4 h-4 mr-2" />
              Send
            {/* </>
          )} */}
        </button>
      </form>
      {/* // to resolve build issue please check this */}
      {/* {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )} */}
{/* // to resolve build issue please check this */}
      {/* {response && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Response</label>
          <div className="mt-1 p-4 rounded-md bg-gray-50 text-sm text-gray-900">
            {response}
          </div>
        </div>
      )} */}
    </div>
  );
}