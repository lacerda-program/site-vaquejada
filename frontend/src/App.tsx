import { useState } from 'react';
import type { VaquejadaEvent, TicketSector, PurchasedTicket } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './pages/HomeView';
import { EventDetailsView } from './pages/EventDetailsView';
import { CheckoutView } from './pages/CheckoutView';
import { WalletView } from './pages/WalletView';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import './App.css';

function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'details' | 'checkout' | 'wallet'>('home');
  const [selectedEvent, setSelectedEvent] = useState<VaquejadaEvent | null>(null);
  const [selectedSectors, setSelectedSectors] = useState<{ sector: TicketSector; quantity: number }[]>([]);
  const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>([]);
  
  // Search & Filter Global State
  const [selectedState, setSelectedState] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Support Widget Drawer Open/Close State
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const handleSelectEvent = (event: VaquejadaEvent) => {
    setSelectedEvent(event);
    setCurrentTab('details');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleGoToCheckout = (selections: { sector: TicketSector; quantity: number }[]) => {
    setSelectedSectors(selections);
    setCurrentTab('checkout');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handlePaymentSuccess = (newTickets: PurchasedTicket[]) => {
    setPurchasedTickets((prev) => [...newTickets, ...prev]);
    setCurrentTab('wallet');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToHome = () => {
    setCurrentTab('home');
    setSelectedEvent(null);
    setSelectedSectors([]);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToDetails = () => {
    setCurrentTab('details');
    setSelectedSectors([]);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const renderActiveView = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeView
            onSelectEvent={handleSelectEvent}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            searchQuery={searchQuery}
          />
        );
      case 'details':
        return selectedEvent ? (
          <EventDetailsView
            event={selectedEvent}
            onBack={handleBackToHome}
            onGoToCheckout={handleGoToCheckout}
          />
        ) : (
          <HomeView
            onSelectEvent={handleSelectEvent}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            searchQuery={searchQuery}
          />
        );
      case 'checkout':
        return selectedEvent && selectedSectors.length > 0 ? (
          <CheckoutView
            event={selectedEvent}
            selections={selectedSectors}
            onBack={handleBackToDetails}
            onPaymentSuccess={handlePaymentSuccess}
          />
        ) : (
          <HomeView
            onSelectEvent={handleSelectEvent}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            searchQuery={searchQuery}
          />
        );
      case 'wallet':
        return (
          <WalletView
            tickets={purchasedTickets}
            onExploreEvents={handleBackToHome}
          />
        );
      default:
        return (
          <HomeView
            onSelectEvent={handleSelectEvent}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            searchQuery={searchQuery}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-sandy-50">
      
      {/* Dynamic Header */}
      <Header
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'home') {
            setSelectedEvent(null);
            setSelectedSectors([]);
          }
        }}
        onOpenSupport={() => setIsSupportOpen(true)}
      />

      {/* Main Page Area */}
      <main className="flex-grow">
        {renderActiveView()}
      </main>

      {/* Dynamic Footer */}
      <Footer />

      {/* Floating Support Widget */}
      <WhatsAppWidget
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        onOpen={() => setIsSupportOpen(true)}
      />

    </div>
  );
}

export default App;
