import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatWithAI } from '../services/ai';
import {
    Send,
    Bot,
    Loader2,
    X,
    Sparkles,
    Minimize2,
} from 'lucide-react';

export default function AIAssistant() {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const chatRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
        });
    }, [messages, loading]);



    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                isOpen &&
                chatRef.current &&
                !chatRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen]);


    // Close chatbot and navigate to product
    const handleProductClick = (slug) => {
        setIsOpen(false);
        navigate(`/products/${slug}`);
    };


    const handleSend = async (e) => {
        e.preventDefault();
        const text = message.trim();
        if (!text || loading) return;

        setMessages((prev) => [
            ...prev,
            {
                role: 'user',
                content: text,
            },
        ]);

        setMessage('');
        setLoading(true);

        try {
            const response = await chatWithAI(text);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: response.data.answer,
                    products: response.data.products || [],
                },
            ]);
        } catch (error) {
            console.error('AI chat error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content:
                        'Sorry, I could not process your request right now.',
                    products: [],
                },
            ]);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {/* =====================================================
                CHAT WINDOW
            ===================================================== */}
            {isOpen && (
                <div
                    ref={chatRef}
                    className="fixed bottom-8 right-4 sm:right-5 z-50
                    w-[calc(100vw-2rem)] sm:w-97.5 max-w-97.5"
                >
                    <div
                        className=" bg-white rounded-3xl shadow-2xl
                            border border-slate-200 overflow-hidden
                            flex flex-col h-[min(650px,calc(100vh-7rem))]"
                    >
                        {/* ==========
                            HEADER
                        ============== */}
                        <div
                            className="bg-linear-to-r from-sky-500 to-sky-500
                            text-white px-5 py-4 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3 min-w-0">

                                {/* Bot Avatar */}
                                <div
                                    className="relative w-11 h-11 shrink-0 rounded-2xl bg-white/15
                                        border border-white/60 backdrop-blur-sm
                                        flex items-center justify-center"
                                >
                                    <Bot className="w-6 h-6" />
                                    {/* Online dot */}
                                    <span
                                        className="absolute -right-0.5 -bottom-0.5
                                            w-3 h-3 rounded-full bg-emerald-400
                                            border-2 border-sky-500"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="font-extrabold text-sm">
                                            RuralKart AI
                                        </h3>

                                        <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                                    </div>

                                    <p className="text-[11px] text-sky-100">
                                        Your personal shopping assistant
                                    </p>
                                </div>
                            </div>

                            {/* Header buttons */}
                            <div className="flex items-center gap-1 shrink-0">

                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="w-9 h-9 rounded-xl hover:bg-white/15
                                        flex items-center justify-center transition"
                                    title="Minimize"
                                >
                                    <Minimize2 className="w-4 h-4" />
                                </button>

                            </div>
                        </div>


                        {/* ===========
                            MESSAGES
                        ============== */}
                        <div
                            className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50"
                        >
                            {/* Empty state */}
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center px-6">

                                    <div
                                        className="w-16 h-16 rounded-3xl bg-sky-100
                                            text-sky-500 flex items-center justify-center mb-4"
                                    >
                                        <Bot className="w-8 h-8" />
                                    </div>

                                    <h4 className="font-extrabold text-slate-900 text-base">
                                        Hi! I'm RuralKart AI 👋
                                    </h4>

                                    <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-xs">
                                        I can help you find products, compare
                                        options, or discover something within
                                        your budget.
                                    </p>

                                    {/* Quick questions */}
                                    <div className="mt-5 space-y-2 w-full max-w-xs">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setMessage(
                                                    'Show me products under ₹1000'
                                                )
                                            }
                                            className="w-full text-left px-3 py-2.5 rounded-xl bg-white
                                                border border-slate-200 text-xs
                                                font-semibold text-slate-700
                                                hover:border-sky-300 hover:bg-sky-50
                                                transition"
                                        >
                                            💰 Products under ₹1000
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setMessage(
                                                    'Show me some traditional handicraft products'
                                                )
                                            }
                                            className="w-full text-left px-3 py-2.5 rounded-xl bg-white
                                                border border-slate-200 text-xs
                                                font-semibold text-slate-700
                                                hover:border-sky-300 hover:bg-sky-50
                                                transition"
                                        >
                                            🪵 Traditional handicrafts
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setMessage(
                                                    'What would be a good gift?'
                                                )
                                            }
                                            className="w-full text-left px-3 py-2.5 rounded-xl bg-white
                                                border border-slate-200 text-xs
                                                font-semibold text-slate-700
                                                hover:border-sky-300 hover:bg-sky-50
                                                transition"
                                        >
                                            🎁 Find me a gift
                                        </button>

                                    </div>
                                </div>
                            )}


                            {/* Conversation */}
                            {messages.map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex ${item.role === 'user'
                                        ? 'justify-end'
                                        : 'justify-start'
                                        }`}
                                >
                                    <div
                                        className={`max-w-[88%] px-4 py-3 rounded-2xl text-sm
                                            ${item.role === 'user' ?
                                                `bg-sky-500 text-white rounded-br-md`
                                                : `bg-white border border-slate-200
                                                   text-slate-700 rounded-bl-md shadow-sm`
                                            }`}
                                    >
                                        <p className="whitespace-pre-line leading-relaxed">
                                            {item.content}
                                        </p>


                                        {/* Product Cards */}
                                        {item.products?.length > 0 && (
                                            <div className="mt-3 space-y-2">

                                                {item.products.map((product) => (
                                                    <div
                                                        key={product.id}
                                                        className="bg-white
                                                            border border-slate-200
                                                            rounded-xl overflow-hidden shadow-sm"
                                                    >
                                                        <div className="flex gap-3 p-2.5">

                                                            {/* Image */}
                                                            <div
                                                                className="w-20 h-20
                                                                    shrink-0 rounded-lg
                                                                    overflow-hidden
                                                                    bg-slate-100
                                                                "
                                                            >
                                                                {product.image ? (
                                                                    <img
                                                                        src={product.image}
                                                                        alt={product.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                                                                        No image
                                                                    </div>
                                                                )}
                                                            </div>


                                                            {/* Product Info */}
                                                            <div className="min-w-0 flex-1">

                                                                <h4 className="font-bold text-sm text-slate-900 line-clamp-2">
                                                                    {product.name}
                                                                </h4>

                                                                <p className="text-sm font-extrabold text-sky-600 mt-1">
                                                                    ₹
                                                                    {Number(
                                                                        product.price
                                                                    ).toLocaleString(
                                                                        'en-IN'
                                                                    )}
                                                                </p>

                                                                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                                                                    {product.stock_quantity}{' '}
                                                                    in stock
                                                                </p>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleProductClick(product.slug)}
                                                                    className="
                                                                        mt-1.5
                                                                        text-xs
                                                                        font-bold
                                                                        text-sky-600
                                                                        hover:text-sky-700
                                                                    "
                                                                >
                                                                    View Product →
                                                                </button>

                                                            </div>

                                                        </div>
                                                    </div>
                                                ))}

                                            </div>
                                        )}

                                    </div>
                                </div>
                            ))}


                            {/* Loading */}
                            {loading && (
                                <div className="flex justify-start">
                                    <div
                                        className="bg-white border border-slate-200
                                            px-4 py-3 rounded-2xl rounded-bl-md shadow-sm"
                                    >
                                        <div className="flex items-center gap-2">

                                            <Loader2
                                                className="w-4 h-4 animate-spin text-sky-500"
                                            />

                                            <span className="text-xs text-slate-400">
                                                RuralKart AI is thinking...
                                            </span>

                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />

                        </div>


                        {/* =================================================
                            INPUT
                        ================================================= */}
                        <form
                            onSubmit={handleSend}
                            className="
                                p-3
                                border-t
                                border-slate-200
                                bg-white
                            "
                        >
                            <div className="flex items-center gap-2">

                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(e.target.value)
                                    }
                                    placeholder="Ask RuralKart AI..."
                                    disabled={loading}
                                    className="flex min-w-0 px-4 py-3 rounded-xl bg-slate-100
                                        border border-slate-200 text-sm outline-none
                                        focus:border-sky-400 focus:bg-white focus:ring-2
                                        focus:ring-sky-100 transition"
                                />

                                <button
                                    type="submit"
                                    disabled={!message.trim() || loading}
                                    className="w-11 h-11 shrink-0 rounded-xl bg-sky-500
                                        hover:bg-sky-600 text-white
                                        flex items-center justify-center transition
                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </button>

                            </div>

                            <p className="text-[10px] text-slate-400 text-center mt-2">
                                RuralKart AI • Shopping assistance
                            </p>

                        </form>

                    </div>
                </div>
            )}


            {/* =========================================================
                FLOATING CHAT BUTTON
            ========================================================= */}
            {!isOpen && (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-5 right-5 z-50 w-15 h-15 sm:w-16 sm:h-16 rounded-full
                    bg-sky-500 hover:bg-sky-600 text-white shadow-xl shadow-sky-500/30
                    border-2 border-white flex items-center justify-center hover:scale-105
                    active:scale-95 transition-all duration-200"
                    aria-label="Open RuralKart AI"
                >
                    {/* Bot icon */}
                    <Bot className="w-8 h-8 sm:w-9 sm:h-9" />

                    {/* AI sparkle */}
                    <span
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white
                         text-sky-500 flex items-center justify-center shadow-md"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                    </span>

                    {/* Online indicator */}
                    <span className="absolute bottom-0 right-0 w-4 h-4 
                    rounded-full bg-emerald-400 border-2 border-white"/>
                </button>
            )}
        </>
    );
}