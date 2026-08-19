import type { VaquejadaEvent } from '../types';

export const MOCK_EVENTS: VaquejadaEvent[] = [
  {
    id: '1',
    title: 'Vaquejada do Parque das Palmeiras - Edição Ouro',
    park: 'Parque das Palmeiras',
    city: 'Lagarto',
    state: 'SE',
    startDate: '10 Set',
    endDate: '13 Set',
    dateRangeText: '10 a 13 de Setembro de 2026',
    imageUrl: 'https://images.unsplash.com/photo-1598974357801-cbca100e6583?auto=format&fit=crop&q=80&w=600',
    bannerUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=1200',
    lineup: ['Wesley Safadão', 'João Gomes', 'Tarcísio do Acordeon', 'Rey Vaqueiro'],
    startingPrice: 80,
    certifiedAbva: true,
    certifiedAbqm: true,
    categories: ['Grandes Circuitos', 'Vaquejadas do Mês'],
    description: 'A maior estrutura de Vaquejada da América Latina convida você para 4 dias de muita derrubada de boi, competições de alto nível e shows inesquecíveis. Homologado pelas chancelas ABVA e ABQM, garantindo bem-estar animal e segurança para competidores e público.',
    sectors: [
      {
        id: 'pista-1',
        name: 'Pista (Arena)',
        price: 80,
        batch: 2,
        batchStatus: 'normal',
        description: 'Acesso à arena principal, banheiros dedicados e praça de alimentação com vista frontal do palco.'
      },
      {
        id: 'vip-1',
        name: 'Área VIP Premium',
        price: 150,
        batch: 3,
        batchStatus: 'ending',
        ticketsLeft: 12,
        description: 'Vista privilegiada da pista de julgamento e do palco de shows, bares exclusivos e banheiros climatizados.'
      },
      {
        id: 'camarote-1',
        name: 'Lounge Camarote Palmeiras',
        price: 350,
        batch: 2,
        batchStatus: 'ending',
        ticketsLeft: 6,
        description: 'Serviço de buffet regional incluso, open bar premium, visão panorâmica em altura elevada e conforto absoluto.'
      },
      {
        id: 'baia-1',
        name: 'Acesso Baia Competidor',
        price: 50,
        batch: 1,
        batchStatus: 'normal',
        description: 'Exclusivo para tratadores e competidores. Acesso à área de cocheiras e preparação dos animais.'
      }
    ],
    competitorCategories: [
      { id: 'pal-comp-ini', name: 'Iniciante', price: 150, maxSpots: 50, filledSpots: 32 },
      { id: 'pal-comp-asp', name: 'Aspirante', price: 300, maxSpots: 50, filledSpots: 47 }, // 3 spots left!
      { id: 'pal-comp-pro', name: 'Profissional', price: 600, maxSpots: 50, filledSpots: 40 }
    ]
  },
  {
    id: '2',
    title: '79ª Vaquejada de Serrinha',
    park: 'Parque Maria do Carmo',
    city: 'Serrinha',
    state: 'BA',
    startDate: '03 Set',
    endDate: '06 Set',
    dateRangeText: '03 a 06 de Setembro de 2026',
    imageUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600',
    bannerUrl: 'https://images.unsplash.com/photo-1598974357801-cbca100e6583?auto=format&fit=crop&q=80&w=1200',
    lineup: ['Nattan', 'Xand Avião', 'Mari Fernandez', 'Iguinho & Lulinha'],
    startingPrice: 70,
    certifiedAbva: true,
    certifiedAbqm: true,
    categories: ['Grandes Circuitos', 'Vaquejadas do Mês'],
    description: 'A vaquejada mais charmosa e tradicional do Brasil chega à sua histórica 79ª edição. Viva a emoção da festa de Serrinha no Parque Maria do Carmo, onde a cultura sertaneja vibra mais forte nas arquibancadas e na poeira da pista.',
    sectors: [
      {
        id: 'pista-2',
        name: 'Pista (Arena)',
        price: 70,
        batch: 1,
        batchStatus: 'normal',
        description: 'Espaço amplo próximo ao palco e à faixa de pontuação.'
      },
      {
        id: 'vip-2',
        name: 'Área VIP Maria do Carmo',
        price: 130,
        batch: 2,
        batchStatus: 'normal',
        description: 'Entrada exclusiva, bares temáticos e área frontal ao grande palco de shows.'
      },
      {
        id: 'camarote-2',
        name: 'Camarote Vip Serrinha',
        price: 280,
        batch: 3,
        batchStatus: 'ending',
        ticketsLeft: 8,
        description: 'Área coberta superior, banheiros VIPs e vista exclusiva do circuito de derrubada.'
      }
    ],
    competitorCategories: [
      { id: 'ser-comp-ini', name: 'Iniciante', price: 140, maxSpots: 50, filledSpots: 28 },
      { id: 'ser-comp-asp', name: 'Aspirante', price: 280, maxSpots: 50, filledSpots: 35 },
      { id: 'ser-comp-pro', name: 'Profissional', price: 550, maxSpots: 50, filledSpots: 48 } // 2 spots left!
    ]
  },
  {
    id: '3',
    title: 'Vaquejada do Parque Arthur Filho',
    park: 'Parque Arthur Filho',
    city: 'Pilar',
    state: 'AL',
    startDate: '24 Set',
    endDate: '27 Set',
    dateRangeText: '24 a 27 de Setembro de 2026',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600',
    bannerUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=1200',
    lineup: ['Henry Freitas', 'Zé Vaqueiro', 'Luan Estilizado', 'Seu Desejo'],
    startingPrice: 60,
    certifiedAbva: true,
    certifiedAbqm: true,
    categories: ['Próximos Eventos'],
    description: 'Pilar acolhe o melhor da vaquejada alagoana. O Parque Arthur Filho abre suas porteiras para receber a vaqueirama de todo o país para disputas acirradas e uma programação de shows com grandes nomes da pisadinha e do forró.',
    sectors: [
      {
        id: 'pista-3',
        name: 'Pista',
        price: 60,
        batch: 1,
        batchStatus: 'normal',
        description: 'Acesso padrão à área de eventos e arquibancadas de cimento.'
      },
      {
        id: 'vip-3',
        name: 'Camarote Arthur Filho',
        price: 140,
        batch: 2,
        batchStatus: 'ending',
        ticketsLeft: 19,
        description: 'Acesso VIP elevado com visão total da pista e do palco principal.'
      }
    ],
    competitorCategories: [
      { id: 'pil-comp-ini', name: 'Iniciante', price: 120, maxSpots: 50, filledSpots: 15 },
      { id: 'pil-comp-asp', name: 'Aspirante', price: 250, maxSpots: 50, filledSpots: 18 },
      { id: 'pil-comp-pro', name: 'Profissional', price: 500, maxSpots: 50, filledSpots: 29 }
    ]
  },
  {
    id: '4',
    title: 'Grande Vaquejada do Parque Ruffina Borba',
    park: 'Parque Ruffina Borba',
    city: 'Bezerros',
    state: 'PE',
    startDate: '08 Out',
    endDate: '11 Out',
    dateRangeText: '08 a 11 de Outubro de 2026',
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=600',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200',
    lineup: ['Tarcísio do Acordeon', 'Mano Walter', 'Limão com Mel', 'Heitor Costa'],
    startingPrice: 65,
    certifiedAbva: true,
    certifiedAbqm: false,
    categories: ['Próximos Eventos', 'Vaquejadas do Mês'],
    description: 'Bezerros recebe a vaqueirama na lendária pista do Ruffina Borba. Conhecida pela pista técnica e pela recepção calorosa da torcida pernambucana, o evento reúne esporte equestre de ponta e shows de forró até o amanhecer.',
    sectors: [
      {
        id: 'pista-4',
        name: 'Arena Principal',
        price: 65,
        batch: 1,
        batchStatus: 'normal',
        description: 'Acesso ao setor geral de arena, bares e praça de alimentação.'
      },
      {
        id: 'vip-4',
        name: 'Frontstage Premium',
        price: 120,
        batch: 2,
        batchStatus: 'normal',
        description: 'Acesso à frente do palco principal de shows e lounges de convivência.'
      },
      {
        id: 'camarote-4',
        name: 'Camarote Ruffina VIP',
        price: 250,
        batch: 1,
        batchStatus: 'ending',
        ticketsLeft: 4,
        description: 'Vista privilegiada da porteira de saída, buffet regional leve e banheiros exclusivos.'
      }
    ],
    competitorCategories: [
      { id: 'ruf-comp-ini', name: 'Iniciante', price: 130, maxSpots: 50, filledSpots: 22 },
      { id: 'ruf-comp-asp', name: 'Aspirante', price: 270, maxSpots: 50, filledSpots: 29 },
      { id: 'ruf-comp-pro', name: 'Profissional', price: 550, maxSpots: 50, filledSpots: 43 }
    ]
  },
  {
    id: '5',
    title: 'Vaquejada Tradicional de Campina Grande',
    park: 'Parque Ivandro Cunha Lima',
    city: 'Campina Grande',
    state: 'PB',
    startDate: '15 Out',
    endDate: '18 Out',
    dateRangeText: '15 a 18 de Outubro de 2026',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600',
    bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200',
    lineup: ['Felipe Amorim', 'Zé Cantor', 'Luan Estilizado', 'Bonde do Brasil'],
    startingPrice: 50,
    certifiedAbva: true,
    certifiedAbqm: true,
    categories: ['Grandes Circuitos'],
    description: 'Campina Grande sedia uma das festas mais consagradas do estado. O Parque Ivandro Cunha Lima traz um festival de derrubadas de bois e grandes shows musicais de forró estilizado que marcam época no coração da Paraíba.',
    sectors: [
      {
        id: 'pista-5',
        name: 'Pista Simples',
        price: 50,
        batch: 1,
        batchStatus: 'normal',
        description: 'Acesso à área geral de shows e arquibancadas populares.'
      },
      {
        id: 'vip-5',
        name: 'VIP Ivandro Cunha Lima',
        price: 110,
        batch: 2,
        batchStatus: 'normal',
        description: 'Localização frontal ao palco, entrada separada e serviços de bar adicionais.'
      }
    ],
    competitorCategories: [
      { id: 'iva-comp-ini', name: 'Iniciante', price: 110, maxSpots: 50, filledSpots: 10 },
      { id: 'iva-comp-asp', name: 'Aspirante', price: 220, maxSpots: 50, filledSpots: 12 },
      { id: 'iva-comp-pro', name: 'Profissional', price: 450, maxSpots: 50, filledSpots: 20 }
    ]
  },
  {
    id: '6',
    title: 'Vaquejada da Saudade de Santo Antônio',
    park: 'Parque Arapuá',
    city: 'Santo Antônio',
    state: 'RN',
    startDate: '29 Out',
    endDate: '01 Nov',
    dateRangeText: '29 de Outubro a 01 de Novembro de 2026',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1200',
    lineup: ['Zezo Potiguar', 'Raí Saia Rodada', 'Luan Estilizado', 'Grafith'],
    startingPrice: 55,
    certifiedAbva: false,
    certifiedAbqm: true,
    categories: ['Próximos Eventos'],
    description: 'A famosa Vaquejada da Saudade atrai milhares de potiguares ao Parque Arapuá. Um encontro clássico do forró das antigas e das competições esportivas que resgatam as raízes do homem do campo norte-rio-grandense.',
    sectors: [
      {
        id: 'pista-6',
        name: 'Pista Geral',
        price: 55,
        batch: 1,
        batchStatus: 'normal',
        description: 'Acesso às áreas comuns do parque e palco de shows.'
      },
      {
        id: 'camarote-6',
        name: 'Lounge Arapuá Club',
        price: 200,
        batch: 2,
        batchStatus: 'ending',
        ticketsLeft: 15,
        description: 'Ambiente climatizado com bar privativo, DJs nos intervalos e visão frontal da faixa de pontuação.'
      }
    ],
    competitorCategories: [
      { id: 'ara-comp-ini', name: 'Iniciante', price: 100, maxSpots: 50, filledSpots: 8 },
      { id: 'ara-comp-asp', name: 'Aspirante', price: 200, maxSpots: 50, filledSpots: 10 },
      { id: 'ara-comp-pro', name: 'Profissional', price: 400, maxSpots: 50, filledSpots: 16 }
    ]
  }
];
