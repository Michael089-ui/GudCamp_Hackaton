import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ChatOption } from '../types';
import { ChatBubbleLeftRightIcon, XMarkIcon, PhoneIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const chatFlow: Record<string, { text: React.ReactNode; options?: ChatOption[] }> = {
    'initial': {
        text: "¡Hola! 👋 Soy tu asistente virtual de GodCamp. ¿Cómo puedo ayudarte hoy?",
        options: [
            { text: "Consultar tipos de crédito", action: 'credit-types' },
            { text: "Simular crédito según cosecha", action: 'simulate-credit' },
            { text: "Hablar con un asesor", action: 'talk-advisor' },
            { text: "¿Qué documentos necesito?", action: 'faq-documents' },
        ]
    },
    'credit-types': {
        text: "Ofrecemos tres planes principales: Plan Semilla (microcréditos ágiles), Plan Cosecha (créditos a mediano plazo) y Plan Raíz (financiamiento para grandes proyectos).",
        options: [
            { text: "Ver todos los planes", action: '/plans', isExternalLink: true },
            { text: "Volver al inicio", action: 'initial' }
        ]
    },
    'simulate-credit': {
        text: "¡Claro! La mejor forma de saber cuánto puedes pedir es usando nuestra Calculadora Financiera Inteligente. Te permite ingresar datos como tu cultivo y hectáreas para darte una proyección precisa.",
        options: [
            { text: "Ir a la Calculadora", action: '/calculator', isExternalLink: true },
            { text: "Volver al inicio", action: 'initial' }
        ]
    },
    'talk-advisor': {
        text: "Con gusto te conecto con un experto. Elige tu opción preferida:",
        options: [
            { text: "Contactar por WhatsApp", action: 'https://wa.me/573001234567', isAction: true },
            { text: "Llamar a un Asesor", action: 'tel:+573001234567', isAction: true },
            { text: "Volver al inicio", action: 'initial' }
        ]
    },
    'faq-documents': {
        text: "Para iniciar, solo necesitas tu documento de identidad y datos básicos sobre tu cultivo. Nuestro proceso es 100% digital para hacerlo más fácil y rápido para ti.",
        options: [
            { text: "¿Cuál es la tasa de interés?", action: 'faq-interest' },
            { text: "Volver al inicio", action: 'initial' }
        ]
    },
    'faq-interest': {
        text: "Nuestras tasas de interés son dinámicas y personalizadas. Comienzan alrededor del 1.3% - 1.5% mensual y se ajustan según tu tipo de cultivo y producción. ¡Usa la calculadora para obtener una tasa sugerida!",
        options: [
            { text: "Ir a la Calculadora", action: '/calculator', isExternalLink: true },
            { text: "Volver al inicio", action: 'initial' }
        ]
    }
};


const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ 
                id: Date.now(), 
                ...chatFlow['initial'],
                sender: 'bot'
            }]);
        }
    }, [isOpen, messages.length]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleOptionClick = (option: ChatOption) => {
        // Add user's choice as a message
        const userMessage: ChatMessage = {
            id: Date.now(),
            text: option.text,
            sender: 'user',
        };
        setMessages(prev => [...prev, userMessage]);

        // Handle different action types
        if (option.isExternalLink) {
            navigate(option.action);
            setIsOpen(false);
            return;
        }

        if (option.isAction) {
            window.open(option.action, '_blank');
            return;
        }

        // Add bot's response after a short delay
        setTimeout(() => {
            const botResponse = chatFlow[option.action];
            if (botResponse) {
                const newBotMessage: ChatMessage = {
                    id: Date.now() + 1,
                    ...botResponse,
                    sender: 'bot',
                };
                setMessages(prev => [...prev, newBotMessage]);
            }
        }, 500);
    };

    const toggleChat = () => setIsOpen(!isOpen);

    return (
        <>
            <button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-brand-green to-brand-gold text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform z-[999]"
                aria-label="Abrir chat de ayuda"
            >
                <ChatBubbleLeftRightIcon className="h-8 w-8" />
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm h-[70vh] max-h-[600px] flex flex-col bg-white rounded-2xl shadow-2xl animate-slideUp z-[998] origin-bottom-right">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-brand-green to-brand-gold p-4 text-white flex justify-between items-center rounded-t-2xl">
                        <div>
                            <h3 className="font-bold text-lg font-heading">Asistente Virtual</h3>
                            <p className="text-sm opacity-90">GodCamp te ayuda</p>
                        </div>
                        <button onClick={toggleChat} aria-label="Cerrar chat">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-brand-beige">
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col animate-messageFadeIn ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-brand-green text-white rounded-br-none' : 'bg-white text-brand-dark rounded-bl-none border border-slate-200'}`}>
                                        <div className="text-sm">
                                          {msg.text}
                                        </div>
                                    </div>
                                    {msg.sender === 'bot' && msg.options && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {msg.options.map((opt, index) => (
                                                 <button 
                                                    key={index} 
                                                    onClick={() => handleOptionClick(opt)}
                                                    className={`px-3 py-1.5 text-sm rounded-full font-semibold transition-colors ${
                                                        opt.isAction 
                                                        ? 'bg-sky-500 text-white hover:bg-sky-600' 
                                                        : 'bg-white border border-brand-green text-brand-green hover:bg-brand-green-light'
                                                    }`}
                                                >
                                                    {opt.action.startsWith('tel:') && <PhoneIcon className="h-4 w-4 inline mr-1.5"/>}
                                                    {opt.text}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
