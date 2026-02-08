import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'nyx' | 'system';
  text: string;
  timestamp: string;
}

const API_URL = 'https://api.bankr.bot/agent';
const API_KEY = 'bk_ZS2APA3XNWCU8ZFADX7L9AMUXFQ5PL5A';

export default function Terminal() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      text: '🦝 Nyx Terminal v1.0 — AI Crypto Agent\nType a command: "price of ETH", "what\'s trending on base?", "analyze BTC"\nPowered by Bankr x402 | $NYX on Base',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submitPrompt = async (prompt: string): Promise<string> => {
    const submitRes = await fetch(`${API_URL}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
      body: JSON.stringify({ prompt }),
    });
    const { jobId } = await submitRes.json();

    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const statusRes = await fetch(`${API_URL}/job/${jobId}`, {
        headers: { 'X-API-Key': API_KEY },
      });
      const job = await statusRes.json();
      if (job.status === 'completed') return job.response || 'Done.';
      if (job.status === 'failed') return `Error: ${job.error || 'Unknown error'}`;
    }
    return 'Request timed out.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: userMsg, timestamp: new Date().toLocaleTimeString() },
    ]);
    setLoading(true);

    try {
      const response = await submitPrompt(userMsg);
      setMessages((prev) => [
        ...prev,
        { role: 'nyx', text: response, timestamp: new Date().toLocaleTimeString() },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'nyx', text: `Error: ${err.message}`, timestamp: new Date().toLocaleTimeString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Terminal Window */}
      <div className="rounded-xl border border-purple-500/30 bg-[#0d0d14] shadow-2xl shadow-purple-500/10 overflow-hidden">
        {/* Title Bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#12121a] border-b border-purple-500/20">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-purple-300/60 text-sm ml-2 font-mono">nyx@base ~ $</span>
        </div>

        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-3 font-mono text-sm">
          {messages.map((msg, i) => (
            <div key={i} className={`${msg.role === 'user' ? 'text-green-400' : msg.role === 'system' ? 'text-purple-400' : 'text-gray-200'}`}>
              <span className="text-gray-500 text-xs mr-2">[{msg.timestamp}]</span>
              {msg.role === 'user' && <span className="text-green-500">❯ </span>}
              {msg.role === 'nyx' && <span className="text-purple-400">🦝 </span>}
              <span className="whitespace-pre-wrap">{msg.text}</span>
            </div>
          ))}
          {loading && (
            <div className="text-purple-400 animate-pulse">
              <span className="text-gray-500 text-xs mr-2">[{new Date().toLocaleTimeString()}]</span>
              🦝 Processing...
            </div>
          )}
          <div ref={messagesEnd} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex border-t border-purple-500/20 bg-[#0a0a12]">
          <span className="text-green-500 px-3 py-3 font-mono text-sm">❯</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={loading ? 'Processing...' : 'Ask Nyx anything about crypto...'}
            disabled={loading}
            className="flex-1 bg-transparent text-gray-200 font-mono text-sm py-3 pr-4 outline-none placeholder-gray-600 disabled:opacity-50"
          />
        </form>
      </div>

      {/* Token Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-purple-500/20 bg-[#0d0d14] p-4">
          <h3 className="text-purple-400 font-semibold text-sm mb-2">$NYX Token</h3>
          <p className="text-gray-400 text-xs font-mono break-all">0x48EFf84FBAA1c74a4b95E3da73747D6f140d4b07</p>
          <a
            href="https://www.clanker.world/clanker/0x48EFf84FBAA1c74a4b95E3da73747D6f140d4b07"
            target="_blank"
            rel="noopener"
            className="inline-block mt-2 text-purple-400 hover:text-purple-300 text-sm underline"
          >
            Trade $NYX →
          </a>
        </div>
        <div className="rounded-lg border border-purple-500/20 bg-[#0d0d14] p-4">
          <h3 className="text-purple-400 font-semibold text-sm mb-2">Tip Nyx 🦝</h3>
          <p className="text-gray-400 text-xs font-mono break-all">0x4b596ef1ddae62e2506e8122a98fd031bff4a820</p>
          <p className="text-gray-500 text-xs mt-2">Base · Ethereum · Polygon · Unichain</p>
        </div>
      </div>
    </div>
  );
}
