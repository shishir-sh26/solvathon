import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export default function StudentChatBot() {
  // Using local state so it works instantly without editing your store
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: 'SYSTEM: Career Assistant online. I can help you find jobs, analyze your skill gaps, or prep for interviews. What do you need?' 
    }
  ]);

  const toggleBot = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // 1. Add user message
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');

    // 2. Simulate AI thinking (We will wire this to FastAPI later)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'Analyzing profile... (Backend connection pending)' 
      }]);
    }, 600);
  };

  return (
    <>
      {/* 1. THE TRIGGER BUTTON (Brutalist Style) */}
      <button 
        onClick={toggleBot}
        className={`fixed bottom-8 right-8 p-4 border-4 border-black transition-all z-9999 flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] ${
          isOpen ? 'bg-black text-white' : 'bg-yellow-400 text-black'
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      {/* 2. THE CHAT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 w-[90vw] sm:w-[400px] bg-white border-4 border-black z-9990 flex flex-col shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] font-sans h-[550px] max-h-[80vh]">
          
          {/* Header */}
          <div className="bg-yellow-400 text-black p-4 border-b-4 border-black flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-black rounded-full animate-pulse"></div>
              <h3 className="font-black text-xl uppercase tracking-wider">Career Bot</h3>
            </div>
            <span className="text-[10px] bg-black text-white px-2 py-1 font-black uppercase tracking-widest border-2 border-transparent">
              ONLINE
            </span>
          </div>
          
          {/* Message History Area */}
          <div className="flex-1 p-5 overflow-y-auto bg-gray-50 flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`max-w-[85%] p-3 border-2 border-black text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white self-end text-right' 
                    : 'bg-white text-black self-start text-left'
                }`}
              >
                <div className={`text-[10px] uppercase font-black mb-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                  {msg.role === 'user' ? 'YOU' : 'ASSISTANT'}
                </div>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t-4 border-black flex gap-3">
            <input 
              type="text" 
              placeholder="ASK ABOUT JOBS OR SKILLS..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-gray-100 border-2 border-black px-4 py-3 text-sm font-bold uppercase tracking-wide placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-4 focus:ring-yellow-400 transition-all"
            />
            <button 
              onClick={handleSend}
              className="bg-black text-white p-3 border-2 border-black hover:bg-yellow-400 hover:text-black transition-colors flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
            >
              <Send size={20} />
            </button>
          </div>

        </div>
      )}
    </>
  );
}