import React, { useState } from 'react';
import { Send, Bot, Mic } from 'lucide-react';
import { useBotStore } from '../../../store/useBotStore';

const ChatWindow: React.FC = () => {
    const { messages, addMessage, isProcessing, setIsProcessing } = useBotStore();
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMsg = { role: 'user' as const, content: input };
        addMessage(userMsg);
        setInput('');
        setIsProcessing(true);

        try {
            // In a real app, call the backend /api/bot/query
            setTimeout(() => {
                addMessage({ role: 'assistant', content: `I'm Jarvis! You asked about "${input}". Currently browsing placement records...` });
                setIsProcessing(false);
            }, 1000);
        } catch (error) {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-[100] overflow-hidden transition-all transform scale-100 origin-bottom-right">
            {/* Header */}
            <div className="p-4 bg-primary-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center border-2 border-primary-400">
                        <Bot size={24} />
                    </div>
                    <div>
                        <p className="font-bold">Jarvis Pro</p>
                        <p className="text-xs opacity-80">AI Recruitment Agent</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 && (
                    <div className="text-center py-10">
                        <Bot size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-400 text-sm">How can I help you today?</p>
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            {['Upcoming interviews?', 'Resume score?', 'Top candidates?'].map(q => (
                                <button key={q} onClick={() => setInput(q)} className="px-3 py-1 bg-white border rounded-full text-xs text-gray-500 hover:border-primary-500 transition">
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isProcessing && (
                    <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm space-x-1 flex">
                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></span>
                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-300"></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2">
                    <input 
                        className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                        placeholder="Type a command..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button className="text-gray-400 hover:text-primary-600"><Mic size={20} /></button>
                    <button onClick={handleSend} className="text-primary-600 font-bold"><Send size={20} /></button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
