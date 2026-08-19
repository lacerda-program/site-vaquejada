import React, { useState } from 'react';
import type { VaquejadaEvent, TicketSector } from '../types';
import { ChevronLeft, MapPin, Calendar, Users, Star, ShieldCheck, Share2, Info, Ticket } from 'lucide-react';

interface EventDetailsViewProps {
  event: VaquejadaEvent;
  onBack: () => void;
  onGoToCheckout: (selections: { sector: TicketSector; quantity: number }[]) => void;
}

export const EventDetailsView: React.FC<EventDetailsViewProps> = ({
  event,
  onBack,
  onGoToCheckout,
}) => {
  // Store quantities for each sector by sector.id
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  const handleIncrement = (sectorId: string, status: string) => {
    if (status === 'soldout') return;
    setQuantities((prev) => ({
      ...prev,
      [sectorId]: Math.min((prev[sectorId] || 0) + 1, 10), // cap at 10 tickets per CPF
    }));
  };

  const handleDecrement = (sectorId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [sectorId]: Math.max((prev[sectorId] || 0) - 1, 0),
    }));
  };

  const handleShare = () => {
    setCopiedLink(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Calculate totals
  const selectedSectors = event.sectors
    .map((sector) => ({
      sector,
      quantity: quantities[sector.id] || 0,
    }))
    .filter((item) => item.quantity > 0);

  const totalQuantity = selectedSectors.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = selectedSectors.reduce((sum, item) => sum + item.sector.price * item.quantity, 0);

  const handleProceedToCheckout = () => {
    if (totalQuantity === 0) return;
    onGoToCheckout(selectedSectors);
  };

  return (
    <div className="w-full pb-28">
      
      {/* Hero Banner & Back Navigation */}
      <div className="relative w-full h-[220px] sm:h-[350px] bg-charcoal-900">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sandy-50 to-transparent" />
        
        {/* Navigation Buttons Overlay */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 border border-sandy-100 text-charcoal-800 shadow-md hover:bg-sandy-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 border border-sandy-100 text-charcoal-800 shadow-md hover:bg-sandy-100 transition-colors text-xs font-bold"
          >
            <Share2 className="h-4 w-4 text-terracotta-500" />
            <span>{copiedLink ? 'Copiado!' : 'Compartilhar'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Event Metadata & Description */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Main Header Info Card */}
            <div className="bg-white rounded-2xl border border-sandy-100 p-6 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-terracotta-50 text-terracotta-700 text-xs font-extrabold px-3 py-1 rounded-full border border-terracotta-100 uppercase tracking-wide">
                  {event.state}
                </span>
                {event.certifiedAbva && (
                  <span className="bg-charcoal-800 text-white text-[10px] font-black px-2.5 py-1 rounded border border-charcoal-700 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-terracotta-400" /> Chancela ABVA
                  </span>
                )}
                {event.certifiedAbqm && (
                  <span className="bg-terracotta-700 text-white text-[10px] font-black px-2.5 py-1 rounded border border-terracotta-600 flex items-center gap-1">
                    <Star className="h-3 w-3 text-sandy-400" /> Chancela ABQM
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold text-charcoal-800 tracking-tight leading-tight m-0">
                {event.title}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-sandy-100 text-xs sm:text-sm text-charcoal-700 font-semibold">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-sandy-100 flex items-center justify-center text-terracotta-500 shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-charcoal-400 font-bold uppercase tracking-wider">Período</span>
                    <span>{event.dateRangeText}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-sandy-100 flex items-center justify-center text-terracotta-500 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-charcoal-400 font-bold uppercase tracking-wider">Localização</span>
                    <span>{event.park} • {event.city}/{event.state}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Description Card */}
            <div className="bg-white rounded-2xl border border-sandy-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-charcoal-800 mb-3">Sobre a Vaquejada</h2>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-normal">
                {event.description}
              </p>
              
              {/* Trust Badge Explanation */}
              <div className="mt-4 p-3.5 bg-sandy-50 rounded-xl border border-sandy-150 flex items-start gap-3">
                <Info className="h-5 w-5 text-terracotta-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed text-charcoal-600">
                  <span className="font-bold text-charcoal-800 block">Esporte & Bem-Estar Animal</span>
                  Este evento atende integralmente ao regulamento unificado das vaquejadas, com vistorias veterinárias completas na entrada e na saída dos animais, uso obrigatório de protetores de cauda e proibição de qualquer objeto cortante. Emoção na pista com responsabilidade!
                </div>
              </div>
            </div>

            {/* Lineup / Shows Card */}
            <div className="bg-white rounded-2xl border border-sandy-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-terracotta-500" />
                <h2 className="text-lg font-bold text-charcoal-800 m-0">Atrações Musicais Confirmadas</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {event.lineup.map((artist) => (
                  <div 
                    key={artist}
                    className="p-3 rounded-xl bg-sandy-50/50 border border-sandy-100 flex flex-col items-center justify-center text-center shadow-sm"
                  >
                    <span className="text-lg">🎤</span>
                    <span className="text-xs font-bold text-charcoal-800 mt-2 block">{artist}</span>
                    <span className="text-[9px] text-terracotta-600 font-bold uppercase tracking-wider mt-0.5">Show Ao Vivo</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Preview Card */}
            <div className="bg-white rounded-2xl border border-sandy-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-charcoal-800 mb-3">Como Chegar</h2>
              <div className="rounded-xl overflow-hidden aspect-[21/9] bg-sandy-100 relative border border-sandy-200">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#ddd_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center">
                  <div className="text-center p-4">
                    <MapPin className="h-8 w-8 text-terracotta-600 mx-auto animate-bounce" />
                    <span className="text-xs font-bold text-charcoal-800 block mt-2">{event.park}</span>
                    <span className="text-[10px] text-charcoal-500 block">{event.city} - {event.state}, Brasil</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Ticket Selector / Buy Form (Always visible, sticky helper on mobile) */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-sandy-150 p-6 shadow-md sticky top-20">
              <h2 className="text-lg font-extrabold text-charcoal-800 mb-4 flex items-center gap-2">
                <Ticket className="h-5 w-5 text-terracotta-500" />
                <span>Escolha seus Ingressos</span>
              </h2>

              <div className="space-y-4">
                {event.sectors.map((sector) => {
                  const qty = quantities[sector.id] || 0;
                  const isSoldOut = sector.batchStatus === 'soldout';
                  const isEnding = sector.batchStatus === 'ending';

                  return (
                    <div 
                      key={sector.id} 
                      className={`p-3.5 rounded-xl border transition-all ${
                        qty > 0 
                          ? 'border-terracotta-400 bg-terracotta-50/10' 
                          : 'border-sandy-150 bg-white hover:border-sandy-200'
                      }`}
                    >
                      {/* Title & Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-charcoal-800">{sector.name}</h4>
                          <span className="text-[10px] font-bold text-sandy-600 block mt-0.5">
                            {sector.batch}º Lote
                          </span>
                        </div>
                        {isSoldOut ? (
                          <span className="text-[9px] font-black uppercase bg-charcoal-200 text-charcoal-600 px-2 py-0.5 rounded">
                            Esgotado
                          </span>
                        ) : isEnding ? (
                          <span className="text-[9px] font-black uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded animate-pulse">
                            Quase Esgotado
                          </span>
                        ) : null}
                      </div>

                      {/* Description */}
                      {sector.description && (
                        <p className="text-[10px] text-charcoal-400 mt-2 font-normal">
                          {sector.description}
                        </p>
                      )}

                      {/* Pricing & Counter */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-sandy-100/50">
                        <div>
                          <span className="text-xs font-black text-charcoal-800">
                            R$ {sector.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>

                        {isSoldOut ? (
                          <span className="text-xs font-extrabold text-charcoal-400 italic">Indisponível</span>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleDecrement(sector.id)}
                              disabled={qty === 0}
                              className="h-7 w-7 rounded-lg border border-sandy-200 bg-white flex items-center justify-center text-charcoal-850 hover:bg-sandy-50 disabled:opacity-40 select-none font-bold text-sm"
                            >
                              -
                            </button>
                            <span className="text-xs font-black text-charcoal-800 w-4 text-center select-none">
                              {qty}
                            </span>
                            <button
                              onClick={() => handleIncrement(sector.id, sector.batchStatus)}
                              disabled={qty >= 10}
                              className="h-7 w-7 rounded-lg border border-sandy-250 bg-white flex items-center justify-center text-charcoal-850 hover:bg-sandy-50 disabled:opacity-40 select-none font-bold text-sm"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Urgency Summary Details */}
              {totalQuantity > 0 && (
                <div className="mt-4 p-3 bg-sandy-50 rounded-xl border border-sandy-150 text-[10px] text-charcoal-500 font-semibold space-y-1">
                  <div className="flex justify-between">
                    <span>Qtd selecionada:</span>
                    <span className="text-charcoal-800">{totalQuantity} ingresso(s)</span>
                  </div>
                  <div className="flex justify-between border-t border-sandy-100/80 pt-1">
                    <span>Total parcial:</span>
                    <span className="text-terracotta-600 font-bold">
                      R$ {totalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              )}

              {/* Conversion hook */}
              <button
                onClick={handleProceedToCheckout}
                disabled={totalQuantity === 0}
                className="w-full mt-5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-sandy-200 text-white font-bold py-3 text-xs sm:text-sm shadow-md shadow-terracotta-200/25 transition-all select-none disabled:shadow-none uppercase tracking-wider"
              >
                {totalQuantity > 0 ? 'Avançar para Checkout' : 'Selecione os ingressos'}
              </button>

              <div className="text-center mt-3 text-[10px] text-charcoal-400 font-medium">
                🔒 Ambiente de pagamento 100% seguro.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. STICKY BOTTOM BUY BAR - CRITICAL FOR HIGH-CONVERSION MOBILE COMMERCE */}
      {totalQuantity > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-sandy-200 px-4 py-3.5 shadow-2xl flex items-center justify-between gap-4 md:hidden animate-in slide-in-from-bottom duration-300">
          <div>
            <span className="block text-[9px] font-bold text-charcoal-400 uppercase tracking-wider">
              {totalQuantity} ingresso(s) selecionado(s)
            </span>
            <span className="text-lg font-black text-terracotta-600 leading-none">
              R$ {totalPrice.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold px-6 py-3 text-xs uppercase tracking-wider shadow-md shrink-0 active:scale-95 transition-transform"
          >
            Comprar Agora
          </button>
        </div>
      )}

    </div>
  );
};
