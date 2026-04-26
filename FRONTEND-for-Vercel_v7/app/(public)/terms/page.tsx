import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';

export const metadata = { title: 'Terms of Service | Vastu Arya' };

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16" style={{ minHeight: '70vh' }}>
        <h1 className="font-display text-3xl font-bold text-gray-800 mb-6">Terms of Service</h1>
        <div className="prose prose-sm text-gray-600 space-y-4">
          <p>By using Vastu Arya services, you agree to the following terms and conditions.</p>
          <h2 className="text-lg font-bold text-gray-800 mt-6">Services</h2>
          <p>Vastu Arya provides Vastu Shastra consultation, numerology analysis, and related wellness services by Dr. Pranveer Pratap Singh Tomar (IVAF Certified).</p>
          <h2 className="text-lg font-bold text-gray-800 mt-6">Payments</h2>
          <p>All payments are processed securely. Booking fees are non-refundable once the consultation has commenced.</p>
          <h2 className="text-lg font-bold text-gray-800 mt-6">AI Guidance Disclaimer</h2>
          <p>AI-generated Vastu guidance is for informational purposes only. For precise results, a personal consultation with Dr. PPS Tomar is recommended.</p>
          <h2 className="text-lg font-bold text-gray-800 mt-6">Contact</h2>
          <p>For any queries, please contact us via the <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
