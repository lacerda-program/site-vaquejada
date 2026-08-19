import React from 'react';
import { ShieldCheck, Calendar, Lock, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-charcoal-800 text-sandy-100 mt-auto border-t-4 border-terracotta-500">
      
      {/* High-Trust Seals Section */}
      <div className="bg-charcoal-900 border-b border-charcoal-700 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
            
            {/* Seal 1 */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-500/10 text-terracotta-400 shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Compra 100% Segura</h4>
                <p className="text-xs text-charcoal-300 mt-0.5">Criptografia SSL de ponta a ponta nas transações.</p>
              </div>
            </div>

            {/* Seal 2 */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-500/10 text-terracotta-400 shrink-0">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Garantia ABVA / ABQM</h4>
                <p className="text-xs text-charcoal-300 mt-0.5">Parques homologados que respeitam o bem-estar animal.</p>
              </div>
            </div>

            {/* Seal 3 */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-500/10 text-terracotta-400 shrink-0">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">PIX com Emissão Imediata</h4>
                <p className="text-xs text-charcoal-300 mt-0.5">Aprovação em segundos e ingresso direto na carteira.</p>
              </div>
            </div>

            {/* Seal 4 */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-500/10 text-terracotta-400 shrink-0">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Suporte Facilitado</h4>
                <p className="text-xs text-charcoal-300 mt-0.5">Canal de suporte direto via WhatsApp para tirar dúvidas.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links & Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1 - Brand Info */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white">
                Sertão<span className="text-terracotta-500">Tickets</span>
              </span>
            </div>
            <p className="text-xs text-charcoal-300 mt-3 leading-relaxed">
              A Sertão Tickets é a plataforma oficial de ingressos de vaquejada no Nordeste brasileiro. Nosso compromisso é conectar o público aos maiores circuitos e competições da região, oferecendo agilidade, conveniência e respeito absoluto às tradições.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {/* Fake Logos for ABVA / ABQM */}
              <div className="flex flex-col justify-center px-3 py-1 rounded bg-charcoal-900 border border-charcoal-700 text-center">
                <span className="text-[10px] font-bold text-white leading-none">MEMBRO</span>
                <span className="text-xs font-black text-terracotta-500 tracking-wider">ABVA</span>
              </div>
              <div className="flex flex-col justify-center px-3 py-1 rounded bg-charcoal-900 border border-charcoal-700 text-center">
                <span className="text-[10px] font-bold text-white leading-none">REGULADO</span>
                <span className="text-xs font-black text-sandy-400 tracking-wider">ABQM</span>
              </div>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="md:ml-auto">
            <h5 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Estados Atendidos</h5>
            <ul className="space-y-2 text-xs text-charcoal-300">
              <li><span className="hover:text-terracotta-400 transition-colors">Bahia (BA) - Serrinha, Feira</span></li>
              <li><span className="hover:text-terracotta-400 transition-colors">Sergipe (SE) - Lagarto, Aracaju</span></li>
              <li><span className="hover:text-terracotta-400 transition-colors">Alagoas (AL) - Pilar, Arapiraca</span></li>
              <li><span className="hover:text-terracotta-400 transition-colors">Pernambuco (PE) - Bezerros, Caruaru</span></li>
              <li><span className="hover:text-terracotta-400 transition-colors">Paraíba (PB) - Campina Grande</span></li>
              <li><span className="hover:text-terracotta-400 transition-colors">Rio Grande do Norte (RN) - Santo Antônio</span></li>
            </ul>
          </div>

          {/* Column 3 - Payment and Security */}
          <div className="md:ml-auto">
            <h5 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Meios de Pagamento</h5>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded bg-charcoal-900 border border-charcoal-700 text-emerald-400">PIX (Imediato)</span>
              <span className="px-2.5 py-1 rounded bg-charcoal-900 border border-charcoal-700">Cartão de Crédito</span>
              <span className="px-2.5 py-1 rounded bg-charcoal-900 border border-charcoal-700">Boleto Bancário</span>
            </div>
            
            <h5 className="text-sm font-bold uppercase tracking-wider text-white mb-4 mt-6">Segurança Adicional</h5>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold px-2 py-1 bg-green-900/30 text-green-400 rounded border border-green-800">
                SSL Ativo
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-1 bg-blue-900/30 text-blue-400 rounded border border-blue-800">
                LGPD Security
              </span>
            </div>
          </div>

        </div>

        {/* Legal Row */}
        <div className="border-t border-charcoal-700 mt-12 pt-6 text-center text-xs text-charcoal-400">
          <p>© {new Date().getFullYear()} Sertão Tickets Intermediações Ltda. CNPJ: 99.888.777/0001-00</p>
          <p className="mt-1">
            Parque das Palmeiras, Lagarto/SE - Brasil. Tecnologia desenvolvida focando em conexões de baixa latência no Sertão.
          </p>
        </div>
      </div>
    </footer>
  );
};
