import { ChatMessage } from '@/types';

export default function MessageBox({
    messages,
    chatLoading,
    loading,
    loadingMessage,
    errorMessage,
}: {
    messages: ChatMessage[];
    chatLoading: boolean;
    loading: boolean;
    loadingMessage: string;
    errorMessage: string;
}) {
    return (
        <div className="flex-1 overflow-auto p-4">
            {messages.map((msg, index) => (
                <div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div
                        className={`inline-block p-4 rounded-lg ${
                            msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                    >
                        {msg.role === 'user' ? (
                            msg.content
                        ) : (
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg">{msg.content.projectName}</h3>
                                <p>{msg.content.text}</p>

                                <div className="space-y-2">
                                    {msg.content.steps.map((step, stepIndex) => (
                                        <div key={stepIndex} className="flex flex-col">
                                            <div className="font-medium">
                                                Step {step.step}: {step.description}
                                            </div>
                                            {step.command && (
                                                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded mt-1">
                                                    <code className="flex-1">{step.command}</code>
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(step.command!)}
                                                        className="px-2 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
                                                    >
                                                        Copy
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {chatLoading && (
                <div className="text-left">
                    <div className="inline-block p-4 rounded-lg bg-gray-200">
                        <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="text-left">
                    <div className="inline-block p-4 rounded-lg bg-gray-200">
                        <div className="flex items-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                            <span>{loadingMessage}</span>
                        </div>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="text-left">
                    <div className="inline-block p-4 rounded-lg bg-red-100 text-red-700 border border-red-300">
                        <div className="flex items-center gap-2">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            <span>{errorMessage}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
