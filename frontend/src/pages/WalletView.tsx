import React, { useState } from 'react';
import type { PurchasedTicket } from '../types';
import { Search, ShieldCheck, Ticket, Smartphone, MapPin, Calendar, User } from 'lucide-react';

interface WalletViewProps {
  tickets: PurchasedTicket[];
  onExploreEvents: () => void;
}

export const WalletView: React.FC<WalletViewProps> = ({ tickets, onExploreEvents }) => {
  const [cpfSearch, setCpfSearch] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Mask CPF input (000.000.000-00)
  const handleCpfChange = (val: string) => {
    const numbersOnly = val.replace(/\D/g, '');
    if (numbersOnly.length > 11) return;
    
    let masked = numbersOnly;
    if (numbersOnly.length > 9) {
      masked = `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(3, 6)}.${numbersOnly.slice(6, 9)}-${numbersOnly.slice(9)}`;
    } else if (numbersOnly.length > 6) {
      masked = `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(3, 6)}.${numbersOnly.slice(6)}`;
    } else if (numbersOnly.length > 3) {
      masked = `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(3)}`;
    }
    setCpfSearch(masked);
  };

  // Filter tickets by CPF search if entered, otherwise show all purchased in current session
  const rawSearch = cpfSearch.replace(/\D/g, '');
  
  const displayedTickets = rawSearch 
    ? tickets.filter((t) => t.attendeeCpf === rawSearch) 
    : tickets;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-terracotta-50 flex items-center justify-center text-terracotta-600 mb-3 border border-terracotta-100">
          <Ticket className="h-6 w-6 -rotate-12" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-800 tracking-tight leading-tight m-0">
          Área do Cliente • Meus Ingressos
        </h1>
        <p className="text-xs text-charcoal-450 mt-1.5 max-w-sm mx-auto">
          Consulte seus ingressos ativos informando o CPF utilizado durante a compra.
        </p>
      </div>

      {/* CPF Search Form */}
      <div className="bg-white rounded-2xl border border-sandy-150 p-5 shadow-sm mb-8">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-charcoal-600 uppercase tracking-wider mb-1.5">
              Digite seu CPF
            </label>
            <input
              type="text"
              value={cpfSearch}
              onChange={(e) => handleCpfChange(e.target.value)}
              placeholder="000.000.000-00"
              className="w-full rounded-xl border border-sandy-200 bg-sandy-50 px-3.5 py-2.5 text-xs sm:text-sm text-charcoal-850 outline-none focus:border-terracotta-400 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-md shadow-terracotta-100/50"
          >
            <Search className="h-4 w-4" />
            <span>Consultar Ingressos</span>
          </button>
        </form>
      </div>

      {/* Ticket List Results */}
      {displayedTickets.length > 0 ? (
        <div className="space-y-8">
          
          {/* Low Bandwidth Offline Alert - Strategic for Rural Parks */}
          <div className="p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs leading-relaxed font-semibold">
            <Smartphone className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-charcoal-850 block">Dica para o dia do Evento!</span>
              Como as arenas de vaquejada ficam em áreas rurais de difícil sinal de internet, tire um **print do seu QR Code agora** para garantir que você conseguirá acessar a catraca mesmo sem dados móveis ativos!
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedTickets.map((ticket) => {
              const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(ticket.qrCodeData)}`;
              
              return (
                <div 
                  key={ticket.id}
                  className="bg-white rounded-2xl border border-sandy-150 overflow-hidden shadow-md flex flex-col hover:border-terracotta-300 transition-colors"
                >
                  {/* Top Bar stub - Header */}
                  <div className="bg-charcoal-800 text-white px-5 py-4 border-b border-charcoal-700">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-terracotta-400 tracking-wider">
                        Ingresso Oficial
                      </span>
                      <span className="text-[10px] font-mono text-sandy-300">
                        {ticket.id}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-white mt-1 leading-snug line-clamp-1">
                      {ticket.eventTitle}
                    </h3>
                  </div>

                  {/* Core Ticket Content Details */}
                  <div className="p-5 flex-1 space-y-3.5 text-xs text-charcoal-700">
                    
                    {/* Location */}
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-terracotta-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[9px] text-charcoal-400 font-bold uppercase tracking-wider">Local</span>
                        <span className="font-bold">{ticket.parkName}</span>
                        <span className="block text-[10px] text-charcoal-500">{ticket.cityState}</span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-terracotta-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[9px] text-charcoal-400 font-bold uppercase tracking-wider">Data</span>
                        <span className="font-bold">{ticket.eventDateText}</span>
                      </div>
                    </div>

                    {/* Sector */}
                    <div className="flex items-start gap-2">
                      <Ticket className="h-4 w-4 text-terracotta-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[9px] text-charcoal-400 font-bold uppercase tracking-wider">Setor Adquirido</span>
                        <span className="font-bold text-terracotta-600 uppercase tracking-wide">
                          {ticket.sectorName}
                        </span>
                      </div>
                    </div>

                    {/* Attendee */}
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-terracotta-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[9px] text-charcoal-400 font-bold uppercase tracking-wider">Nome Completo</span>
                        <span className="font-bold">{ticket.attendeeName}</span>
                        <span className="block text-[10px] text-charcoal-450">CPF: ***.***.{ticket.attendeeCpf.slice(-5, -2)}-{ticket.attendeeCpf.slice(-2)}</span>
                      </div>
                    </div>

                  </div>

                  {/* Scalloped ticket divider design */}
                  <div className="relative h-4 flex items-center justify-between">
                    {/* Left scallop hole */}
                    <div className="absolute -left-2.5 h-5 w-5 bg-sandy-50 border border-sandy-150 rounded-full"></div>
                    {/* Dashed line */}
                    <div className="w-full border-t-2 border-dashed border-sandy-200 mx-5"></div>
                    {/* Right scallop hole */}
                    <div className="absolute -right-2.5 h-5 w-5 bg-sandy-50 border border-sandy-150 rounded-full"></div>
                  </div>

                  {/* Bottom Stub - Barcode QR Area */}
                  <div className="p-5 bg-sandy-50/50 flex flex-col items-center border-t border-sandy-100">
                    
                    {/* Simulated QR Code image */}
                    <div className="bg-white p-3 rounded-xl border border-sandy-200 shadow-sm select-none">
                      <img 
                        src={qrUrl} 
                        alt="Ticket validation QR Code"
                        className="h-[120px] w-[120px]"
                      />
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full uppercase tracking-wider">
                      <ShieldCheck className="h-3.5 w-3.5 fill-current shrink-0" />
                      <span>Ingresso Válido</span>
                    </div>

                    <p className="text-[9px] text-charcoal-400 font-semibold text-center mt-2 leading-tight">
                      Apresente este QR Code diretamente na portaria de acesso do parque para leitura digital.
                    </p>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-sandy-100">
          <Ticket className="mx-auto h-12 w-12 text-sandy-300 -rotate-12" />
          {hasSearched ? (
            <>
              <h3 className="mt-4 text-base font-bold text-charcoal-800">Nenhum ingresso encontrado</h3>
              <p className="mt-2 text-xs text-charcoal-400 max-w-xs mx-auto">
                Não localizamos compras para o CPF informado. Certifique-se de que digitou corretamente.
              </p>
            </>
          ) : (
            <>
              <h3 className="mt-4 text-base font-bold text-charcoal-800">Sua Carteira está Vazia</h3>
              <p className="mt-2 text-xs text-charcoal-400 max-w-xs mx-auto">
                Você não possui compras registradas nesta sessão. Que tal conferir as vaquejadas disponíveis e garantir sua vaga?
              </p>
            </>
          )}
          <button
            onClick={onExploreEvents}
            className="mt-5 rounded-xl bg-terracotta-500 text-white font-bold px-5 py-2.5 text-xs hover:bg-terracotta-600 transition-colors uppercase tracking-wider shadow-md"
          >
            Explorar Vaquejadas
          </button>
        </div>
      )}

    </div>
  );
};
