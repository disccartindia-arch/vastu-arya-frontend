'use client';
import { useEffect, useState } from 'react';
import { adminAPI } from '../../../lib/api';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  const load = (q?: string) => {
    setLoading(true);
    adminAPI.getUsers({ search: q, limit: 50 }).then(r => { setUsers(r.data.data||[]); setTotal(r.data.total||0); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const updateUser = async (id: string, data: any) => {
    try { await adminAPI.updateUser(id, data); toast.success('User updated!'); load(search); }
    catch { toast.error('Update failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="font-display text-2xl font-bold text-gray-800">Users</h1><p className="text-gray-500 text-sm">{total} total users</p></div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e=>{setSearch(e.target.value);load(e.target.value);}} placeholder="Search users..." className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary w-56"/>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? <div className="p-6 space-y-3">{[...Array(8)].map((_,i)=><div key={i} className="h-12 skeleton rounded-xl"/>)}</div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['User','Phone','Role','Status','Joined','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u=>(
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">{u.name?.[0]}</div>
                        <div><p className="font-medium text-sm text-gray-800">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.phone||'-'}</td>
                    <td className="px-4 py-3">
                      <select value={u.role} onChange={e=>updateUser(u._id,{role:e.target.value})} className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer font-medium ${u.role==='admin'?'bg-purple-100 text-purple-700':'bg-blue-100 text-blue-700'}`}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={()=>updateUser(u._id,{isActive:!u.isActive})} className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.isActive?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}`}>
                        {u.isActive?'Active':'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <button onClick={()=>updateUser(u._id,{isActive:!u.isActive})} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${u.isActive?'bg-red-50 text-red-500 hover:bg-red-100':'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                        {u.isActive?'Deactivate':'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length===0 && <div className="text-center py-12 text-gray-400">No users found</div>}
          </div>
        )}
      </div>
    </div>
  );
}
