import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/Button';
import { getChatResponse } from '../services/geminiService';
import { Send, Bot, User } from 'lucide-react';

export const SupportChat: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
      {role: 'model', text: 'Jambo! I am SafariSure Support. Ask me about our policies, claim process, or road safety.'}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: 'user' as const, text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    const response = await getChatResponse(input, history);
    setMessages([...newMessages, { role: 'model', text: response }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700 font-bold">←</button>
        <div>
            <h3 className="font-bold text-gray-900">Support Chat</h3>
            <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
            </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user' 
                    ? 'bg-green-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                }`}>
                    {msg.text}
                </div>
            </div>
        ))}
        {loading && (
             <div className="flex justify-start">
                <div className="bg-white text-gray-500 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-200 text-xs animate-pulse">
                    Typing...
                </div>
             </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
            <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
            <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 disabled:opacity-50"
            >
                <Send size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};