import React, { useState, useEffect } from 'react';
import type { VaquejadaEvent, TicketSector, PurchasedTicket } from '../types';
import { ArrowLeft, CreditCard, ShieldCheck, Copy, Clock, CheckCircle } from 'lucide-react';

interface CheckoutViewProps {
  event: VaquejadaEvent;
  selections: { sector: TicketSector; quantity: number }[];
  onBack: () => void;
  onPaymentSuccess: (newTickets: PurchasedTicket[]) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  event,
  selections,
  onBack,
  onPaymentSuccess,
}) => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [activeTab, setActiveTab] = useState<'pix' | 'cc'>('pix');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // PIX Mock Code
  const pixCode = `00020101021226870014br.gov.bcb.pix2565sertaotickets-pix-transfer-sandbox-vaquejada-prod-${event.id}-${Date.now()}520400005303986540612.005802BR5925SERTAO TICKETS LTDA6007LAGARTO62070503***6304D1A2`;

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mask formats
  const handleCpfChange = (val: string) => {
    const numbersOnly = val.replace(/\D/g, '');
    if (numbersOnly.length > 11) return;
    
    // Apply CPF mask (000.000.000-00)
    let masked = numbersOnly;
    if (numbersOnly.length > 9) {
      masked = `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(3, 6)}.${numbersOnly.slice(6, 9)}-${numbersOnly.slice(9)}`;
    } else if (numbersOnly.length > 6) {
      masked = `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(3, 6)}.${numbersOnly.slice(6)}`;
    } else if (numbersOnly.length > 3) {
      masked = `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(3)}`;
    }
    setCpf(masked);
  };

  const handleWhatsappChange = (val: string) => {
    const numbersOnly = val.replace(/\D/g, '');
    if (numbersOnly.length > 11) return;

    // Apply WhatsApp mask ((00) 00000-0000)
    let masked = numbersOnly;
    if (numbersOnly.length > 6) {
      masked = `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2, 7)}-${numbersOnly.slice(7)}`;
    } else if (numbersOnly.length > 2) {
      masked = `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2)}`;
    } else if (numbersOnly.length > 0) {
      masked = `(${numbersOnly}`;
    }
    setWhatsapp(masked);
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Validate CPF formula (simple length validation and basic numbers)
  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) tempErrors.name = 'Nome completo é obrigatório';
    
    const rawCpf = cpf.replace(/\D/g, '');
    if (rawCpf.length !== 11) tempErrors.cpf = 'Insira um CPF válido com 11 dígitos';
    
    const rawWa = whatsapp.replace(/\D/g, '');
    if (rawWa.length < 10) tempErrors.whatsapp = 'Insira um WhatsApp válido com DDD';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSimulatePayment = () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate database update and ticket creation
    setTimeout(() => {
      const ticketsCreated: PurchasedTicket[] = [];

      selections.forEach((sel) => {
        for (let i = 0; i < sel.quantity; i++) {
          const ticketId = `ST-${Math.floor(100000 + Math.random() * 900000)}`;
          ticketsCreated.push({
            id: ticketId,
            eventId: event.id,
            eventTitle: event.title,
            eventDateText: event.dateRangeText,
            parkName: event.park,
            cityState: `${event.city}/${event.state}`,
            sectorName: sel.sector.name,
            price: sel.sector.price,
            attendeeName: name,
            attendeeCpf: cpf.replace(/\D/g, ''),
            purchaseDate: new Date().toLocaleDateString('pt-BR'),
            qrCodeData: `VALIDATE-TICKET-${ticketId}-${event.id}`,
          });
        }
      });

      setIsProcessing(false);
      onPaymentSuccess(ticketsCreated);
    }, 1500); // 1.5 second simulated delay
  };

  const totalAmount = selections.reduce((sum, item) => sum + item.sector.price * item.quantity, 0);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pixCode)}`;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-xs font-bold text-charcoal-700 hover:text-terracotta-600 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Voltar para Detalhes</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Attendee Details & Payment Screen */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Attendee Info */}
          <div className="bg-white rounded-2xl border border-sandy-100 p-6 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-charcoal-800 mb-4 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-terracotta-50 text-terracotta-700 flex items-center justify-center font-bold text-xs">
                1
              </span>
              <span>Dados do Comprador / Titular</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-charcoal-600 uppercase tracking-wider mb-1.5">
                  Nome Completo (Sem abreviações)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Samuel da Silva Lacerda"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm text-charcoal-800 outline-none transition-colors ${
                    errors.name ? 'border-red-500 bg-red-50/10' : 'border-sandy-200 bg-sandy-50 focus:border-terracotta-400 focus:bg-white'
                  }`}
                />
                {errors.name && <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.name}</span>}
              </div>

              {/* CPF */}
              <div>
                <label className="block text-xs font-bold text-charcoal-600 uppercase tracking-wider mb-1.5">
                  CPF (Para emissão do ingresso)
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => handleCpfChange(e.target.value)}
                  placeholder="000.000.000-00"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm text-charcoal-800 outline-none transition-colors ${
                    errors.cpf ? 'border-red-500 bg-red-50/10' : 'border-sandy-200 bg-sandy-50 focus:border-terracotta-400 focus:bg-white'
                  }`}
                />
                {errors.cpf && <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.cpf}</span>}
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-charcoal-600 uppercase tracking-wider mb-1.5">
                  WhatsApp (Para suporte & avisos)
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => handleWhatsappChange(e.target.value)}
                  placeholder="(79) 99999-9999"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm text-charcoal-800 outline-none transition-colors ${
                    errors.whatsapp ? 'border-red-500 bg-red-50/10' : 'border-sandy-200 bg-sandy-50 focus:border-terracotta-400 focus:bg-white'
                  }`}
                />
                {errors.whatsapp && <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.whatsapp}</span>}
              </div>

            </div>
          </div>

          {/* Step 2: Payment Option (PIX emphasized) */}
          <div className="bg-white rounded-2xl border border-sandy-100 p-6 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-charcoal-800 mb-4 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-terracotta-50 text-terracotta-700 flex items-center justify-center font-bold text-xs">
                2
              </span>
              <span>Escolha o Meio de Pagamento</span>
            </h2>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('pix')}
                className={`py-3 px-4 rounded-xl border text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'pix'
                    ? 'border-emerald-500 bg-emerald-50/15 text-emerald-800 shadow-sm'
                    : 'border-sandy-200 bg-sandy-50 text-charcoal-650 hover:bg-sandy-100/50'
                }`}
              >
                <span className="text-base">📱</span>
                <span>PIX Copia e Cola / QR Code</span>
                <span className="text-[8px] uppercase tracking-wide bg-emerald-500 text-white px-1.5 py-0.2 rounded font-black mt-0.5">
                  Aprovação Imediata
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cc')}
                className={`py-3 px-4 rounded-xl border text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'cc'
                    ? 'border-terracotta-500 bg-terracotta-50/10 text-terracotta-800 shadow-sm'
                    : 'border-sandy-200 bg-sandy-50 text-charcoal-650 hover:bg-sandy-100/50'
                }`}
              >
                <CreditCard className="h-5 w-5 text-terracotta-600" />
                <span>Cartão de Crédito</span>
                <span className="text-[8px] uppercase tracking-wide bg-charcoal-800 text-white px-1.5 py-0.2 rounded font-black mt-0.5">
                  Indisponível na Simulação
                </span>
              </button>
            </div>

            {/* PIX Payment Drawer */}
            {activeTab === 'pix' ? (
              <div className="bg-sandy-50/50 rounded-2xl border border-sandy-150 p-5 flex flex-col items-center">
                
                {/* Timer Countdown */}
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-1.5 rounded-xl text-xs font-bold mb-5">
                  <Clock className="h-4 w-4 shrink-0 animate-spin" />
                  <span>Código PIX expira em:</span>
                  <span className="font-extrabold text-sm font-mono text-terracotta-600">{formatTime(timeLeft)}</span>
                </div>

                {/* Simulated QR Code */}
                <div className="bg-white p-4 rounded-2xl border border-sandy-200 shadow-sm select-none">
                  <img
                    src={qrCodeUrl}
                    alt="PIX QR Code Simulation"
                    className="h-[160px] w-[160px]"
                  />
                </div>
                <p className="text-[10px] text-charcoal-400 font-semibold text-center mt-2.5 max-w-xs leading-relaxed">
                  Abra o aplicativo do seu banco, escolha a opção "Pagar via PIX QR Code" e aponte a câmera para a imagem acima.
                </p>

                {/* Copy/Paste Code Area */}
                <div className="w-full mt-6 border-t border-sandy-200 pt-5">
                  <span className="block text-[10px] font-bold text-charcoal-500 uppercase tracking-wider mb-2">
                    Código PIX Copia e Cola
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={pixCode}
                      className="flex-1 rounded-xl border border-sandy-200 bg-sandy-100 p-2.5 text-[10px] text-charcoal-500 font-mono overflow-ellipsis outline-none select-all"
                    />
                    <button
                      onClick={copyPixCode}
                      className="h-10 px-4 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-sm"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>

                {/* Simulation Button */}
                <div className="w-full mt-6 bg-white rounded-xl border border-sandy-200 p-4 text-center">
                  <span className="text-xs text-charcoal-500 font-semibold block mb-2.5">
                    Este é um ambiente simulado. Use o botão abaixo para aprovar o pagamento PIX e gerar seus ingressos.
                  </span>
                  
                  <button
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-sandy-300 text-white font-bold px-6 py-2.5 text-xs uppercase tracking-wider shadow-md shadow-emerald-100/50 flex items-center justify-center gap-2 mx-auto disabled:scale-100 hover:scale-102 transition-all"
                  >
                    {isProcessing ? (
                      <>
                        <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Confirmando transação...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4.5 w-4.5" />
                        <span>Confirmar Pagamento Simulado</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            ) : (
              <div className="text-center py-10 bg-sandy-50 border border-sandy-150 rounded-2xl">
                <span className="text-2xl">💳</span>
                <h4 className="text-sm font-bold text-charcoal-800 mt-2">Pagamento via Cartão Indisponível</h4>
                <p className="text-[10px] text-charcoal-450 mt-1 max-w-xs mx-auto">
                  Para fins desta simulação de e-commerce de Vaquejada, apenas o pagamento via PIX (Copia e Cola e QR Code) está liberado para testes rápidos.
                </p>
                <button
                  onClick={() => setActiveTab('pix')}
                  className="mt-3.5 text-xs text-terracotta-600 hover:text-terracotta-700 font-bold underline"
                >
                  Voltar para o PIX
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Checkout Summary Cart */}
        <div>
          <div className="bg-white rounded-2xl border border-sandy-150 p-5 shadow-md sticky top-20">
            <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-800 border-b border-sandy-100 pb-3 mb-4">
              Resumo da Compra
            </h3>

            {/* Event Header Details */}
            <div className="mb-4">
              <span className="text-[10px] font-bold text-white bg-charcoal-800 px-1.5 py-0.2 rounded shrink-0">
                {event.state}
              </span>
              <h4 className="text-sm font-bold text-charcoal-800 mt-1.5 leading-tight">{event.title}</h4>
              <p className="text-[10px] text-charcoal-400 font-semibold mt-1">
                📍 {event.park}
              </p>
              <p className="text-[10px] text-charcoal-400 font-semibold">
                📅 {event.startDate} a {event.endDate}
              </p>
            </div>

            {/* Ticket Items Grid */}
            <div className="space-y-3 border-t border-b border-sandy-100 py-4 mb-4 text-xs">
              {selections.map((item) => (
                <div key={item.sector.id} className="flex justify-between items-start">
                  <div>
                    <span className="font-extrabold text-charcoal-850 block">{item.sector.name}</span>
                    <span className="text-[10px] text-charcoal-405">
                      {item.quantity}x R$ {item.sector.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <span className="font-bold text-charcoal-800">
                    R$ {(item.sector.price * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>

            {/* Final Cost */}
            <div className="flex justify-between items-baseline mb-4">
              <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">Total Geral</span>
              <span className="text-xl font-black text-terracotta-600">
                R$ {totalAmount.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* Support details */}
            <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl flex items-start gap-2 text-[10px] font-medium leading-relaxed">
              <ShieldCheck className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Dificuldades para pagar?</span>
                Abra nosso canal de suporte flutuante no canto inferior direito para ajuda imediata.
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
