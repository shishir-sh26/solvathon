import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export default function ChatWindow({ context }: { context?: string }) {
  // 1. FIXED: Replaced Zustand with a simple local state toggle!
  const [isJarvisActive, setIsJarvisActive] = useState(false);
  
  // Local state for the chat inputs and messages
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: `SYSTEM: Jarvis initialized for ${context || 'user'}. I have full access to placement records. How can I assist?` }
  ]);

  const toggleJarvis = () => setIsJarvisActive(!isJarvisActive);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // 1. Add the user's message to the chat
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    
    // 2. Clear the input field
    setInput('');

    // 3. Simulate a bot response (You will connect this to FastAPI SQL Agent later)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'Processing query... (Connect backend here)' 
      }]);
    }, 600);
  };

  return (
    <>
      {/* 1. THE TRIGGER BUTTON */}
      <button 
        onClick={toggleJarvis}
        className="fixed bottom-6 right-6 p-4 bg-black text-white border-2 border-black hover:bg-gray-800 transition-colors z-[9999] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
      >
        {isJarvisActive ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* 2. THE CHAT WINDOW */}
      {isJarvisActive && (
        <div className="fixed bottom-24 right-6 w-[90vw] sm:w-96 bg-white border-4 border-black z-[9990] flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-sans h-[500px] max-h-[80vh]">
          
          {/* Header */}
          <div className="bg-black text-white p-4 border-b-4 border-black flex justify-between items-center">
            <h3 className="font-bold text-lg uppercase tracking-wider">Placement Bot</h3>
            <span className="text-xs bg-white text-black px-2 py-1 font-bold">ONLINE</span>
          </div>
          
          {/* Message History Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`max-w-[85%] p-3 border-2 border-black text-sm font-medium ${
                  msg.role === 'user' 
                    ? 'bg-white self-end text-right' 
                    : 'bg-gray-200 self-start text-left'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">
                  {msg.role === 'user' ? 'You' : 'Jarvis'}
                </div>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t-4 border-black flex gap-2">
            <input 
              type="text" 
              placeholder="Type a command..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-white border-2 border-black px-3 py-2 text-sm font-bold placeholder-gray-400 focus:outline-none focus:bg-gray-100 transition-colors"
            />
            <button 
              onClick={handleSend}
              className="bg-black text-white p-2 border-2 border-black hover:bg-gray-800 transition-colors flex items-center justify-center w-12"
            >
              <Send size={18} />
            </button>
          </div>

        </div>
      )}
    </>
  );
}