import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import SEO from '../../components/common/SEO';
import { StructuredData } from '../../components/common/SEO';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [socialMedia, setSocialMedia] = useState([]);
  const [socialMediaLoading, setSocialMediaLoading] = useState(true);

  // Fetch social media links on component mount
  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const API_URL = 'http://127.0.0.1:8000/api/social-media';
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.success && data.data) {
          setSocialMedia(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch social media:', error);
      } finally {
        setSocialMediaLoading(false);
      }
    };

    fetchSocialMedia();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      // API endpoint - update this URL to match your backend server
      const API_URL = 'http://127.0.0.1:8000/api/contact';

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Thank you for contacting us. We will get back to you soon.',
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        // Handle validation errors
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(' ');
          setSubmitStatus({
            type: 'error',
            message: errorMessages,
          });
        } else {
          setSubmitStatus({
            type: 'error',
            message: data.message || 'Something went wrong. Please try again.',
          });
        }
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact">
      {/* SEO Meta Tags */}
      <SEO
        title="Contact RANIA - Hajj & Umrah Consultation"
        description="Get in touch with RANIA for Hajj and Umrah consultation. Contact us for booking inquiries, package information, and customer support. Office in Jakarta Selatan. Call 0811-8855-489 or visit our office."
        keywords="contact rania, rania travel contact, kontak rania, hubungi rania, rania customer service, rania jakarta, rania office"
        canonical="/contact"
      />
      <StructuredData
        type="breadcrumb"
        data={[
          { name: 'Home', url: '/' },
          { name: 'Contact Us', url: '/contact' }
        ]}
      />

      {/* Header */}
      <Header activeLink="Contact Us" />

      {/* Title Section */}
      <section className="contact-title-section">
        <h1 className="contact-main-title">Let's Start Your Sacred Journey</h1>
        <p className="contact-main-subtitle">
          Have questions? We're here to help you every step of the way
        </p>
      </section>

      {/* Main Content Section */}
      <section className="contact-main-section">
        <div className="contact-main-container">
          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <h2 className="contact-form-title">Send Us a Message</h2>
            <p className="contact-form-description">
              Fill out the form below and we'll get back to you as soon as possible
            </p>

            {/* Status Message */}
            {submitStatus.message && (
              <div className={`contact-form-status ${submitStatus.type === 'success' ? 'success' : 'error'}`}>
                {submitStatus.message}
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="contact-form-group">
                <label htmlFor="name" className="contact-form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="contact-form-input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="email" className="contact-form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="contact-form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="contact-form-row">
              <div className="contact-form-group">
                <label htmlFor="phone" className="contact-form-label">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="contact-form-input"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="subject" className="contact-form-label">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="contact-form-input"
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="contact-form-group">
              <label htmlFor="message" className="contact-form-label">Message</label>
              <textarea
                id="message"
                name="message"
                className="contact-form-textarea"
                placeholder="Tell us more about your inquiry..."
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              ></textarea>
            </div>

              <button
                type="submit"
                className="contact-form-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Why Contact Us */}
          <div className="contact-why-wrapper">
            <h2 className="contact-why-title">Why Choose Rania?</h2>
            <div className="contact-why-items">
              <div className="contact-why-item">
                <div className="contact-why-number">01</div>
                <div className="contact-why-content">
                  <h3 className="contact-why-item-title">Expert Guidance</h3>
                  <p className="contact-why-item-text">
                    Our experienced team provides personalized support for your spiritual journey
                  </p>
                </div>
              </div>

              <div className="contact-why-item">
                <div className="contact-why-number">02</div>
                <div className="contact-why-content">
                  <h3 className="contact-why-item-title">24/7 Support</h3>
                  <p className="contact-why-item-text">
                    We're always available to answer your questions and address your concerns
                  </p>
                </div>
              </div>

              <div className="contact-why-item">
                <div className="contact-why-number">03</div>
                <div className="contact-why-content">
                  <h3 className="contact-why-item-title">Trusted Partner</h3>
                  <p className="contact-why-item-text">
                    Certified and accredited travel provider with years of experience
                  </p>
                </div>
              </div>

              <div className="contact-why-item">
                <div className="contact-why-number">04</div>
                <div className="contact-why-content">
                  <h3 className="contact-why-item-title">Premium Service</h3>
                  <p className="contact-why-item-text">
                    Exclusive packages designed for comfort, security, and serene worship
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="contact-info-section">
        <div className="contact-info-container">
          <div className="contact-info-card">
            <div className="contact-info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h3 className="contact-info-title">Office Address</h3>
            <p className="contact-info-text">
              Mall Kota Kasablanka, Prudential Centre,<br />
              Kav No.88 Floor 7N,<br />
              Kota Jakarta Selatan, 12870
            </p>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <h3 className="contact-info-title">Hotline</h3>
            <p className="contact-info-text">
              <a href="tel:08118855489" className="contact-info-link">0811-8855-489</a>
            </p>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h3 className="contact-info-title">Working Hours</h3>
            <p className="contact-info-text">
              Monday - Friday: 8.00 am – 7.00 pm<br />
              Saturday & Sunday: 8.00 am – 6.00 pm
            </p>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="contact-social-section">
        <h2 className="contact-social-title">Connect With Us</h2>
        {socialMediaLoading ? (
          <div className="contact-social-loading">Loading social media...</div>
        ) : socialMedia.length > 0 ? (
          <div className="contact-social-links">
            {socialMedia.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-link"
              >
                <span className="contact-social-icon">
                  {social.icon_url ? (
                    <img
                      src={social.icon_url}
                      alt={social.name}
                      className="contact-social-icon-img"
                    />
                  ) : (
                    <span className="contact-social-icon-placeholder">
                      {social.name.charAt(0)}
                    </span>
                  )}
                </span>
                <span className="contact-social-name">{social.name}</span>
              </a>
            ))}
          </div>
        ) : (
          <div className="contact-social-empty">No social media links available</div>
        )}
      </section>
    </div>
  );
};

export default Contact;
