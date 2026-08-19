export interface TicketSector {
  id: string;
  name: string;
  price: number;
  batch: number;
  batchStatus: 'normal' | 'ending' | 'soldout';
  ticketsLeft?: number;
  description?: string;
}

export interface CompetitorCategory {
  id: string;
  name: 'Iniciante' | 'Aspirante' | 'Profissional';
  price: number;
  maxSpots: number; // always 50
  filledSpots: number; // e.g. 18
}

export interface VaquejadaEvent {
  id: string;
  title: string;
  park: string;
  city: string;
  state: 'BA' | 'PE' | 'SE' | 'CE' | 'AL' | 'RN' | 'PB' | 'PI' | 'MA';
  startDate: string; // e.g. "04 Set"
  endDate: string; // e.g. "07 Set"
  dateRangeText: string; // e.g. "04 a 07 de Setembro, 2026"
  imageUrl: string;
  bannerUrl: string;
  lineup: string[];
  startingPrice: number;
  sectors: TicketSector[];
  competitorCategories: CompetitorCategory[];
  categories: ('Próximos Eventos' | 'Grandes Circuitos' | 'Vaquejadas do Mês')[];
  certifiedAbva: boolean;
  certifiedAbqm: boolean;
  description: string;
}

export interface AttendeeInfo {
  name: string;
  cpf: string;
  whatsapp: string;
}

export interface PurchasedTicket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDateText: string;
  parkName: string;
  cityState: string;
  sectorName: string; // "Pista", "Área VIP", etc., or "Iniciante", "Aspirante", "Profissional"
  price: number;
  attendeeName: string;
  attendeeCpf: string;
  purchaseDate: string;
  qrCodeData: string;
  // Competitor Specific
  ticketType: 'spectator' | 'competitor';
  vaqueiroName?: string;
  cavaloName?: string;
  esteiraName?: string;
  senhaNumber?: number; // Spot / Run registration number e.g. 14
}
