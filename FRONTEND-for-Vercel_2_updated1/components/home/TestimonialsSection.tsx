'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { testimonialsAPI } from '../../lib/api';

// Hardcoded fallback — used when no testimonials exist in database yet
const FALLBACK_TESTIMONIALS = [
  { _id: 'f1', name: 'Rajesh Kumar', city: 'New Delhi', service: 'Vastu Check', rating: 5, text: 'Dr. PPS transformed our home completely. After his Vastu analysis, we experienced positive changes in our business and family harmony within 2 months.', avatar: '' },
  { _id: 'f2', name: 'Priya Sharma', city: 'Mumbai', service: 'Numerology Analysis', rating: 5, text: 'The numerology report was incredibly detailed. Dr. PPS identified issues I never knew existed and provided practical remedies that actually worked!', avatar: '' },
  { _id: 'f3', name: 'Amit Patel', city: 'Ahmedabad', service: 'Smart Layout', rating: 5, text: 'Our new factory layout by Dr. PPS has shown remarkable improvements in productivity. The Vastu-compliant design truly makes a difference!', avatar: '' },
  { _id: 'f4', name: 'Sunita Reddy', city: 'Hyderabad', service: 'Mobile Numerology', rating: 5, text: 'Changed my mobile number as suggested. Within weeks, I noticed better communication, new opportunities, and overall positive energy in life!', avatar: '' },
  { _id: 'f5', name: 'Vikram Singh', city: 'Jaipur', service: 'Book Appointment', rating: 5, text: 'Just ₹11 for WhatsApp consultation with an IVAF expert? Unbelievable value! Dr. PPS guided me on urgent Vastu issues immediately.', avatar: '' },
  { _id: 'f6', name: 'Meera Krishnan', city: 'Chennai', service: 'Vastu Consultancy', rating: 5, text: 'The full consultancy package was worth every rupee. Dr. PPS is knowledgeable, patient, and truly cares about helping you improve your life.', avatar: '' },
];

interface TestimonialItem {
  _id: string;
  name: string;
  city: string;
  service: string;
  rating: number;
  text: string;
  avatar?: string;
}

export default function TestimonialsSection() {
  const { lang } = useUIStore();
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testimonialsAPI
      .getAll({ isActive: true })
      .then((r: any) => {
        const data: TestimonialItem[] = r?.data?.data || [];
        // Use API data when available; otherwise fall back to hardcoded list
        setTestimonials(data.length > 0 ? data : FALLBACK_TESTIMONIALS);
      })
      .catch(() => {
        setTestimonials(FALLBACK_TESTIMONIALS);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-accent text-primary text-sm tracking-widest uppercase">Testimonials</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-dark mt-2 mb-3">
            {lang === 'en' ? 'What Our Clients Say' : 'हमारे ग्राहक क्या कहते हैं'}
          </h2>
          <p className="text-text-light">
            {lang === 'en' ? '10,000+ happy clients across India' : 'पूरे भारत में 10,000+ खुश ग्राहक'}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 skeleton rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-cream rounded-2xl p-6 border border-orange-100 hover:border-primary/30 hover:shadow-orange transition-all"
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(Math.min(5, Math.max(1, t.rating)))].map((_, j) => (
                    <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-text-mid text-sm leading-relaxed mb-4 italic">"{t.text}"</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  {t.avatar ? (
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-saffron-gradient rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {t.name[0]}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-text-dark text-sm">{t.name}</div>
                    <div className="text-xs text-text-light">
                      {t.city}{t.city && t.service ? ' • ' : ''}{t.service}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
