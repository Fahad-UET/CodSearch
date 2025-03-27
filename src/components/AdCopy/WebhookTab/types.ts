export interface WebhookResponse {
  text: string;
  error?: string;
}

export interface WebhookPayload {
  text: string;
}

export interface WebhookTabProps {
  onSave?: (url: string) => void;
}