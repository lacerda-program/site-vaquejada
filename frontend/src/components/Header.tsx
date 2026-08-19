import React from 'react';
import { Ticket, Search, Wallet, MessageCircle, MapPin } from 'lucide-react';

interface HeaderProps {
  selectedState: string;
  setSelectedState: (state: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentTab: string;
  setCurrentTab: (tab: 'home' | 'wallet') => void;
  onOpenSupport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedState,
  setSelectedState,
  searchQuery,
  setSearchQuery,
  currentTab,
  setCurrentTab,
  onOpenSupport,
}) => {
  const states = [
    { code: '', name: 'Todos os Estados' },
    { code: 'BA', name: 'Bahia' },
    { code: 'PE', name: 'Pernambuco' },
    { code: 'SE', name: 'Sergipe' },
    { code: 'CE', name: 'Ceará' },
    { code: 'AL', name: 'Alagoas' },
    { code: 'RN', name: 'Rio Grande do Norte' },
    { code: 'PB', name: 'Paraíba' },
    { code: 'PI', name: 'Piauí' },
    { code: 'MA', name: 'Maranhão' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-sandy-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta-500 text-white shadow-md shadow-terracotta-200 transition-transform group-hover:scale-105">
              <Ticket className="h-5.5 w-5.5 -rotate-12" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-charcoal-800">
                Sertão<span className="text-terracotta-500">Tickets</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-wider text-sandy-600 -mt-1">
                Portal Oficial da Vaquejada
              </span>
            </div>
          </div>

          {/* Search Bar - Hidden on small mobile to avoid layout crowding, but shown on md+ */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4.5 w-4.5 text-charcoal-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar vaquejada, parque ou atração..."
              className="w-full rounded-xl border border-sandy-200 bg-sandy-50 py-2 pl-10 pr-4 text-sm text-charcoal-800 placeholder-charcoal-400 outline-none transition-all focus:border-terracotta-400 focus:bg-white focus:ring-1 focus:ring-terracotta-400"
            />
          </div>

          {/* Controls & Nav */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Region Selector */}
            <div className="relative flex items-center rounded-xl border border-sandy-200 bg-sandy-50 px-2 py-1.5 sm:px-3 text-xs sm:text-sm text-charcoal-700 hover:border-sandy-300">
              <MapPin className="mr-1 h-3.5 w-3.5 text-terracotta-500 shrink-0" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-transparent font-medium outline-none cursor-pointer pr-1"
              >
                {states.map((st) => (
                  <option key={st.code} value={st.code} className="text-charcoal-800 bg-white">
                    {st.code ? st.code : 'Nordeste'}
                  </option>
                ))}
              </select>
            </div>

            {/* Wallet Button */}
            <button
              onClick={() => setCurrentTab('wallet')}
              className={`relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold transition-all ${
                currentTab === 'wallet'
                  ? 'bg-terracotta-500 text-white shadow-md shadow-terracotta-150'
                  : 'bg-sandy-100 text-charcoal-800 hover:bg-sandy-200'
              }`}
            >
              <Wallet className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Meus Ingressos</span>
              <span className="sm:hidden">Ingressos</span>
            </button>

            {/* Help/WhatsApp Link */}
            <button
              onClick={onOpenSupport}
              className="flex items-center justify-center p-2 rounded-xl bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
              title="Suporte via WhatsApp"
            >
              <MessageCircle className="h-4.5 w-4.5 fill-current shrink-0" />
              <span className="hidden lg:inline ml-1.5 text-xs font-bold">Suporte</span>
            </button>
          </div>
        </div>

        {/* Mobile Search - Displayed only on mobile screen */}
        <div className="md:hidden pb-3 pt-1">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-charcoal-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar vaquejada, parque ou atração..."
              className="w-full rounded-xl border border-sandy-200 bg-sandy-50 py-2 pl-9 pr-4 text-xs text-charcoal-800 placeholder-charcoal-400 outline-none focus:border-terracotta-400 focus:bg-white focus:ring-1 focus:ring-terracotta-400"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
