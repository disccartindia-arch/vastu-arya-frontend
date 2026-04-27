'use client';
import { useEffect, useState } from 'react';
import { bookingsAPI } from '../../../lib/api';
import { formatPrice } from '../../../lib/utils';
import { MessageCircle, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['pending','paid','called','completed','cancelled'];
const statusColor: Record<string,string> = { paid:'bg-green-100 text-green-700', pending:'bg-yellow-100 text-yellow-700', called:'bg-blue-100 text-blue-700', completed:'bg-teal-100 text-teal-700', cancelled:'bg-red-100 text-red-700' };

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [total, setTotal] = useState(0);

  const load = (status?: string) => {
    setLoading(true);
    bookingsAPI.getAll({ status, limit: 50 }).then(r => { setBookings(r.data.data||[]); setTotal(r.data.total||0); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try { await bookingsAPI.updateStatus(id, { status }); toast.success('Updated!'); load(statusFilter); if (selected?._id === id) setSelected({ ...selected, status }); }
    catch { toast.error('Update failed'); }
  };

  const whatsappLink = (b: any) => {
    const msg = `🙏 Namaste ${b.name}!\n\nRegarding your booking for ${b.serviceName} (ID: ${b.bookingId}).\n\nThank you for booking with Vastu Arya.`;
    return `https://wa.me/${b.phone.replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="font-display text-2xl font-bold text-gray-800">Bookings</h1><p className="text-gray-500 text-sm">{total} total bookings</p></div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>{setStatusFilter('');load('');}} className={`px-3 py-1.5 rounded-full text-xs font-medium ${!statusFilter?'bg-primary text-white':'bg-white text-gray-600'}`}>All</button>
          {STATUSES.map(s=><button key={s} onClick={()=>{setStatusFilter(s);load(s);}} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${statusFilter===s?'bg-primary text-white':'bg-white text-gray-600 hover:bg-gray-100'}`}>{s}</button>)}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? <div className="p-6 space-y-3">{[...Array(8)].map((_,i)=><div key={i} className="h-12 skeleton rounded-xl"/>)}</div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Booking ID','Name','Phone','Service','Amount','Status','Date','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map(b => (
                  <tr key={b._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs font-mono text-gray-600">{b.bookingId}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{b.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{b.phone}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-[120px] truncate">{b.serviceName}</td>
                    <td className="px-4 py-3 font-bold text-sm text-primary">{formatPrice(b.amount)}</td>
                    <td className="px-4 py-3">
                      <select value={b.status} onChange={e=>updateStatus(b._id,e.target.value)} className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${statusColor[b.status]||'bg-gray-100 text-gray-600'}`}>
                        {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={()=>setSelected(b)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Eye size={14}/></button>
                        <a href={whatsappLink(b)} target="_blank" rel="noopener noreferrer" className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg"><MessageCircle size={14}/></a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && <div className="text-center py-12 text-gray-400">No bookings found</div>}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Booking Details</h2>
              <button onClick={()=>setSelected(null)}><X size={18} className="text-gray-400"/></button>
            </div>
            <div className="p-5 space-y-3 text-sm">
              {[['Booking ID',selected.bookingId],['Name',selected.name],['Phone',selected.phone],['Email',selected.email||'-'],['Service',selected.serviceName],['Amount',formatPrice(selected.amount)],['Status',selected.status],['Date',new Date(selected.createdAt).toLocaleString('en-IN')]].map(([l,v])=>(
                <div key={l} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-400">{l}</span>
                  <span className="font-semibold text-right max-w-[200px]">{v as string}</span>
                </div>
              ))}
              {selected.formData && Object.keys(selected.formData).length > 0 && (
                <div>
                  <p className="text-gray-600 font-semibold mb-2">Form Data:</p>
                  {Object.entries(selected.formData).map(([k,v]:any)=>(
                    <div key={k} className="flex justify-between py-1"><span className="text-gray-400 capitalize">{k}</span><span className="font-medium">{v}</span></div>
                  ))}
                </div>
              )}
              <a href={whatsappLink(selected)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full mt-4 bg-[#25D366] text-white py-3 rounded-xl font-semibold">
                <MessageCircle size={16}/> Open WhatsApp Chat
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
