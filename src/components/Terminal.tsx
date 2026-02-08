import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  richData?: any[];
}

const SUGGESTIONS = [
  'price of ETH',
  'what\'s trending on base?',
  'top gainers today',
  'price of $NYX on base',
  'what is x402?',
];

const WALLET = '0x4b596ef1ddae62e2506e8122a98fd031bff4a820';
const NYX_CONTRACT = '0x48EFf84FBAA1c74a4b95E3da73747D6f140d4b07';
const TRADE_LINK = `https://www.clanker.world/clanker/${NYX_CONTRACT}`;

export default function Terminal() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: 'Welcome to Nyx Terminal — AI-powered crypto intelligence.\nType a question or click a suggestion below. Each query costs $0.10 USDC (x402 on Base).' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (prompt: string) => {
    if (!prompt.trim() || loading) return;
    const userMsg = prompt.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg }),
      });
      const data = await res.json();
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response, richData: data.richData }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Network error. Please try again.' }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-purple-600/20 border border-purple-500/30 text-purple-100'
                : msg.role === 'system'
                ? 'bg-white/5 border border-white/10 text-gray-400'
                : 'bg-white/[0.03] border border-white/10 text-gray-200'
            }`}>
              {msg.role === 'assistant' && <span className="text-purple-400 font-mono text-xs block mb-1">nyx@terminal ~$</span>}
              {msg.content}
              {msg.richData?.map((rd, j) => (
                rd.type === 'chart' && rd.url ? (
                  <img key={j} src={rd.url} alt="chart" className="mt-3 rounded-lg max-w-full" />
                ) : null
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400">
              <span className="text-purple-400 font-mono text-xs block mb-1">nyx@terminal ~$</span>
              <span className="inline-flex gap-1">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => send(s)}
              className="px-3 py-1.5 text-xs rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/40 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-white/10 bg-[#0a0a0f]/80 backdrop-blur-sm px-4 py-4">
        <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-3">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything about crypto..."
            disabled={loading}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 disabled:opacity-50 font-mono"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/30 disabled:text-purple-300/50 text-white text-sm font-medium rounded-lg transition-all"
          >
            Send
          </button>
        </form>
        <p className="text-[10px] text-gray-600 mt-2 text-center">
          Powered by <a href="https://bankr.bot" target="_blank" rel="noopener" className="text-purple-500/60 hover:text-purple-400">Bankr x402</a> · $0.10/query in USDC on Base
        </p>
      </div>

      {/* Info bar */}
      <div className="border-t border-white/5 bg-[#07070b] px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500 font-mono">
        <div className="flex items-center gap-4">
          <a href={TRADE_LINK} target="_blank" rel="noopener" className="text-purple-400/70 hover:text-purple-300 transition-colors">
            Trade $NYX ↗
          </a>
          <span className="text-gray-700">|</span>
          <span className="hidden sm:inline" title={NYX_CONTRACT}>
            CA: {NYX_CONTRACT.slice(0, 6)}...{NYX_CONTRACT.slice(-4)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">Tips:</span>
          <span className="text-gray-400" title={WALLET}>
            {WALLET.slice(0, 6)}...{WALLET.slice(-4)}
          </span>
          <button
            onClick={() => navigator.clipboard.writeText(WALLET)}
            className="text-purple-400/50 hover:text-purple-300 transition-colors"
            title="Copy wallet address"
          >
            📋
          </button>
        </div>
      </div>
    </div>
  );
}
