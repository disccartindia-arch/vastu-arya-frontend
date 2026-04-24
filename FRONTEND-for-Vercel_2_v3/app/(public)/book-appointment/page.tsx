'use client';
import { useEffect } from 'react';
import { useUIStore } from '../../../store/uiStore';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import AppointmentPopup from '../../../components/common/AppointmentPopup';
import WhatsAppButton from '../../../components/common/WhatsAppButton';

export default function BookAppointmentPage() {
  const { setShowAppointmentPopup } = useUIStore();
  useEffect(() => { setShowAppointmentPopup(true); }, []);
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center"><div className="text-5xl mb-3">🕉️</div><p className="text-text-light">Opening booking form...</p></div>
      </main>
      <Footer />
      <AppointmentPopup />
      <WhatsAppButton />
    </>
  );
}
