import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext'; // Assuming AuthContext exists
import { signalRService } from '../../services/signalr';
import { chatAPI } from '../../services/api';
import type { MessageDto } from '../../types';
import { X, Send, User } from 'lucide-react';

interface ChatWindowProps {
    receiverId?: string; // If null, maybe show recent conversations
    receiverName?: string;
    onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ receiverId, receiverName, onClose }) => {
    const { userId } = useAuth();
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial load
    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const data = await chatAPI.getConversation(receiverId!);
                setMessages(data || []);
            } catch (error) {
                console.error('Failed to load conversation', error);
            }
        };

        if (receiverId) {
            fetchConversation();
        }
    }, [receiverId]);

    // SignalR listener
    useEffect(() => {
        if (!userId) return;

        // Start connection if not started - verify if we should do it here or globally
        // For now, assuming Global start or start here
        const token = localStorage.getItem('token'); // or however we store it
        if (token) {
            signalRService.startConnection(token);
        }

        const unsubscribe = signalRService.onMessageReceived((rawMessage: unknown) => {
            const message = rawMessage as MessageDto;
            if (message.senderId === receiverId || message.receiverId === receiverId) {
                setMessages(prev => [...prev, message]);
            }
        });

        return () => {
            unsubscribe();
            // Don't stop connection as other components might need it
        };
    }, [userId, receiverId]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);



    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !receiverId) return;

        try {
            await signalRService.sendMessage(receiverId, newMessage);
            setNewMessage('');
            // Optimistic update? Or wait for 'ReceiveMessage' event which comes back to sender too?
            // ChatHub sends back to Caller, so we wait for event.
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col border border-gray-200 dark:border-gray-700 z-50">
            {/* Header */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-blue-600 rounded-t-lg flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    <User size={18} />
                    <span className="font-semibold">{receiverName || 'Chat'}</span>
                </div>
                <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded">
                    <X size={18} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] p-2 rounded-lg text-sm ${msg.senderId === userId
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                                }`}
                        >
                            <p>{msg.content}</p>
                            <span className="text-xs opacity-70 block mt-1 text-right">
                                {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Mesaj yaz..."
                        className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;
