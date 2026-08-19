import React, { useState, useEffect } from 'react';
import { MOCK_EVENTS } from '../data/events';
import type { VaquejadaEvent } from '../types';
import { EventCard } from '../components/EventCard';
import { Sparkles, CalendarRange, Flame, HelpCircle, ArrowRight } from 'lucide-react';

interface HomeViewProps {
  onSelectEvent: (event: VaquejadaEvent) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  searchQuery: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectEvent,
  selectedState,
  setSelectedState,
  searchQuery,
}) => {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  
  // Highlight events for the carousel (Lagarto, Serrinha)
  const carouselEvents = MOCK_EVENTS.slice(0, 3);

  // Auto rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % carouselEvents.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [carouselEvents.length]);

  // Filter events based on search query and state selection
  const filteredEvents = MOCK_EVENTS.filter((event) => {
    const matchesState = selectedState === '' || event.state === selectedState;
    const matchesQuery =
      searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.park.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.lineup.some((artist) => artist.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesState && matchesQuery;
  });

  // Split into categories ONLY when there is no active filter/search
  const isFiltering = selectedState !== '' || searchQuery !== '';
  
  const grandesCircuitos = filteredEvents.filter((e) => e.categories.includes('Grandes Circuitos'));
  const vaquejadasDoMes = filteredEvents.filter((e) => e.categories.includes('Vaquejadas do Mês'));
  const proximosEventos = filteredEvents.filter((e) => e.categories.includes('Próximos Eventos'));

  const statePills = [
    { code: '', label: 'Todos' },
    { code: 'BA', label: 'Bahia' },
    { code: 'PE', label: 'Pernambuco' },
    { code: 'SE', label: 'Sergipe' },
    { code: 'CE', label: 'Ceará' },
    { code: 'AL', label: 'Alagoas' },
    { code: 'RN', label: 'R. G. Norte' },
    { code: 'PB', label: 'Paraíba' },
  ];

  return (
    <div className="w-full pb-16">
      
      {/* 1. Hero Carousel Section - Only shown when not filtering */}
      {!isFiltering && carouselEvents.length > 0 && (
        <div className="relative w-full overflow-hidden bg-charcoal-900 md:rounded-b-3xl">
          <div className="mx-auto max-w-7xl relative aspect-[16/9] md:aspect-[21/9] w-full">
            
            {/* Active Banner Image */}
            <div className="absolute inset-0 select-none">
              <img
                src={carouselEvents[activeHeroIndex].bannerUrl}
                alt={carouselEvents[activeHeroIndex].title}
                className="h-full w-full object-cover opacity-45 transition-all duration-1000 transform scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-900/60 to-transparent" />
            </div>

            {/* Slide Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-white">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-terracotta-500 px-3 py-1 text-[10px] md:text-xs font-black uppercase tracking-wider">
                  <Flame className="h-3.5 w-3.5" /> Destaque do Circuito
                </div>
                
                <h1 className="text-xl md:text-4xl font-extrabold leading-tight text-white m-0 tracking-tight">
                  {carouselEvents[activeHeroIndex].title}
                </h1>
                
                <p className="text-xs md:text-sm text-sandy-100 font-medium">
                  📍 {carouselEvents[activeHeroIndex].park} • {carouselEvents[activeHeroIndex].city}/{carouselEvents[activeHeroIndex].state}
                </p>

                <p className="hidden md:block text-xs text-charcoal-200 line-clamp-2">
                  {carouselEvents[activeHeroIndex].description}
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => onSelectEvent(carouselEvents[activeHeroIndex])}
                    className="rounded-xl bg-terracotta-500 hover:bg-terracotta-600 px-5 py-2.5 text-xs md:text-sm font-bold text-white shadow-lg shadow-terracotta-500/20 hover:scale-102 transition-all"
                  >
                    Comprar Ingressos
                  </button>
                  <div className="hidden sm:flex flex-wrap gap-1 text-[10px] font-semibold text-sandy-300">
                    <span className="text-white">Atrações:</span>
                    {carouselEvents[activeHeroIndex].lineup.slice(0, 3).map((a) => (
                      <span key={a} className="bg-white/10 px-2 py-0.5 rounded border border-white/10">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Dots navigation */}
            <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
              {carouselEvents.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveHeroIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeHeroIndex ? 'w-6 bg-terracotta-500' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>

          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* 2. Fast Filter State Pills */}
        <div className="w-full overflow-x-auto no-scrollbar py-2">
          <div className="flex items-center gap-2 whitespace-nowrap min-w-max">
            <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wider mr-2">
              Filtrar Estado:
            </span>
            {statePills.map((pill) => (
              <button
                key={pill.code}
                onClick={() => setSelectedState(pill.code)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  selectedState === pill.code
                    ? 'bg-terracotta-500 text-white border-terracotta-500 shadow-md shadow-terracotta-100'
                    : 'bg-white text-charcoal-700 border-sandy-200 hover:border-sandy-300 hover:bg-sandy-50'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Grid rendering logic */}
        {isFiltering ? (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-terracotta-500" />
              <h2 className="text-xl font-bold text-charcoal-800 m-0">
                Resultados da busca ({filteredEvents.length})
              </h2>
            </div>
            
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} onSelect={onSelectEvent} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-sandy-100">
                <HelpCircle className="mx-auto h-12 w-12 text-sandy-300" />
                <h3 className="mt-4 text-base font-bold text-charcoal-800">Nenhum evento encontrado</h3>
                <p className="mt-2 text-xs text-charcoal-400 max-w-xs mx-auto">
                  Tente alterar seu filtro de estado ou reescrever o termo de busca para encontrar as vaquejadas.
                </p>
                <button
                  onClick={() => {
                    setSelectedState('');
                  }}
                  className="mt-5 rounded-xl bg-terracotta-50 text-terracotta-700 border border-terracotta-100 font-bold px-4 py-2 text-xs hover:bg-terracotta-500 hover:text-white transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12 mt-8">
            
            {/* Category: Grandes Circuitos */}
            {grandesCircuitos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-terracotta-50 flex items-center justify-center text-terracotta-500">
                      <Flame className="h-4.5 w-4.5" />
                    </div>
                    <h2 className="text-lg font-bold text-charcoal-800 m-0">Grandes Circuitos</h2>
                  </div>
                  <span className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 cursor-pointer flex items-center gap-0.5">
                    Ver todos <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {grandesCircuitos.map((event) => (
                    <EventCard key={event.id} event={event} onSelect={onSelectEvent} />
                  ))}
                </div>
              </div>
            )}

            {/* Category: Vaquejadas do Mês */}
            {vaquejadasDoMes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-terracotta-50 flex items-center justify-center text-terracotta-500">
                      <CalendarRange className="h-4.5 w-4.5" />
                    </div>
                    <h2 className="text-lg font-bold text-charcoal-800 m-0">Vaquejadas do Mês</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vaquejadasDoMes.map((event) => (
                    <EventCard key={event.id} event={event} onSelect={onSelectEvent} />
                  ))}
                </div>
              </div>
            )}

            {/* Category: Próximos Eventos */}
            {proximosEventos.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-terracotta-50 flex items-center justify-center text-terracotta-500">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  <h2 className="text-lg font-bold text-charcoal-800 m-0">Próximas Porteiras Abertas</h2>
                </div>
                
                {/* Responsive List Layout */}
                <div className="space-y-4">
                  {proximosEventos.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => onSelectEvent(event)}
                      className="group bg-white rounded-2xl border border-sandy-100 p-4 hover:border-terracotta-200 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                    >
                      {/* Left: Date + Location info */}
                      <div className="flex items-center gap-4">
                        <div className="bg-terracotta-50 text-terracotta-700 rounded-xl py-2 px-3 flex flex-col items-center justify-center min-w-[60px] text-center border border-terracotta-100">
                          <span className="text-[10px] uppercase font-bold text-terracotta-500 tracking-wider">
                            {event.startDate.split(' ')[1]}
                          </span>
                          <span className="text-lg font-extrabold leading-none mt-0.5">
                            {event.startDate.split(' ')[0]}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-white bg-charcoal-600 rounded px-1.5 py-0.2 shrink-0">
                              {event.state}
                            </span>
                            <span className="text-xs text-sandy-600 font-semibold">{event.park} • {event.city}</span>
                          </div>
                          <h3 className="text-base font-bold text-charcoal-800 mt-1 leading-tight group-hover:text-terracotta-600 transition-colors">
                            {event.title}
                          </h3>
                        </div>
                      </div>

                      {/* Middle: Music lineup */}
                      <div className="flex flex-wrap gap-1 max-w-sm">
                        {event.lineup.map((artist) => (
                          <span key={artist} className="text-[10px] bg-sandy-50 border border-sandy-100 text-charcoal-600 px-2 py-0.5 rounded font-medium">
                            {artist}
                          </span>
                        ))}
                      </div>

                      {/* Right: Price + Buy Action */}
                      <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t border-sandy-50 md:border-t-0">
                        <div>
                          <span className="block text-[9px] font-semibold text-charcoal-400 uppercase tracking-wider md:text-right">
                            A partir de
                          </span>
                          <span className="text-base font-extrabold text-charcoal-800">
                            R$ {event.startingPrice.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                        
                        <button className="flex items-center gap-1.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold px-4 py-2 text-xs transition-colors shadow-sm">
                          <span>Comprar</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
