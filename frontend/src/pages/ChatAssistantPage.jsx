import React, { useState, useEffect, useRef } from 'react';
import { 
  BotMessageSquare, Send, Sparkles, RefreshCw, User, 
  Building2, ExternalLink, HelpCircle, ArrowRight, ShieldCheck
} from 'lucide-react';
import { sendChatMessage, resetChat } from '../services/api';
import ServiceCard from '../components/ServiceCard';

export default function ChatAssistantPage({ onExploreGraph }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Namaste! I am the Intelligent Government Services AI Assistant. I use Semantic Knowledge Reasoning to help citizens find official services, required documents, and procedures. Ask me anything, or try one of the suggested prompts below!",
      quickReplies: [
        "How can I change my house location in Aadhaar?",
        "I lost my identity card.",
        "Where can I renew my driving licence?",
        "How do I apply for a PAN card?"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const msg = textToSend || input;
    if (!msg.trim()) return;

    // Append user message immediately
    const userMsg = { role: 'user', text: msg.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage(msg.trim(), sessionId);
      if (res.sessionId) setSessionId(res.sessionId);
      if (res.reply) {
        setMessages(prev => [...prev, res.reply]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', text: "I encountered a communication error with the backend reasoning engine. Please ensure the backend is running." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = async () => {
    if (sessionId) {
      try {
        await resetChat(sessionId);
      } catch (e) {}
    }
    setMessages([
      {
        role: 'assistant',
        text: "Conversation reset. How may I assist you with government services today?",
        quickReplies: [
          "How can I change my house location in Aadhaar?",
          "I lost my identity card.",
          "Where can I renew my driving licence?",
          "Apply for caste certificate"
        ]
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12 space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-800 flex items-center justify-center text-white shadow">
            <BotMessageSquare className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Module 6
              </span>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                AI Citizen Assistant
              </h1>
            </div>
            <p className="text-xs text-slate-500">
              Interactive conversational reasoner with multi-turn disambiguation
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-slate-50/40">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div 
                key={idx} 
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 shadow-sm ${
                  isUser ? 'bg-blue-700 text-white' : 'bg-slate-900 text-amber-400'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <BotMessageSquare className="w-4 h-4" />}
                </div>

                {/* Message Bubble Content */}
                <div className={`max-w-[85%] space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser 
                      ? 'bg-blue-700 text-white rounded-tr-none shadow-sm' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                  }`}>
                    {/* Render Text */}
                    <div className="whitespace-pre-wrap">
                      {msg.text}
                    </div>

                    {/* Disambiguation Option Buttons (Module 6 Demo) */}
                    {msg.isDisambiguation && msg.options && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                        {msg.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => handleSendMessage(opt.value)}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition flex items-center space-x-1"
                          >
                            <span>{opt.label}</span>
                            <ArrowRight className="w-3 h-3 text-blue-600" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Embedded Service Card if provided */}
                  {msg.serviceCard && (
                    <div className="w-full">
                      <ServiceCard 
                        service={msg.serviceCard} 
                        onExploreGraph={onExploreGraph} 
                      />
                    </div>
                  )}

                  {/* Quick Reply Pills */}
                  {msg.quickReplies && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickReplies.map((qr, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => handleSendMessage(qr)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-slate-200/80 hover:bg-blue-100 hover:text-blue-800 text-slate-700 font-medium transition"
                        >
                          {qr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
                <BotMessageSquare className="w-4 h-4" />
              </div>
              <div className="p-3.5 bg-white border border-slate-200 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center space-x-2 shadow-sm">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Consulting ontology taxonomy & evaluating rules...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Box */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. 'I lost my identity card' or 'Aadhaar address change')..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white rounded-xl shadow transition"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
