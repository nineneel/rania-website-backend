import { useState } from 'react';
import Header from '../../components/layout/Header';
import Button from '../../components/common/Button/Button';
import SEO from '../../components/common/SEO';
import { StructuredData } from '../../components/common/SEO';
import './Support.css';

// Import hero image
import heroSupport from '../../assets/images/support-help/support-help-hero.webp';

const Support = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      question: "What is RANIA's role in the visa application process?",
      answer: "RANIA provides comprehensive services for Umrah & Haji visa processing. Our professional team will handle the entire administrative process, from document verification and submission to the relevant authorities, to providing assistance in fulfilling any requirements. This allows pilgrims to prepare for their worship with peace of mind, unburdened by visa concerns."
    },
    {
      question: "Does RANIA have special access for Hajj or Umrah visa processing?",
      answer: "RANIA's key advantage is its status as a travel agency that also serves as an official visa provider exclusively for its pilgrims. This provides priority in the visa application process, freeing our clients from the long queues with thousands of other applicants and eliminating concerns about potential delays."
    },
    {
      question: "What is the refund policy if the visa application is not approved?",
      answer: "In the event of a visa rejection, the refund process will refer to the terms and conditions applicable at RANIA. Pilgrims/travelers will receive a partial refund after deduction of administrative fees and other costs already incurred. We will provide an official explanation regarding the details of the rejection and the refund. It is important to understand that the decision to reject a visa is the absolute authority of the Embassy or the Government of the Kingdom of Saudi Arabia."
    },
    {
      question: "What is the minimum passport validity required for departure?",
      answer: "Your passport must have a minimum of 8 months of validity remaining before the date of departure. Renew it immediately if the validity is less than that limit. Additionally, ensure the passport is in good condition (undamaged), the name on the passport must exactly match what is listed on your ID card (KTP) and Family Card (KK), and it must consist of at least 2 words/names, for example: Muhammad Yaser."
    },
    {
      question: "What is the estimated time required for the visa process from start to finish?",
      answer: "The processing time for an Umrah visa requires 7 to 15 working days after all documents are received complete. Meanwhile, a Special Hajj visa takes longer, which is several weeks up to 1 month, as it depends on the policy of the Ministry of Religious Affairs (Kemenag), the Government of Saudi Arabia, and the completeness of the pilgrims' files."
    },
    {
      question: "What are the administrative requirements that must be fulfilled to register for the Umrah or Hajj program?",
      answer: "Prospective pilgrims who wish to register for Umrah or Hajj through RANIA need to prepare several important documents, namely: a passport (with a minimum validity of 8 months), National Identity Card (KTP), Family Card (KK), birth certificate or marriage certificate, four 4x6 photographs, the yellow book (if required), a registration form, and a BPJS card (if mandatory)."
    }
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const quickHelp = [
    {
      title: "Call Us",
      description: "Speak directly with our team",
      action: "0811-8855-489",
      link: "tel:08118855489"
    },
    {
      title: "Email Support",
      description: "Send us your questions",
      action: "Contact Form",
      link: "/contact"
    },
    {
      title: "Office Visit",
      description: "Meet us in person",
      action: "View Location",
      link: "/contact"
    }
  ];

  return (
    <div className="support">
      {/* SEO Meta Tags */}
      <SEO
        title="Support - RANIA Help Center & FAQ"
        description="Find answers to common questions about Hajj and Umrah packages with RANIA. Get help with booking, documents, payment plans, and more. 24/7 customer support available."
        keywords="rania support, rania help, rania faq, rania customer service, hajj faq, umrah faq, travel support"
        canonical="/support"
      />
      <StructuredData
        type="breadcrumb"
        data={[
          { name: 'Home', url: '/' },
          { name: 'Support', url: '/support' }
        ]}
      />

      {/* Header */}
      <Header activeLink="Support" />

      {/* Hero Section */}
      <section className="support-hero-section" style={{ backgroundImage: `url(${heroSupport})` }}>
        <div className="support-hero-overlay"></div>
        <div className="support-hero-content">
          <h1 className="support-hero-title">How Can We Help You?</h1>
          <p className="support-hero-subtitle">
            Find answers to common questions or reach out to our support team
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="support-faq-section">
        <h2 className="support-faq-title">About Visa & Documentation</h2>
        <div className="support-faq-container">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`support-faq-item ${expandedFaq === index ? 'expanded' : ''}`}
              onClick={() => toggleFaq(index)}
            >
              <div className="support-faq-header">
                <h3 className="support-faq-question">{faq.question}</h3>
                <div className={`support-faq-indicator ${expandedFaq === index ? 'active' : ''}`}>
                  <span className="support-faq-icon"></span>
                </div>
              </div>
              {expandedFaq === index && (
                <p className="support-faq-answer">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>
      

      {/* Quick Help Section */}
      <section className="support-quick-section">
        <div className="support-quick-container">
          {quickHelp.map((help, index) => (
            <div key={index} className="support-quick-card">
              <h3 className="support-quick-title">{help.title}</h3>
              <p className="support-quick-description">{help.description}</p>
              <Button
                variant="primary"
                size="small"
                to={help.link.startsWith('tel:') ? undefined : help.link}
                onClick={help.link.startsWith('tel:') ? () => window.location.href = help.link : undefined}
              >
                {help.action}
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Support;
