'use client';
/**
 * components/invoice/Invoice.tsx
 * Client-side printable invoice. No PDF library — uses print
 * stylesheet in globals.css (already shipped). window.print() → user
 * can Save as PDF from the browser's native dialog.
 */
import { forwardRef } from 'react';
import { formatPrice } from '../../lib/utils';

export interface InvoiceProps {
  invoiceNumber: string;
  date: string;              // ISO
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerAddress?: string | null;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  total: number;
  paymentId?: string | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  gstin?: string | null;
}

const BRAND = {
  name: 'Vastu Arya',
  address: 'IVAF Certified · Dr. PPS Tomar',
  contact: 'support@vastuarya.com · +91 70003 43804',
  gstin: '',
};

const Invoice = forwardRef<HTMLDivElement, InvoiceProps>(function Invoice(props, ref) {
  const d = new Date(props.date);
  return (
    <div ref={ref} data-testid="invoice-printable" className="invoice-printable bg-white text-gray-900 p-8 max-w-2xl mx-auto" style={{ fontFamily: 'sans-serif' }}>
      <header className="flex items-start justify-between border-b-2 border-orange-500 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-orange-600">{BRAND.name}</h1>
          <p className="text-xs text-gray-500 mt-1">{BRAND.address}</p>
          <p className="text-xs text-gray-500">{BRAND.contact}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase text-gray-400 tracking-wider">Tax Invoice</p>
          <p className="text-sm font-mono font-bold mt-1">{props.invoiceNumber}</p>
          <p className="text-xs text-gray-500 mt-1">{d.toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-6 mb-6 text-sm">
        <div>
          <p className="text-[11px] uppercase text-gray-400 tracking-wider mb-1">Billed To</p>
          <p className="font-semibold">{props.customerName}</p>
          {props.customerEmail && <p className="text-xs text-gray-600">{props.customerEmail}</p>}
          {props.customerPhone && <p className="text-xs text-gray-600">{props.customerPhone}</p>}
          {props.customerAddress && <p className="text-xs text-gray-600 mt-0.5">{props.customerAddress}</p>}
        </div>
        <div>
          <p className="text-[11px] uppercase text-gray-400 tracking-wider mb-1">Payment</p>
          {props.paymentMethod && <p className="text-xs text-gray-600 capitalize">Method: {props.paymentMethod.replace('_', ' ')}</p>}
          {props.paymentStatus && <p className="text-xs text-gray-600 capitalize">Status: {props.paymentStatus.replace('_', ' ')}</p>}
          {props.paymentId && <p className="text-[11px] text-gray-500 font-mono break-all mt-0.5">ID: {props.paymentId}</p>}
        </div>
      </section>

      <table className="w-full text-sm mb-6">
        <thead className="border-b border-gray-200">
          <tr className="text-left text-[11px] uppercase tracking-wider text-gray-500">
            <th className="pb-2">Description</th>
            <th className="pb-2 text-center">Qty</th>
            <th className="pb-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {props.items.map((it, i) => (
            <tr key={i}>
              <td className="py-2">{it.name}</td>
              <td className="py-2 text-center">{it.qty}</td>
              <td className="py-2 text-right">{formatPrice(it.price * it.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-6">
        <div className="w-64 text-sm space-y-1">
          <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(props.subtotal)}</span></div>
          <div className="flex justify-between font-bold text-base border-t pt-2 mt-1"><span>Total</span><span className="text-orange-600">{formatPrice(props.total)}</span></div>
        </div>
      </div>

      <footer className="border-t border-gray-100 pt-4 text-[11px] text-gray-400 text-center">
        This is a computer-generated invoice; no signature required. Thank you for choosing {BRAND.name}.
      </footer>
    </div>
  );
});

export default Invoice;
