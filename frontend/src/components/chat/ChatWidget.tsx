import { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import { MessageSquare, X } from 'lucide-react';
import { chatAPI } from '../../services/api';
import type { MessageDto } from '../../types';
import { useAuth } from '../../context/AuthContext';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [activeChat, setActiveChat] = useState<{ receiverId: string; receiverName: string } | null>(null);
    const [recentMessages, setRecentMessages] = useState<MessageDto[]>([]);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) return;
        chatAPI.getUnreadCount().then(setUnreadCount).catch(() => {});
        chatAPI.getRecentMessages().then(setRecentMessages).catch(() => {});
    }, [isAuthenticated, isOpen]);

    if (!isAuthenticated) return null;

    return (
        <>
            {/* Chat bubble button */}
            <button
                onClick={() => { setIsOpen(!isOpen); setActiveChat(null); }}
                className="fixed bottom-4 right-4 p-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-xl z-50 transition-all hover:scale-110"
            >
                {isOpen ? <X size={22} /> : (
                    <div className="relative">
                        <MessageSquare size={22} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </div>
                )}
            </button>

            {/* Active Chat Window */}
            {isOpen && activeChat && (
                <ChatWindow
                    receiverId={activeChat.receiverId}
                    receiverName={activeChat.receiverName}
                    onClose={() => setActiveChat(null)}
                />
            )}

            {/* Recent Conversations List */}
            {isOpen && !activeChat && (
                <div className="fixed bottom-20 right-4 w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-slate-700/80 bg-blue-600 rounded-t-2xl">
                        <h3 className="text-white font-bold text-base">Mesajlar</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {recentMessages.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm">
                                <MessageSquare size={28} className="mx-auto mb-2 opacity-50" />
                                Henüz bir konuşma yok.
                            </div>
                        ) : (
                            recentMessages.map((msg) => {
                                const otherUserId = msg.senderId;
                                const otherUserName = msg.senderName;
                                return (
                                    <button
                                        key={msg.id}
                                        onClick={() => setActiveChat({ receiverId: otherUserId, receiverName: otherUserName })}
                                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800 text-left transition-colors border-b border-slate-800/50"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                                            {otherUserName.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-semibold text-sm truncate">{otherUserName}</p>
                                            <p className="text-slate-400 text-xs truncate">{msg.content}</p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
