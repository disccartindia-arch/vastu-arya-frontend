'use client';
import { useEffect, useState } from 'react';
import { ordersAPI } from '../../../lib/api';
import { formatPrice } from '../../../lib/utils';
import { Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['pending','paid','processing','shipped','delivered','cancelled'];
const statusColor: Record<string,string> = { paid:'bg-green-100 text-green-700', pending:'bg-yellow-100 text-yellow-700', processing:'bg-blue-100 text-blue-700', shipped:'bg-purple-100 text-purple-700', delivered:'bg-teal-100 text-teal-700', cancelled:'bg-red-100 text-red-700' };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = (status?: string, pg = 1) => {
    setLoading(true);
    ordersAPI.getAll({ status, page: pg, limit: 20 }).then(r => { setOrders(r.data.data||[]); setTotal(r.data.total||0); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try { await ordersAPI.updateStatus(id, { status }); toast.success('Status updated!'); load(statusFilter, page); if (selected?._id === id) setSelected({ ...selected, status }); }
    catch { toast.error('Update failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="font-display text-2xl font-bold text-gray-800">Orders</h1><p className="text-gray-500 text-sm">{total} total orders</p></div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => { setStatusFilter(''); load('',1); }} className={`px-3 py-1.5 rounded-full text-xs font-medium ${!statusFilter ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}>All</button>
          {STATUSES.map(s => <button key={s} onClick={() => { setStatusFilter(s); load(s,1); }} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${statusFilter===s ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>{s}</button>)}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? <div className="p-6 space-y-3">{[...Array(8)].map((_,i)=><div key={i} className="h-12 skeleton rounded-xl"/>)}</div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Order ID','Customer','Items','Amount','Status','Date','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(o => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs font-mono text-gray-600">{o.orderId}</td>
                    <td className="px-4 py-3"><p className="font-medium text-sm text-gray-800">{o.customerInfo?.name}</p><p className="text-xs text-gray-400">{o.customerInfo?.phone}</p></td>
                    <td className="px-4 py-3 text-xs text-gray-600">{o.items?.length} item(s)</td>
                    <td className="px-4 py-3 font-bold text-sm text-primary">{formatPrice(o.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <select value={o.status} onChange={e=>updateStatus(o._id,e.target.value)} className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${statusColor[o.status]||'bg-gray-100 text-gray-600'}`}>
                        {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3"><button onClick={()=>setSelected(o)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Eye size={14}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <div className="text-center py-12 text-gray-400">No orders found</div>}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Order: {selected.orderId}</h2>
              <button onClick={()=>setSelected(null)}><X size={18} className="text-gray-400"/></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-gray-400 text-xs">Customer</p><p className="font-semibold">{selected.customerInfo?.name}</p></div>
                <div><p className="text-gray-400 text-xs">Phone</p><p className="font-semibold">{selected.customerInfo?.phone}</p></div>
                <div><p className="text-gray-400 text-xs">Email</p><p className="font-semibold text-xs">{selected.customerInfo?.email}</p></div>
                <div><p className="text-gray-400 text-xs">Amount</p><p className="font-bold text-primary">{formatPrice(selected.totalAmount)}</p></div>
                <div className="col-span-2"><p className="text-gray-400 text-xs">Address</p><p className="font-semibold text-xs">{selected.customerInfo?.address}, {selected.customerInfo?.city} - {selected.customerInfo?.pincode}</p></div>
                {selected.paymentId && <div className="col-span-2"><p className="text-gray-400 text-xs">Payment ID</p><p className="font-mono text-xs">{selected.paymentId}</p></div>}
              </div>
              <div>
                <p className="text-gray-600 font-semibold text-sm mb-2">Items:</p>
                {selected.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm py-2 border-b border-gray-50">
                    <span className="text-gray-700">{item.name} × {item.qty}</span>
                    <span className="font-semibold">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
