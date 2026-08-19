import React from 'react';
import { MapPin, Music, ArrowRight } from 'lucide-react';
import type { VaquejadaEvent } from '../types';

interface EventCardProps {
  event: VaquejadaEvent;
  onSelect: (event: VaquejadaEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  // Determine if any sector is in "ending" status to show urgency
  const endingSector = event.sectors.find((s) => s.batchStatus === 'ending');
  const isAlmostSoldOut = !!endingSector;
  const ticketsLeftText = endingSector?.ticketsLeft 
    ? `Resta(m) ${endingSector.ticketsLeft} vaga(s)!` 
    : 'Lote virando em breve!';

  return (
    <div 
      onClick={() => onSelect(event)}
      className="group bg-white rounded-2xl border border-sandy-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-terracotta-200 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Event Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-sandy-100">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Date Badge Overlay */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl py-1.5 px-3 shadow-md border border-sandy-100 flex flex-col items-center justify-center min-w-[56px] text-center select-none">
          <span className="text-[10px] uppercase font-bold text-sandy-600 tracking-wider">
            {event.startDate.split(' ')[1]}
          </span>
          <span className="text-xl font-extrabold text-terracotta-700 leading-none">
            {event.startDate.split(' ')[0]}
          </span>
        </div>

        {/* Urgency Batch Chip Overlay */}
        {isAlmostSoldOut && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md animate-pulse uppercase tracking-wider">
            {endingSector.name.split(' ')[0]}: {ticketsLeftText}
          </div>
        )}

        {/* ABVA/ABQM Certification Chips */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          {event.certifiedAbva && (
            <span className="bg-charcoal-800/90 text-white text-[9px] font-black px-2 py-0.5 rounded border border-charcoal-700 backdrop-blur-sm" title="Homologado pela Associação Brasileira de Vaquejada">
              ABVA
            </span>
          )}
          {event.certifiedAbqm && (
            <span className="bg-terracotta-700/90 text-white text-[9px] font-black px-2 py-0.5 rounded border border-terracotta-600 backdrop-blur-sm" title="Homologado pela Associação Brasileira de Criadores de Cavalo Quarto de Milha">
              ABQM
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        
        {/* Park & Location Info */}
        <div className="flex items-center text-xs text-sandy-600 font-semibold mb-1">
          <MapPin className="h-3.5 w-3.5 mr-1 text-terracotta-500 shrink-0" />
          <span className="truncate">{event.park} • {event.city}/{event.state}</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-charcoal-800 line-clamp-2 leading-snug group-hover:text-terracotta-600 transition-colors">
          {event.title}
        </h3>

        {/* Artists Lineup */}
        <div className="mt-3 flex items-start gap-1.5">
          <Music className="h-3.5 w-3.5 text-charcoal-400 mt-0.5 shrink-0" />
          <div className="flex flex-wrap gap-1">
            {event.lineup.map((artist) => (
              <span 
                key={artist}
                className="text-[10px] font-medium bg-sandy-50 border border-sandy-100 text-charcoal-600 px-1.5 py-0.2 rounded"
              >
                {artist}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Action Footer */}
        <div className="mt-auto pt-4 border-t border-sandy-100 flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-semibold text-charcoal-400 uppercase tracking-wider">
              Ingressos a partir de
            </span>
            <span className="text-lg font-black text-charcoal-800">
              R$ {event.startingPrice.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-terracotta-50 text-terracotta-600 group-hover:bg-terracotta-500 group-hover:text-white transition-all duration-300 shadow-sm border border-terracotta-100">
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
