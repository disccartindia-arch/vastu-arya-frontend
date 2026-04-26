'use client';
import { useEffect, useState } from 'react';
import { blogsAPI } from '../../../lib/api';
import { Plus, Pencil, Trash2, X, Save, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUploader from '../../../components/admin/ImageUploader';

const emptyBlog = { title:{en:'',hi:''}, slug:'', content:{en:'',hi:''}, excerpt:{en:'',hi:''}, coverImage:'', category:'vastu', tags:[], author:'Dr. PPS Tomar', isPublished:false, seo:{title:'',description:''} };

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyBlog);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  const load = () => blogsAPI.getAll().then(r=>setBlogs(r.data.data||[])).finally(()=>setLoading(false));
  useEffect(()=>{load();},[]);

  const openAdd = () => { setEditing(null); setForm(emptyBlog); setTagsInput(''); setShowModal(true); };
  const openEdit = (b: any) => { setEditing(b); setForm({...b}); setTagsInput(b.tags?.join(', ')||''); setShowModal(true); };

  const handleSave = async () => {
    if (!form.title.en) return toast.error('Title is required');
    setSaving(true);
    try {
      const payload = { ...form, tags: tagsInput.split(',').map((t:string)=>t.trim()).filter(Boolean) };
      if (!payload.slug) payload.slug = payload.title.en.toLowerCase().replace(/[^a-z0-9]+/g,'-');
      if (editing) { await blogsAPI.update(editing._id, payload); toast.success('Blog updated!'); }
      else { await blogsAPI.create(payload); toast.success('Blog created!'); }
      setShowModal(false); load();
    } catch(e:any) { toast.error(e?.response?.data?.message||'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id:string) => {
    if (!confirm('Delete this blog?')) return;
    try { await blogsAPI.delete(id); toast.success('Deleted!'); load(); } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-2xl font-bold text-gray-800">Blog Posts</h1><p className="text-gray-500 text-sm">Create and manage blog content</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-orange"><Plus size={16}/>Write Post</button>
      </div>

      <div className="grid gap-3">
        {loading ? [...Array(5)].map((_,i)=><div key={i} className="h-16 skeleton rounded-xl"/>) : (
          blogs.map(b=>(
            <div key={b._id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between gap-3 hover:shadow-md transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-medium text-gray-800 truncate">{b.title.en}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${b.isPublished?'bg-green-100 text-green-700':'bg-gray-100 text-gray-600'}`}>{b.isPublished?'Published':'Draft'}</span>
                </div>
                <p className="text-xs text-gray-400">{b.category} • {b.author} • {new Date(b.createdAt).toLocaleDateString('en-IN')} • {b.views} views</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {b.isPublished && <a href={`/blog/${b.slug}`} target="_blank" className="p-1.5 text-teal-500 hover:bg-teal-50 rounded-lg"><Eye size={14}/></a>}
                <button onClick={()=>openEdit(b)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={14}/></button>
                <button onClick={()=>handleDelete(b._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
              </div>
            </div>
          ))
        )}
        {!loading && blogs.length===0 && <div className="text-center py-16 text-gray-400">No blog posts yet</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">{editing?'Edit Post':'New Blog Post'}</h2>
              <button onClick={()=>setShowModal(false)}><X size={20} className="text-gray-400"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="label-style">Title (English) *</label><input value={form.title.en} onChange={e=>setForm({...form,title:{...form.title,en:e.target.value}})} className="input-style w-full"/></div>
                <div><label className="label-style">Title (Hindi)</label><input value={form.title.hi} onChange={e=>setForm({...form,title:{...form.title,hi:e.target.value}})} className="input-style w-full font-hindi"/></div>
                <div><label className="label-style">Category</label>
                  <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="input-style w-full">
                    {['vastu','astrology','numerology','gemology','tips','general'].map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="label-style">Author</label><input value={form.author} onChange={e=>setForm({...form,author:e.target.value})} className="input-style w-full"/></div>
                <div className="sm:col-span-2">
                  <ImageUploader
                    images={form.coverImage ? [form.coverImage] : ['']}
                    onChange={imgs => setForm({...form, coverImage: imgs[0] || ''})}
                    maxImages={1}
                    label="Cover Image"
                  />
                </div>
                <div className="sm:col-span-2"><label className="label-style">Tags (comma separated)</label><input value={tagsInput} onChange={e=>setTagsInput(e.target.value)} className="input-style w-full" placeholder="vastu, astrology, tips"/></div>
              </div>
              <div><label className="label-style">Excerpt (English)</label><textarea value={form.excerpt.en} onChange={e=>setForm({...form,excerpt:{...form.excerpt,en:e.target.value}})} className="input-style w-full" rows={2} placeholder="Short description for listing pages"/></div>
              <div><label className="label-style">Content (English) *</label><textarea value={form.content.en} onChange={e=>setForm({...form,content:{...form.content,en:e.target.value}})} className="input-style w-full" rows={10} placeholder="Full blog post content (HTML supported)"/></div>
              <div><label className="label-style">Content (Hindi)</label><textarea value={form.content.hi} onChange={e=>setForm({...form,content:{...form.content,hi:e.target.value}})} className="input-style w-full font-hindi" rows={6} placeholder="हिंदी में सामग्री (वैकल्पिक)"/></div>
              <div><label className="label-style">SEO Title</label><input value={form.seo?.title} onChange={e=>setForm({...form,seo:{...form.seo,title:e.target.value}})} className="input-style w-full"/></div>
              <div><label className="label-style">SEO Description</label><textarea value={form.seo?.description} onChange={e=>setForm({...form,seo:{...form.seo,description:e.target.value}})} className="input-style w-full" rows={2}/></div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isPublished} onChange={e=>setForm({...form,isPublished:e.target.checked})} className="w-4 h-4 accent-primary"/><span className="text-sm font-medium">Publish immediately</span></label>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
              <button onClick={()=>setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2">
                <Save size={15}/>{saving?'Saving...':'Save Post'}
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`.label-style{display:block;font-size:.8rem;font-weight:500;color:#5C3D1E;margin-bottom:4px}.input-style{padding:8px 12px;border:1px solid #fed7aa;border-radius:10px;font-size:.875rem;outline:none;transition:border-color .2s}.input-style:focus{border-color:#FF6B00;box-shadow:0 0 0 2px rgba(255,107,0,.1)}`}</style>
    </div>
  );
}
