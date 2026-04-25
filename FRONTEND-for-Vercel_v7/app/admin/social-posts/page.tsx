'use client';
import { useEffect, useState, useRef } from 'react';
import { postsAPI, uploadAPI } from '../../../lib/api';
import { Plus, Pencil, Trash2, X, Save, Upload, Heart, MessageCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const POST_TYPES = ['image','video','text','tip','transformation'];
const CATEGORIES = ['vastu-tip','transformation','visit','remedy','daily-wisdom'];

const emptyPost = {
  type: 'image', caption: '', hashtags: [] as string[],
  location: '', media: [] as any[], category: 'vastu-tip',
  isFeatured: false, isPublished: true, author: 'Dr. PPS',
};

export default function AdminSocialPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyPost);
  const [saving, setSaving] = useState(false);
  const [hashtagInput, setHashtagInput] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => postsAPI.getAll({ limit: 50 }).then((r: any) => setPosts(r?.data?.data || [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyPost); setHashtagInput(''); setShowModal(true); };
  const openEdit = (p: any) => { setEditing(p); setForm({...p}); setHashtagInput(p.hashtags?.join(', ')||''); setShowModal(true); };

  const handleMediaUpload = async (files: FileList) => {
    setUploadingMedia(true);
    try {
      const uploaded: any[] = [];
      for (let i = 0; i < Math.min(files.length, 5); i++) {
        const fd = new FormData(); fd.append('image', files[i]);
        const { data } = await uploadAPI.single(fd);
        const isVid = files[i].type.startsWith('video/');
        uploaded.push({ url: data.data.url, type: isVid ? 'video' : 'image' });
      }
      setForm((f: any) => ({...f, media: [...(f.media||[]), ...uploaded]}));
      toast.success(`${uploaded.length} file(s) uploaded!`);
    } catch { toast.error('Upload failed'); }
    finally { setUploadingMedia(false); }
  };

  const removeMedia = (idx: number) => setForm((f: any) => ({...f, media: f.media.filter((_: any, i: number) => i !== idx)}));

  const handleSave = async () => {
    if (!form.caption.trim()) return toast.error('Caption is required');
    setSaving(true);
    try {
      const payload = { ...form, hashtags: hashtagInput.split(',').map((h: string) => h.trim().replace(/^#/, '')).filter(Boolean) };
      if (editing) { await postsAPI.update(editing._id, payload); toast.success('Post updated!'); }
      else { await postsAPI.create(payload); toast.success('Post created!'); }
      setShowModal(false); load();
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post and all its comments?')) return;
    try { await postsAPI.delete(id); toast.success('Deleted!'); load(); } catch { toast.error('Delete failed'); }
  };

  const togglePublish = async (p: any) => {
    try { await postsAPI.update(p._id, { isPublished: !p.isPublished }); load(); } catch { toast.error('Update failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="font-display text-2xl font-bold text-gray-800">Vastu Feed / Social Posts</h1><p className="text-gray-500 text-sm">Manage Vastu tips, transformations & social content</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-orange"><Plus size={16}/> New Post</button>
      </div>

      {loading ? <div className="grid gap-4">{[...Array(4)].map((_,i)=><div key={i} className="h-20 skeleton rounded-2xl"/>)}</div> : (
        <div className="grid gap-4">
          {posts.map(p => (
            <div key={p._id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition-all">
              {/* Media preview */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-orange-50 flex-shrink-0">
                {p.media?.[0] ? (
                  p.media[0].type === 'video'
                    ? <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-xl">▶</div>
                    : <img src={p.media[0].url} alt="" className="w-full h-full object-cover"/>
                ) : <div className="w-full h-full flex items-center justify-center text-2xl">📝</div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">{p.caption?.slice(0, 80)}{p.caption?.length > 80 ? '…' : ''}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span className="capitalize">{p.type}</span>
                  <span className="flex items-center gap-1"><Heart size={10}/>{p.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={10}/>{p.commentCount}</span>
                  <span className={`px-1.5 py-0.5 rounded-full ${p.isPublished?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{p.isPublished?'Live':'Draft'}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => togglePublish(p)} className={`p-1.5 rounded-lg ${p.isPublished?'text-green-500 hover:bg-green-50':'text-gray-400 hover:bg-gray-50'}`}>{p.isPublished?<Eye size={14}/>:<EyeOff size={14}/>}</button>
                <button onClick={() => openEdit(p)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={14}/></button>
                <button onClick={() => handleDelete(p._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
          {!loading && posts.length === 0 && <div className="text-center py-16 text-gray-400"><div className="text-4xl mb-3">📸</div><p>No posts yet. Create your first Vastu tip!</p></div>}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">{editing?'Edit Post':'New Post'}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400"/></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Type + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label-style">Post Type</label>
                  <select value={form.type} onChange={e => setForm({...form,type:e.target.value})} className="input-style w-full">
                    {POST_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                  </select>
                </div>
                <div><label className="label-style">Category</label>
                  <select value={form.category} onChange={e => setForm({...form,category:e.target.value})} className="input-style w-full">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="label-style">Caption *</label><textarea value={form.caption} onChange={e => setForm({...form,caption:e.target.value})} className="input-style w-full" rows={4} placeholder="Write your Vastu tip or update..."/></div>
              <div><label className="label-style">Author</label><input value={form.author} onChange={e => setForm({...form,author:e.target.value})} className="input-style w-full" placeholder="Dr. PPS"/></div>
              <div><label className="label-style">Location (optional)</label><input value={form.location} onChange={e => setForm({...form,location:e.target.value})} className="input-style w-full" placeholder="New Delhi, India"/></div>
              <div><label className="label-style">Hashtags (comma-separated)</label><input value={hashtagInput} onChange={e => setHashtagInput(e.target.value)} className="input-style w-full" placeholder="vastu, remedy, tips, transformation"/></div>

              {/* Media upload */}
              <div>
                <label className="label-style">Media (images/videos — up to 5)</label>
                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-orange-200 rounded-xl cursor-pointer hover:border-primary transition-colors">
                  <Upload size={16} className="text-primary"/>
                  <span className="text-sm text-gray-600">{uploadingMedia ? 'Uploading…' : 'Tap to upload photos or videos'}</span>
                  <input ref={fileRef} type="file" multiple accept="image/*,video/*" className="hidden"
                    onChange={e => e.target.files && handleMediaUpload(e.target.files)}/>
                </label>
                {form.media?.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {form.media.map((m: any, i: number) => (
                      <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-orange-200">
                        {m.type==='video' ? <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-lg">▶</div>
                          : <img src={m.url} alt="" className="w-full h-full object-cover"/>}
                        <button onClick={() => removeMedia(i)} className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"><X size={10}/></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-5">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form,isPublished:e.target.checked})} className="w-4 h-4 accent-primary"/><span className="text-sm">Published</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form,isFeatured:e.target.checked})} className="w-4 h-4 accent-primary"/><span className="text-sm">Featured</span></label>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving||uploadingMedia} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2">
                <Save size={14}/>{saving?'Saving…':'Save Post'}
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`.label-style{display:block;font-size:.8rem;font-weight:500;color:#5C3D1E;margin-bottom:4px}.input-style{padding:8px 12px;border:1px solid #fed7aa;border-radius:10px;font-size:.875rem;outline:none;width:100%;transition:border-color .2s}.input-style:focus{border-color:#FF6B00;box-shadow:0 0 0 2px rgba(255,107,0,.1)}`}</style>
    </div>
  );
}
