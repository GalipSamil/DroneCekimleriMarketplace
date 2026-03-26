import * as signalR from '@microsoft/signalr';

type MessageReceivedHandler = (message: unknown) => void;

class SignalRService {
    private connection: signalR.HubConnection | null = null;
    private messageHandlers: MessageReceivedHandler[] = [];
    private isConnected = false;

    public get connected() {
        return this.isConnected;
    }


    public async startConnection(token: string) {
        if (this.connection) return;

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5025/chathub', {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();

        this.connection.on('ReceiveMessage', (message: unknown) => {
            console.log('New message received:', message);
            this.messageHandlers.forEach(handler => handler(message));
        });

        try {
            await this.connection.start();
            console.log('SignalR Connected');
            this.isConnected = true;
        } catch (err) {
            console.error('SignalR Connection Error: ', err);
            this.isConnected = false;
        }
    }

    public async sendMessage(receiverId: string, content: string) {
        if (!this.connection) return;
        try {
            await this.connection.invoke('SendMessage', { receiverId, content });
        } catch (err) {
            console.error('Error sending message: ', err);
        }
    }

    public onMessageReceived(handler: MessageReceivedHandler) {
        this.messageHandlers.push(handler);
        // Return unsubscribe function
        return () => {
            this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
        };
    }

    public stopConnection() {
        if (this.connection) {
            this.connection.stop();
            this.connection = null;
            this.isConnected = false;
        }
    }
}

export const signalRService = new SignalRService();
