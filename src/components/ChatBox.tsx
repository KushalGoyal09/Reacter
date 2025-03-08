import { ChatMessage } from '@/types';
import MessageBox from './MessageBox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon } from 'lucide-react';

export default function ChatBox({
    messages,
    input,
    setInput,
    handleSendMessage,
    chatLoading,
    loading,
    loadingMessage,
    errorMessage,
}: {
    messages: ChatMessage[];
    input: string;
    setInput: (input: string) => void;
    handleSendMessage: () => void;
    chatLoading: boolean;
    loading: boolean;
    loadingMessage: string;
    errorMessage: string;
}) {
    return (
        <div className="flex flex-col h-full border-r border-border">
            <div className="p-4 border-b border-border">
                <h2 className="font-semibold">Chat</h2>
            </div>
            <MessageBox
                messages={messages}
                chatLoading={chatLoading}
                loading={loading}
                loadingMessage={loadingMessage}
                errorMessage={errorMessage}
            />
            <div className="p-4 border-t border-border mt-auto">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                    className="flex gap-2"
                >
                    <Input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1"
                        placeholder="Type your message..."
                    />
                    <Button type="submit" disabled={chatLoading}>
                        <SendIcon size={16} className={chatLoading ? 'mr-2 animate-spin' : 'mr-2'} />
                        Send
                    </Button>
                </form>
            </div>
        </div>
    );
}
