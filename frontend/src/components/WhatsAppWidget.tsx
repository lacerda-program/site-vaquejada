import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, ChevronRight } from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

interface WhatsAppWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  isOpen,
  onClose,
  onOpen,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Olá! Sou o Mandacaru, assistente virtual da Sertão Tickets. Como posso te ajudar hoje?',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    { text: 'Segunda via de ingresso', reply: 'Para baixar seus ingressos ativos, basta acessar a aba "Meus Ingressos" no topo da página e informar seu CPF e telefone. Eles estarão disponíveis com QR Code para leitura no portão.' },
    { text: 'Como funciona o PIX?', reply: 'O pagamento via PIX é instantâneo e sem taxas! No checkout, geramos um QR Code e um código "Copia e Cola". Assim que você fizer o pagamento no aplicativo do seu banco, nosso sistema identifica a transação em segundos e seus ingressos aparecem na carteira.' },
    { text: 'Chancela ABVA / ABQM', reply: 'Todos os eventos listados em nosso portal contam com chancelas oficiais (ABVA e/ou ABQM). Isso garante fiscalização veterinária rígida, bem-estar animal dos bois e cavalos, e pontuação oficial nos rankings nacionais.' },
    { text: 'Falar com atendente', reply: 'Vou te redirecionar para um de nossos atendentes da região! Clique no botão "Conversar via WhatsApp" abaixo para iniciar a conversa direta no WhatsApp de plantão.' }
  ];

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Trigger typing simulation
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      // Determine reply
      let botReply = 'Entendi! Para essa dúvida específica, recomendo falar direto com nosso suporte local. Vou preparar seu link de atendimento.';
      
      const foundMatch = suggestedQuestions.find(
        (q) => q.text.toLowerCase().includes(textToSend.toLowerCase()) || 
               textToSend.toLowerCase().includes(q.text.toLowerCase())
      );

      if (foundMatch) {
        botReply = foundMatch.reply;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: botReply,
          timestamp: new Date(),
        },
      ]);
    }, 1200);
  };

  const getDirectWhatsAppUrl = () => {
    const defaultText = 'Olá suporte Sertão Tickets, gostaria de tirar uma dúvida sobre ingressos de Vaquejada.';
    const encodedText = encodeURIComponent(inputText || defaultText);
    return `https://wa.me/5579999999999?text=${encodedText}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl shadow-green-200 border-2 border-white hover:bg-green-600 hover:scale-105 active:scale-95 transition-all duration-300 relative group"
        >
          <MessageCircle className="h-6.5 w-6.5 fill-current animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 text-[8px] font-black text-white items-center justify-center">1</span>
          </span>
          {/* Tooltip */}
          <span className="absolute right-16 bg-charcoal-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Precisa de ajuda? Fale conosco!
          </span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[500px] rounded-2xl bg-white shadow-2xl border border-sandy-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-green-600 px-4 py-3 flex items-center justify-between text-white border-b border-green-700">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                🌵
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">Suporte Sertão Tickets</h4>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-300 animate-ping"></span>
                  <span className="text-[10px] text-green-100 font-medium">Assistente Mandacaru ativo</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Box */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-sandy-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="h-7 w-7 rounded-full bg-green-100 text-green-700 text-[10px] flex items-center justify-center font-bold shrink-0 shadow-sm">
                    🌵
                  </div>
                )}
                <div
                  className={`rounded-xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-terracotta-500 text-white rounded-tr-none'
                      : 'bg-white text-charcoal-800 rounded-tl-none border border-sandy-100'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`block text-[8px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/60' : 'text-charcoal-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 mr-auto items-center">
                <div className="h-7 w-7 rounded-full bg-green-100 text-green-700 text-[10px] flex items-center justify-center font-bold shrink-0">
                  🌵
                </div>
                <div className="bg-white rounded-xl px-3 py-2 border border-sandy-100 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-charcoal-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-charcoal-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-charcoal-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Quick FAQ Options */}
          {messages.length === 1 && !isTyping && (
            <div className="p-3 bg-white border-t border-sandy-100">
              <span className="text-[10px] uppercase font-bold text-sandy-600 tracking-wider block mb-1.5 px-1">
                Perguntas Frequentes
              </span>
              <div className="grid grid-cols-1 gap-1">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q.text}
                    onClick={() => handleSendMessage(q.text)}
                    className="flex items-center justify-between text-left text-xs text-charcoal-700 hover:text-terracotta-600 bg-sandy-50 hover:bg-sandy-100/75 p-2 rounded-lg transition-colors border border-sandy-100 group"
                  >
                    <span>{q.text}</span>
                    <ChevronRight className="h-3 w-3 text-sandy-400 group-hover:text-terracotta-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input & Call-to-action */}
          <div className="p-3 bg-white border-t border-sandy-200 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder="Escreva sua mensagem..."
                className="flex-1 rounded-lg border border-sandy-200 bg-sandy-50 px-3 py-1.5 text-xs text-charcoal-800 outline-none focus:border-green-500 focus:bg-white"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim()}
                className="h-8 w-8 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Direct WhatsApp Call */}
            <a
              href={getDirectWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-lg text-xs font-bold transition-colors text-center"
            >
              <MessageCircle className="h-3.5 w-3.5 fill-current" />
              Conversar via WhatsApp Real
            </a>
          </div>

        </div>
      )}
    </div>
  );
};
