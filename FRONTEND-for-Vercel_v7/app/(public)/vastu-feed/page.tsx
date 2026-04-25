'use client';
import { useEffect, useState, useRef } from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import WhatsAppButton from '../../../components/common/WhatsAppButton';
import { useUIStore } from '../../../store/uiStore';
import { postsAPI } from '../../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, Play, Hash, MapPin, ChevronDown, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const CATEGORIES = ['All', 'vastu-tip', 'transformation', 'visit', 'remedy', 'daily-wisdom'];
const SESSION_KEY = 'va_feed_session';

function getSession() {
  if (typeof window === 'undefined') return '';
  let s = sessionStorage.getItem(SESSION_KEY);
  if (!s) { s = Math.random().toString(36).slice(2); sessionStorage.setItem(SESSION_KEY, s); }
  return s;
}

function PostCard({ post, onLike }: { post: any; onLike: (id: string, liked: boolean, count: number) => void }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeMedia, setActiveMedia] = useState(0);

  useEffect(() => {
    const likedSet: string[] = JSON.parse(localStorage.getItem('va_liked_posts') || '[]');
    setLiked(likedSet.includes(post._id));
  }, [post._id]);

  const handleLike = async () => {
    try {
      const r = await postsAPI.like(post._id, getSession());
      setLiked(r.data.liked);
      setLikeCount(r.data.likes);
      onLike(post._id, r.data.liked, r.data.likes);
      const likedSet: string[] = JSON.parse(localStorage.getItem('va_liked_posts') || '[]');
      const updated = r.data.liked ? [...likedSet, post._id] : likedSet.filter((id: string) => id !== post._id);
      localStorage.setItem('va_liked_posts', JSON.stringify(updated));
    } catch { toast.error('Please try again'); }
  };

  const loadComments = async () => {
    if (commentsLoaded) return;
    try {
      const r = await postsAPI.getComments(post._id);
      setComments(r.data.data || []);
      setCommentsLoaded(true);
    } catch { toast.error('Failed to load comments'); }
  };

  const handleShowComments = () => {
    setShowComments(!showComments);
    if (!showComments) loadComments();
  };

  const submitComment = async () => {
    if (!commentName.trim() || !commentText.trim()) { toast.error('Please fill your name and comment'); return; }
    setSubmitting(true);
    try {
      const r = await postsAPI.addComment(post._id, { name: commentName.trim(), text: commentText.trim() });
      setComments(prev => [...prev, r.data.data]);
      setCommentText('');
      setCommenting(false);
      toast.success('Comment posted!');
    } catch { toast.error('Failed to post comment'); }
    finally { setSubmitting(false); }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/vastu-feed#${post._id}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Vastu Tip by Dr. PPS', text: post.caption.slice(0, 100), url }); } catch {}
    } else {
      navigator.clipboard.writeText(url).then(() => toast.success('Link copied!')).catch(() => {});
    }
  };

  const caption = post.caption || '';
  const isLong = caption.length > 200;

  return (
    <motion.div id={post._id} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
      className="bg-white rounded-3xl shadow-sm border border-orange-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-200 flex-shrink-0">
          <img src="/logo.jpg" alt="Dr. PPS" className="w-full h-full object-cover"/>
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-800 text-sm">{post.author || 'Dr. PPS'}</p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {post.location && <span className="flex items-center gap-0.5"><MapPin size={10}/>{post.location}</span>}
            <span>{new Date(post.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
          </div>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${post.type==='transformation'?'bg-green-100 text-green-700':post.type==='tip'?'bg-blue-100 text-blue-700':'bg-orange-100 text-orange-700'}`}>
          {post.type === 'vastu-tip' ? '💡 Tip' : post.type === 'transformation' ? '✨ Transformation' : post.type === 'remedy' ? '🌿 Remedy' : '📸 Update'}
        </span>
      </div>

      {/* Media */}
      {post.media?.length > 0 && (
        <div className="relative">
          {post.media[activeMedia]?.type === 'video' ? (
            <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
              <video src={post.media[activeMedia].url} controls className="w-full h-full object-cover" poster={post.media[activeMedia].thumbnail} preload="none"/>
            </div>
          ) : (
            <div className="aspect-square sm:aspect-video overflow-hidden bg-orange-50">
              <img src={post.media[activeMedia]?.url} alt={caption} className="w-full h-full object-cover"/>
            </div>
          )}
          {post.media.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {post.media.map((_: any, i: number) => (
                <button key={i} onClick={() => setActiveMedia(i)} className={`w-2 h-2 rounded-full transition-all ${activeMedia===i?'bg-white':'bg-white/50'}`}/>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Caption */}
      <div className="px-4 pt-3">
        <p className="text-gray-800 text-sm leading-relaxed">
          {isLong && !expanded ? `${caption.slice(0,200)}…` : caption}
          {isLong && <button onClick={() => setExpanded(!expanded)} className="text-primary text-xs ml-1 font-medium">{expanded?'less':'more'}</button>}
        </p>
        {post.hashtags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {post.hashtags.map((h: string) => (
              <span key={h} className="text-xs text-primary flex items-center gap-0.5"><Hash size={9}/>{ h}</span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-4 py-3">
        <button onClick={handleLike} className={`flex items-center gap-1.5 text-sm font-medium transition-all ${liked?'text-red-500':'text-gray-500 hover:text-red-400'}`}>
          <Heart size={18} fill={liked?'currentColor':'none'} className={liked?'scale-110 transition-transform':''}/>
          <span>{likeCount}</span>
        </button>
        <button onClick={handleShowComments} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary transition-all">
          <MessageCircle size={18}/><span>{post.commentCount || 0}</span>
        </button>
        <button onClick={handleShare} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary transition-all">
          <Share2 size={18}/><span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
            className="border-t border-gray-100 overflow-hidden">
            <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
              {comments.length === 0 && <p className="text-gray-400 text-xs text-center py-2">No comments yet. Be the first!</p>}
              {comments.map((c: any) => (
                <div key={c._id} className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">{c.name[0]}</div>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-gray-700">{c.name} </span>
                    <span className="text-xs text-gray-600">{c.text}</span>
                    {c.replies?.length > 0 && c.replies.map((r: any) => (
                      <div key={r._id} className="ml-3 mt-1 flex gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">{r.name[0]}</div>
                        <span className="text-xs font-bold text-gray-600">{r.name} </span><span className="text-xs text-gray-500">{r.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {!commenting ? (
              <button onClick={() => setCommenting(true)} className="w-full py-2.5 text-xs text-primary font-medium border-t border-gray-100 hover:bg-orange-50 transition-colors">
                + Add a comment
              </button>
            ) : (
              <div className="p-3 border-t border-gray-100 space-y-2">
                <input value={commentName} onChange={e => setCommentName(e.target.value)} placeholder="Your name" className="w-full text-xs px-3 py-2 border border-orange-200 rounded-xl focus:outline-none focus:border-primary"/>
                <div className="flex gap-2">
                  <input value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key==='Enter' && submitComment()} placeholder="Write a comment…" className="flex-1 text-xs px-3 py-2 border border-orange-200 rounded-xl focus:outline-none focus:border-primary"/>
                  <button onClick={submitComment} disabled={submitting} className="px-3 py-2 bg-primary text-white rounded-xl text-xs font-bold disabled:opacity-60"><Send size={12}/></button>
                  <button onClick={() => setCommenting(false)} className="px-2 py-2 text-gray-400 hover:text-gray-600"><X size={12}/></button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function VastuFeedPage() {
  const { lang } = useUIStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const load = async (cat: string, pg: number, append = false) => {
    if (pg === 1) setLoading(true); else setLoadingMore(true);
    try {
      const params: any = { page: pg, limit: 9 };
      if (cat !== 'All') params.category = cat;
      const r = await postsAPI.getAll(params);
      const data = r?.data?.data || [];
      setPosts(prev => append ? [...prev, ...data] : data);
      setHasMore(data.length === 9);
    } catch { toast.error('Failed to load feed'); }
    finally { setLoading(false); setLoadingMore(false); }
  };

  useEffect(() => { setPage(1); load(category, 1, false); }, [category]);

  const loadMore = () => { const next = page + 1; setPage(next); load(category, next, true); };

  const handleLike = (id: string, liked: boolean, count: number) => {
    setPosts(prev => prev.map(p => p._id === id ? {...p, likes: count} : p));
  };

  return (
    <>
      <Navbar />
      <main style={{background:'linear-gradient(135deg,#FFFDF7 0%,#FFF8EE 100%)'}}>
        <section className="bg-dark-gradient py-12 text-center relative">
          <div className="absolute inset-0 mandala-bg opacity-10"/>
          <div className="relative">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">Vastu Remedies Feed</h1>
            <p className="text-gray-300 text-sm">Daily Vastu tips, transformations & wisdom by Dr. PPS</p>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap mb-6">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${category===c?'bg-primary text-white':'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'}`}>
                {c === 'All' ? '📋 All' : c === 'vastu-tip' ? '💡 Tips' : c === 'transformation' ? '✨ Transformations' : c === 'visit' ? '📍 Visits' : c === 'remedy' ? '🌿 Remedies' : '🌟 Wisdom'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-4">{[...Array(3)].map((_,i)=><div key={i} className="h-64 skeleton rounded-3xl"/>)}</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🌿</div>
              <p className="text-gray-400">No posts yet in this category.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {posts.map(post => <PostCard key={post._id} post={post} onLike={handleLike}/>)}
              {hasMore && (
                <button onClick={loadMore} disabled={loadingMore}
                  className="w-full py-3 rounded-2xl border border-orange-200 text-primary font-medium text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
                  {loadingMore ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"/> : <ChevronDown size={16}/>}
                  {loadingMore ? 'Loading…' : 'Load More'}
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
