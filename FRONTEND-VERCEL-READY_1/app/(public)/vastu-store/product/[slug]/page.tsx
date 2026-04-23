'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import CartDrawer from '../../../../../components/common/CartDrawer';
import WhatsAppButton from '../../../../../components/common/WhatsAppButton';
import ProductCard from '../../../../../components/store/ProductCard';
import PriceDisplay from '../../../../../components/common/PriceDisplay';
import { useUIStore } from '../../../../../store/uiStore';
import { useCartStore } from '../../../../../store/cartStore';
import { productsAPI } from '../../../../../lib/api';
import { Product } from '../../../../../types';
import { ShoppingCart, CheckCircle, Star } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { lang } = useUIStore();
  const addItem = useCartStore(s => s.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      productsAPI.getBySlug(slug as string).then(r => {
        setProduct(r.data.data);
        setRelated(r.data.related || []);
      }).finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) return (<><Navbar /><div className="min-h-screen flex items-center justify-center"><div className="text-5xl animate-spin">🕉️</div></div><Footer /></>);
  if (!product) return (<><Navbar /><div className="min-h-screen flex items-center justify-center text-center"><div><div className="text-5xl mb-3">📦</div><p>Product not found</p><Link href="/vastu-store" className="text-primary hover:underline mt-4 block">Back to Store</Link></div></div><Footer /></>);

  const name = lang === 'hi' && product.name.hi ? product.name.hi : product.name.en;
  const description = lang === 'hi' && product.description.hi ? product.description.hi : product.description.en;

  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm mb-3">
                {product.images[activeImg] ? (
                  <img src={product.images[activeImg]} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl">🕉️</div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${activeImg === i ? 'border-primary' : 'border-transparent'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-wide mb-2">{product.category}</p>
              <h1 className="font-display text-3xl font-bold text-text-dark mb-3">{name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />)}</div>
                <span className="text-sm text-gray-500">{product.reviewCount || 120} reviews</span>
              </div>
              <PriceDisplay original={product.price} offer={product.offerPrice} size="lg" />
              <p className="text-text-mid text-sm mt-4 mb-6 leading-relaxed">{description}</p>
              {product.benefits.length > 0 && (
                <div className="mb-6 space-y-2">
                  {product.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500 flex-shrink-0" /><span className="text-text-mid text-sm">{b}</span></div>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => product.stock > 0 && addItem(product)} disabled={product.stock === 0} className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold transition-all shadow-orange disabled:opacity-50">
                  <ShoppingCart size={18} />{product.stock > 0 ? (lang === 'en' ? 'Add to Cart' : 'कार्ट में जोड़ें') : 'Out of Stock'}
                </button>
              </div>
              {product.sku && <p className="text-xs text-gray-400 mt-4">SKU: {product.sku}</p>}
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-bold text-text-dark mb-6">Related Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {related.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
}
