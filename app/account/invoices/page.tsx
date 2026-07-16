'use client';
/**
 * app/account/invoices/page.tsx — lists paid bookings + orders with a
 * per-row "Download Invoice" (opens native print → Save as PDF).
 * Uses existing accountAPI, no new endpoints.
 */
import { useEffect, useMemo, useState } from 'react';
import { accountAPI } from '../../../lib/accountAPI';
import { formatPrice } from '../../../lib/utils';
import { LoadingSkeleton, EmptyState, ErrorState } from '../../../components/account/AccountStates';
import Invoice from '../../../components/invoice/Invoice';
import { FileText, Download } from 'lucide-react';

interface Row {
  invoiceNumber: string;
  date: string;
  itemName: string;
  amount: number;
  paymentId?: string | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  customerName?: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerAddress?: string | null;
  kind: 'booking' | 'order';
}

export default function InvoicesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<Row | null>(null);

  const load = () => {
    setLoading(true); setError('');
    Promise.all([
      accountAPI.getBookings({ filter: 'all', limit: 100 }),
      accountAPI.getOrders({ filter: 'all', limit: 100 }),
    ]).then(([b, o]) => {
      const bookings = (b.data.data || [])
        .filter((x: any) => x.paymentStatus === 'verified' || x.paymentStatus === 'refunded')
        .map((x: any): Row => ({
          invoiceNumber: `INV-B-${x.bookingId}`,
          date: x.createdAt,
          itemName: x.serviceName,
          amount: x.amount,
          paymentId: x.paymentId || null,
          paymentMethod: x.paymentMethod || null,
          paymentStatus: x.paymentStatus,
          customerName: x.name,
          customerEmail: x.email,
          customerPhone: x.phone,
          kind: 'booking',
        }));
      const orders = (o.data.data || [])
        .filter((x: any) => ['paid', 'shipped', 'delivered', 'processing'].includes(x.status))
        .map((x: any): Row => ({
          invoiceNumber: `INV-O-${x.orderId}`,
          date: x.createdAt,
          itemName: (x.items && x.items[0]?.name) ? `${x.items[0].name}${x.items.length > 1 ? ` + ${x.items.length - 1} more` : ''}` : 'Order',
          amount: x.totalAmount,
          paymentId: x.paymentId || null,
          paymentMethod: x.paymentMethod || 'razorpay',
          paymentStatus: x.status,
          customerName: x.customerInfo?.name,
          customerEmail: x.customerInfo?.email,
          customerPhone: x.customerInfo?.phone,
          customerAddress: x.customerInfo?.address ? `${x.customerInfo.address}, ${x.customerInfo.city || ''} ${x.customerInfo.pincode || ''}`.trim() : null,
          kind: 'order',
        }));
      setRows([...bookings, ...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }).catch(() => setError('Could not load your invoices.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const invoiceItems = useMemo(() => {
    if (!preview) return [];
    return [{ name: preview.itemName, qty: 1, price: preview.amount }];
  }, [preview]);

  if (loading) return <LoadingSkeleton rows={2} />;
  if (error)   return <ErrorState message={error} onRetry={load} />;
  if (rows.length === 0) return <EmptyState icon={FileText} title="No invoices yet" subtitle="Your paid bookings and orders will appear here." />;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>{['Invoice', 'Date', 'Item', 'Amount', ''].map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map(r => (
              <tr key={r.invoiceNumber} className="hover:bg-orange-50/40 transition-colors" data-testid={`invoice-row-${r.invoiceNumber}`}>
                <td className="px-4 py-3 font-mono text-xs text-gray-700">{r.invoiceNumber}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{new Date(r.date).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3 text-gray-700 max-w-[220px] truncate">{r.itemName}</td>
                <td className="px-4 py-3 font-semibold text-primary">{formatPrice(r.amount)}</td>
                <td className="px-4 py-3 text-right">
                  <button data-testid="download-invoice-btn" onClick={() => { setPreview(r); setTimeout(() => window.print(), 40); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-200 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-colors">
                    <Download size={12} /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Off-screen printable — only rendered when the user clicks Download.
          Print stylesheet (globals.css) hides everything except .invoice-printable. */}
      {preview && (
        <div className="print-only fixed top-0 left-0 w-full">
          <Invoice
            invoiceNumber={preview.invoiceNumber}
            date={preview.date}
            customerName={preview.customerName || 'Customer'}
            customerEmail={preview.customerEmail}
            customerPhone={preview.customerPhone}
            customerAddress={preview.customerAddress}
            items={invoiceItems}
            subtotal={preview.amount}
            total={preview.amount}
            paymentId={preview.paymentId}
            paymentMethod={preview.paymentMethod}
            paymentStatus={preview.paymentStatus}
          />
        </div>
      )}
    </div>
  );
}
