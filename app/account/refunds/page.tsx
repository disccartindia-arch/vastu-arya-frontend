'use client';
/**
 * app/account/refunds/page.tsx — filtered view of payments/bookings
 * where paymentStatus === 'refunded'. Uses existing endpoints only.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { accountAPI } from '../../../lib/accountAPI';
import { formatPrice } from '../../../lib/utils';
import { LoadingSkeleton, EmptyState, ErrorState } from '../../../components/account/AccountStates';
import { RefreshCcw } from 'lucide-react';

interface PaymentRow { reference: string; amount: number; status: string; method: string; date: string; type: string; }

export default function RefundsPage() {
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true); setError('');
    accountAPI.getPayments({ filter: 'refunded' })
      .then(r => setRows(r.data.data || []))
      .catch(() => setError('Could not load your refunds.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (loading) return <LoadingSkeleton rows={2} />;
  if (error)   return <ErrorState message={error} onRetry={load} />;
  if (rows.length === 0) {
    return (
      <div className="space-y-4">
        <EmptyState icon={RefreshCcw} title="No refunds" subtitle="Refunded payments will appear here automatically." />
        <p className="text-center text-xs text-gray-400">Need help with a refund? <Link href="https://wa.me/917000343804" className="text-primary underline">Contact support on WhatsApp</Link>.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
          <tr>{['Reference', 'Type', 'Amount', 'Refunded on', 'Status'].map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map((r, i) => (
            <tr key={i} data-testid={`refund-row-${i}`}>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.reference}</td>
              <td className="px-4 py-3 text-xs capitalize text-gray-500">{r.type}</td>
              <td className="px-4 py-3 font-semibold text-primary">{formatPrice(r.amount)}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">{new Date(r.date).toLocaleDateString('en-IN')}</td>
              <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">Refunded</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
