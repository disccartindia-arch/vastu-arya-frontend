import ServicePageTemplate from '../../../../components/services/ServicePageTemplate';
export default function Page() {
  return <ServicePageTemplate
    icon="💎" badge="Astrology-Based" title="Personalised Gemstone Guidance" duration="45 minutes"
    subtitle="Know exactly which gemstone to wear based on your birth chart by Dr. PPS Tomar"
    originalPrice={2499} price={1499}
    description="Wearing the wrong gemstone can cause harm. Dr. PPS Tomar analyses your complete birth chart, current planetary periods (dasha), and life goals to recommend the correct gemstone(s). Covers: which stone(s) to wear, which finger, which metal, weight/carat requirement, the auspicious day to start wearing, and the activation mantra. Also specifies which stones you must avoid."
    benefits={['Complete birth chart analysis','Correct gemstone recommendation','Stones to avoid — equally important','Which finger and metal to use','Weight and carat requirement','Auspicious day and mantra','Activation procedure guidance','Where to source authentic stones']}
    process={[{'step':'1','title':'Submit Birth Details','desc':'Share date, time and place of birth and your current life challenges.'},{'step':'2','title':'Chart Analysis','desc':'Dr. PPS Tomar analyses planetary positions and current dasha.'},{'step':'3','title':'Recommendation Call','desc':'45-minute consultation covering your gemstone prescription.'},{'step':'4','title':'Sourcing Support','desc':'Guidance on authentic sources at fair prices.'}]}
    faqs={[{'q':'Is gemstone recommendation safe?','a':'When done by a qualified astrologer based on your chart, gemstone therapy is safe. Wearing without analysis can be harmful.'},{'q':'What if I was born at an unknown time?','a':'Dr. PPS Tomar uses chart rectification techniques to determine approximate birth time.'},{'q':'Do I need expensive gemstones?','a':'Not always. Some effective stones are very affordable. Recommendation is based on your specific needs.'},{'q':'How long does a gemstone take to show effect?','a':'Most people notice initial effects within 21-40 days. Full benefits emerge over 3-6 months.'}]}
  />;
}
