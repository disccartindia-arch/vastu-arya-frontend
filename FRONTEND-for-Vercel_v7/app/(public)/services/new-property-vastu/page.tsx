import ServicePageTemplate from '../../../../components/services/ServicePageTemplate';
export default function Page() {
  return <ServicePageTemplate
    icon="🏗️" badge="Before You Buy" title="New Property Vastu Check" duration="45 minutes"
    subtitle="Check Vastu before buying or renting any property — avoid costly mistakes with Dr. PPS Tomar"
    originalPrice={2999} price={1999}
    description="The property you choose shapes your destiny. Before investing in a new home, plot, flat or commercial space, let Dr. PPS Tomar assess its Vastu. Submit floor plans and photographs. Receive a detailed assessment covering entry, kitchen, master bedroom, toilet placements, plot shape, road-facing direction — with a clear go/no-go recommendation."
    benefits={['Floor plan and photo analysis','Go/no-go purchase recommendation','Entry bedroom kitchen analysis','Plot shape and road direction Vastu','Toilet and bathroom placement check','Remedy cost estimation if defects found','Multiple property comparison','Report within 48 hours']}
    process={[{'step':'1','title':'Share Property Details','desc':'Send floor plan photos, site location and entrance direction.'},{'step':'2','title':'Detailed Analysis','desc':'Dr. PPS Tomar analyses the property for Vastu strengths and defects.'},{'step':'3','title':'Consultation Call','desc':'45-minute call with clear buy/avoid/remedy recommendation.'},{'step':'4','title':'Written Report','desc':'Receive a written Vastu assessment report within 48 hours.'}]}
    faqs={[{'q':'Can you analyse a property I haven't visited?','a':'Yes — floor plans and photographs are sufficient for a comprehensive Vastu assessment.'},{'q':'What if there are Vastu defects in my dream property?','a':'Many defects can be corrected with non-demolition remedies. Defect severity will be clearly indicated.'},{'q':'Can you compare two or three properties?','a':'Yes — property comparison can be included for a small additional fee.'},{'q':'Is this for residential properties only?','a':'No — we analyse residential, commercial, industrial and plot properties.'}]}
  />;
}
