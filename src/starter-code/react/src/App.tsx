import { Code2, Sparkles } from "lucide-react";

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <Code2 className="h-16 w-16 text-indigo-600" />
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Reacter <span className="text-indigo-600">AI</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Your intelligent coding companion. Write better React
                        code faster with AI-powered assistance.
                    </p>
                    <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Start Coding
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
