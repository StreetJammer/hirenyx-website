import type { APIRoute } from 'astro';
import { BankrClient } from '@bankr/sdk';

export const prerender = false;

const PRIVATE_KEY = '0x48594da43ff8e0bade65a0c4a3f4f69f26b76a6af614de1d0b5adf4d5f5dc5b9' as `0x${string}`;

let client: BankrClient | null = null;
function getClient() {
  if (!client) {
    client = new BankrClient({
      privateKey: PRIVATE_KEY,
      network: 'base',
    });
  }
  return client;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Prompt required' }), { status: 400 });
    }

    const bankr = getClient();
    const result = await bankr.promptAndWait({
      prompt,
      timeout: 60000,
      interval: 2000,
      maxAttempts: 30,
    });

    return new Response(JSON.stringify({
      response: result.response || 'No response received.',
      status: result.status,
      richData: result.richData || [],
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Bankr API error:', err);
    return new Response(JSON.stringify({ 
      error: err.message || 'Something went wrong',
    }), { status: 500 });
  }
};
