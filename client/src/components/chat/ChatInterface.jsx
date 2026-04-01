import React, { useEffect, useRef, useState } from 'react'
import { Send, MessageSquare, Sparkles } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import api from '../../config/axiosconfig';
import MarkdownRenderer from '../common/MarkdownRenderer';
import Spinner from '../common/Spinner';

const ChatInterface = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);

  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setInitialLoading(true);
      try {
        const { data } = await api.get(`/ai/chat-history/${id}`);
        setChatHistory(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch chat history');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchHistory();

  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai/chat', {
        documentId: id,
        query: userMessage.content,
      });
      const assistantMessage = {
        role: 'assistant',
        content: data?.data?.answer || data?.answer || '...',
        timestamp: new Date().toISOString(),
      };
      setChatHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to chat with document');
      setChatHistory((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === 'user';
    return (
      <div key={index} className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : ''}`}>
        {!isUser && (
          <div className='w-9 h-9 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center shrink-0'>
            <Sparkles className='w-4 h-4 text-white' strokeWidth={2} />
          </div>
        )}
        <div className={`max-w-lg p-4 rounded-2xl shadow-sm ${isUser
          ? 'bg-linear-to-br from-emerald-500 to-teal-500 text-white rounded-br-md'
          : 'bg-white border border-slate-200/60 text-slate-800 rounded-bl-md'
          }`}>
          {isUser ? (
            <p className='text-sm leading-relaxed'>{msg.content}</p>
          ) : (
            <div className='prose prose-sm max-w-none prose-slate'>
              <MarkdownRenderer content={msg.content} />
            </div>
          )}
        </div>
        {isUser && (
          <div className='w-9 h-9 rounded-xl bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-700 font-semibold text-sm shrink-0 shadow-sm'>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className='flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl items-center justify-center shadow-xl shadow-slate-200/50'>
        <div className='w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-8'>
          <MessageSquare className='w-7 h-7 text-emerald-600' strokeWidth={2} />
        </div>
        <Spinner />
        <p className='text-sm text-slate-500 mt-3 font-medium'>Loading chat history...</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 shadow-xl shadow-slate-200/50'>
      {/* Message area */}
      <div className='flex-1 p-6 overflow-y-auto bg-linear-to-br from-slate-50/50 via-white-50 to-slate-50/50'>
        {chatHistory.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-center'>
            <div className='w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10'>
              <MessageSquare className='w-8 h-8 text-emerald-600' strokeWidth={2} />
            </div>
            <h3 className='text-base font-semibold text-slate-900 mb-2'>Start a Conversation</h3>
            <p className='text-slate-500 text-sm'>Ask me anything about the document</p>
          </div>
        ) : (
          chatHistory.map(renderMessage)
        )}

        <div ref={messagesEndRef}>
          {loading && (
            <div className='flex items-center gap-3 my-4'>
              <div className='w-9 h-9 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center shrink-0'>
                <Sparkles className='w-4 h-4 text-white' strokeWidth={2} />
              </div>
              <div className='flex items-center gap-2 px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-slate-200'>
                <div className='flex gap-1'>
                  <span className='w-2 h-2 bg-slate-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></span>
                  <span className='w-2 h-2 bg-slate-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></span>
                  <span className='w-2 h-2 bg-slate-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className='p-5 border-t border-slate-200/60 bg-white/80'>
        <form onSubmit={handleSendMessage} className='flex items-center gap-3'>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Ask a follow-up question'
            className='flex-1 h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-400 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10'
            disabled={loading}
          />
          <button
            type='submit'
            disabled={loading || !message.trim()}
            className='shrink-0 w-12 h-12 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl flex items-center justify-center transition-colors duration-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:opacity-50'
          >
            <Send className='w-5 h-5 text-white' strokeWidth={2} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;