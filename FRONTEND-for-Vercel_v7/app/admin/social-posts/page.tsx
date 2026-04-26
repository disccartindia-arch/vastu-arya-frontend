'use client';
import { useEffect, useState } from 'react';
import { postsAPI } from '../../../lib/api';
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff, Heart, MessageCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUploader from '../../../components/admin/ImageUploader';

const POST_TYPES = ['image','video','text','tip','transformation'];
const CATEGORIES = ['vastu-tip','transformation','visit','remedy','daily-wisdom'];

const emptyPost = {
  type: 'image',
  caption: '',
  hashtags: [] as string[],
  location: '',
  media: [] as { url: string; type: string }[],
  category: 'vastu-tip',
  isFeatured: false,
  isPublished: true,
  author: 'Dr. PPS Tomar',
};

export default function AdminSocialPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyPost);
  const [saving, setSaving] = useState(false);
  const [hashtagInput, setHashtagInput] = useState('');

  // extract image URLs from media array for ImageUploader
  const mediaImages = (form.media || []).map((m: any) => m.url);
  const setMediaImages = (urls: string[]) => {
    const updated = urls.map(url => ({ url, type: 'image' }));
    setForm((f: any) => ({ ...f, media: updated }));
  };

  const load = () => {
    postsAPI.getAll({ limit: 50 })
      .then((r: any) => setPosts(r?.data?.data || []))
      .catch(() => toast.error('Failed to load posts'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyPost);
    setHashtagInput('');
    setShowModal(true);
  };
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({ ...p, media: p.media || [] });
    setHashtagInput((p.hashtags || []).join(', '));
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.caption.trim()) return toast.error('Caption is required');
    setSaving(true);
    try {
      const payload = {
        ...form,
        hashtags: hashtagInput
          .split(',')
          .map((h: string) => h.trim().replace(/^#/, ''))
          .filter(Boolean),
      };
      if (editing) {
        await postsAPI.update(editing._id, payload);
        toast.success('Post updated!');
      } else {
        await postsAPI.create(payload);
        toast.success('Post created!');
      }
      setShowModal(false);
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post and all its comments?')) return;
    try { await postsAPI.delete(id); toast.success('Deleted!'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const togglePublish = async (p: any) => {
    try {
      await postsAPI.update(p._id, { isPublished: !p.isPublished });
      setPosts(prev => prev.map(post => post._id === p._id ? { ...post, isPublished: !post.isPublished } : post));
    } catch { toast.error('Update failed'); }
  };

  const toggleFeatured = async (p: any) => {
    try {
      await postsAPI.update(p._id, { isFeatured: !p.isFeatured });
      setPosts(prev => prev.map(post => post._id === p._id ? { ...post, isFeatured: !post.isFeatured } : post));
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">Vastu Feed</h1>
          <p className="text-gray-500 text-sm">Manage tips, transformations & social content</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-orange"
        >
          <Plus size={16} /> New Post
        </button>
      </div>

      {/* Posts list */}
      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-20 skeleton rounded-2xl" />)}</div>
      ) : (
        <div className="space-y-3">
          {posts.map(p => (
            <div key={p._id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition-all">
              {/* Media preview */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-orange-50 flex-shrink-0">
                {p.media?.[0]?.url ? (
                  <img src={p.media[0].url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    {p.type === 'tip' ? '💡' : p.type === 'transformation' ? '✨' : '📝'}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">
                  {p.caption?.slice(0, 80)}{(p.caption?.length > 80) ? '…' : ''}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span className="capitalize bg-orange-50 px-2 py-0.5 rounded-full text-orange-600">{p.type}</span>
                  <span className="flex items-center gap-0.5"><Heart size={10} />{p.likes || 0}</span>
                  <span className="flex items-center gap-0.5"><MessageCircle size={10} />{p.commentCount || 0}</span>
                  <span className={`px-1.5 py-0.5 rounded-full ${p.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.isPublished ? 'Live' : 'Draft'}
                  </span>
                  {p.isFeatured && <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><Star size={9} />Featured</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleFeatured(p)} className={`p-1.5 rounded-lg transition-colors ${p.isFeatured ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:bg-gray-50'}`} title="Toggle featured">
                  <Star size={14} />
                </button>
                <button onClick={() => togglePublish(p)} className={`p-1.5 rounded-lg transition-colors ${p.isPublished ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`} title={p.isPublished ? 'Unpublish' : 'Publish'}>
                  {p.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => openEdit(p)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(p._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">📸</div>
              <p className="text-lg font-medium mb-1">No posts yet</p>
              <p className="text-sm">Create your first Vastu tip or transformation story!</p>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
              <h2 className="font-display font-bold text-lg">{editing ? 'Edit Post' : 'New Post'}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>

            <div className="p-5 space-y-4">
              {/* Type + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-style">Post Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-style w-full">
                    {POST_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-style">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-style w-full">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="label-style">Caption *</label>
                <textarea
                  value={form.caption}
                  onChange={e => setForm({ ...form, caption: e.target.value })}
                  className="input-style w-full"
                  rows={4}
                  placeholder="Write your Vastu tip, remedy, or transformation story…"
                />
              </div>

              {/* Author + Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-style">Author</label>
                  <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="input-style w-full" placeholder="Dr. PPS Tomar" />
                </div>
                <div>
                  <label className="label-style">Location (optional)</label>
                  <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input-style w-full" placeholder="New Delhi, India" />
                </div>
              </div>

              {/* Hashtags */}
              <div>
                <label className="label-style">Hashtags (comma-separated)</label>
                <input
                  value={hashtagInput}
                  onChange={e => setHashtagInput(e.target.value)}
                  className="input-style w-full"
                  placeholder="vastu, remedy, tips, transformation"
                />
              </div>

              {/* ── IMAGE UPLOADER ── */}
              <ImageUploader
                images={mediaImages.length ? mediaImages : ['']}
                onChange={setMediaImages}
                maxImages={5}
                label="Post Photos / Videos"
              />

              {/* Flags */}
              <div className="flex gap-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} className="w-4 h-4 accent-primary" />
                  <span className="text-sm font-medium">Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 accent-primary" />
                  <span className="text-sm font-medium">Featured</span>
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Save size={14} />{saving ? 'Saving…' : 'Save Post'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .label-style { display:block; font-size:.8rem; font-weight:500; color:#5C3D1E; margin-bottom:4px; }
        .input-style { padding:8px 12px; border:1px solid #fed7aa; border-radius:10px; font-size:.875rem; outline:none; width:100%; transition:border-color .2s; }
        .input-style:focus { border-color:#FF6B00; box-shadow:0 0 0 2px rgba(255,107,0,.1); }
      `}</style>
    </div>
  );
}
