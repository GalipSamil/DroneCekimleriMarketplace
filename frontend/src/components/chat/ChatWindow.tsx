import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { signalRService } from '../../services/signalr';
import { chatAPI } from '../../services/api';
import type { MessageDto } from '../../types';
import { X, Send, User } from 'lucide-react';

interface ChatWindowProps {
    receiverId: string;
    receiverName: string;
    onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ receiverId, receiverName, onClose }) => {
    const { userId } = useAuth();
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load conversation history
    useEffect(() => {
        chatAPI.getConversation(receiverId)
            .then((data) => setMessages(data || []))
            .catch((err) => console.error('Failed to load conversation', err));
    }, [receiverId]);

    // Focus input on open
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Subscribe to incoming real-time messages
    useEffect(() => {
        if (!userId) return;

        const token = localStorage.getItem('token');
        if (token) signalRService.startConnection(token);

        const unsubscribe = signalRService.onMessageReceived((rawMessage: unknown) => {
            const message = rawMessage as MessageDto;
            if (message.senderId === receiverId || message.receiverId === receiverId) {
                setMessages(prev => [...prev, message]);
            }
        });

        return () => unsubscribe();
    }, [userId, receiverId]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = newMessage.trim();
        if (!text || !receiverId || sending) return;

        try {
            setSending(true);
            setNewMessage('');
            await signalRService.sendMessage(receiverId, text);
        } catch (error) {
            console.error('Failed to send message', error);
            setNewMessage(text); // restore on failure
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    return (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-blue-600 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/50 flex items-center justify-center">
                        <User size={16} className="text-white" />
                    </div>
                    <span className="font-semibold text-white text-sm">{receiverName}</span>
                </div>
                <button onClick={onClose} className="text-blue-200 hover:text-white p-1 rounded-lg transition-colors">
                    <X size={18} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/80">
                {messages.length === 0 && (
                    <div className="text-center text-slate-500 text-sm mt-8">Konuşmayı başlatın...</div>
                )}
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                                msg.senderId === userId
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-slate-800 text-slate-200 rounded-bl-none'
                            }`}
                        >
                            <p className="leading-snug">{msg.content}</p>
                            <span className="text-[10px] opacity-60 block mt-1 text-right">
                                {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
                onSubmit={handleSend}
                className="px-3 py-3 border-t border-slate-700/80 bg-slate-900 shrink-0"
            >
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        placeholder="Mesaj yaz..."
                        autoComplete="off"
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
                    >
                        <Send size={17} className={sending ? 'animate-pulse' : ''} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;
