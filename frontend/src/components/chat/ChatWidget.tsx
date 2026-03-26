import { useState } from 'react';
import ChatWindow from './ChatWindow';
import { MessageSquare } from 'lucide-react';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    // In a real app, this state might come from clicking "Message" on a profile
    // For now, let's just show a global chat button that opens a chat with a specific user or list
    // This is a placeholder for the integration logic

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 z-50"
            >
                <MessageSquare size={24} />
            </button>
            {isOpen && (
                <ChatWindow
                    // For demo purposes, we need a receiverId. 
                    // In real flow, you click "Message" on a pilot's profile.
                    // This global widget could be a "Recent Chats" list instead.
                    // Let's pass null to indicate "List Mode" (which we haven't implemented yet in ChatWindow)
                    // Or hardcode a receiver for testing if we know one.
                    receiverId="some-pilot-id"
                    receiverName="Demo Pilot"
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default ChatWidget;
