'use client';
import ServicePageTemplate from '../../../../components/services/ServicePageTemplate';
export default function Page() {
  return <ServicePageTemplate
    icon="🏢" badge="For Business Owners" title="Business Vastu Consultation" duration="60 minutes"
    subtitle="Increase profits, attract customers and resolve employee issues with expert Business Vastu"
    originalPrice={4999} price={2999}
    description="Business success is deeply connected to the Vastu of your commercial space. Dr. PPS Tomar's Business Vastu Consultation covers cash box placement, entrance, seating, owner's cabin, reception, storage and all zones affecting profitability, employee harmony and customer footfall. Ideal for shops, restaurants, offices, clinics and factories."
    benefits={['Cash box and safe optimal placement','Entrance and signboard Vastu','Owner cabin power positioning','Employee seating arrangement','Customer attraction remedies','Storage and inventory zone','Reception and waiting area Vastu','No demolition required']}
    process={[{'step':'1','title':'Book & Send Details','desc':'Book session and send photographs of your business space and current challenges.'},{'step':'2','title':'Space Analysis','desc':'Dr. PPS Tomar analyses your business space for energy blocks and profit zones.'},{'step':'3','title':'Consultation Call','desc':'60-minute detailed consultation covering every department and optimisation.'},{'step':'4','title':'Implementation Support','desc':'Written recommendations with 30-day follow-up to track results.'}]}
    faqs={[{'q':'Is this suitable for online businesses?','a':'Yes — your home office Vastu applies equally to online businesses.'},{'q':'What types of businesses have you helped?','a':'Shops, restaurants, clinics, law firms, IT companies, factories and startups.'},{'q':'How quickly can business improve?','a':'Most business owners report improvement in customer footfall within 30-60 days.'},{'q':'Can I claim this as a business expense?','a':'Many business owners claim consultation fees as professional development. Consult your accountant.'}]}
  />;
}
