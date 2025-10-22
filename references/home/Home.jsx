import { useState, useEffect, useRef } from 'react';

import './Home.css';
import Button from '../../components/common/Button/Button';
import Header from '../../components/layout/Header/Header';
import Footer from '../../components/layout/Footer/Footer';
import Carousel from '../../components/common/Carousel/Carousel';
import Partners from '../../components/common/Partners';
import SignatureCard from '../../components/common/SignatureCard';
import SEO from '../../components/common/SEO';
import { StructuredData } from '../../components/common/SEO';

// Import hero images
import hero1 from '../../assets/images/home/hero/hero-1.webp';
import hero2 from '../../assets/images/home/hero/hero-2.webp';
import hero3 from '../../assets/images/home/hero/hero-3.webp';
import hero4 from '../../assets/images/home/hero/hero-4.webp';

// Import journey images
import journey1 from '../../assets/images/home/jurney/jurney_1.webp';
import journey2 from '../../assets/images/home/jurney/jurney-2.webp';
import journey3 from '../../assets/images/home/jurney/jurney-3.webp';


// Import upcoming event images
import upcomingEvent1 from '../../assets/images/home/upcoming-event/upcoming-event-1.webp';
import upcomingEvent2 from '../../assets/images/home/upcoming-event/upcoming-event-2.webp';
import upcomingEvent3 from '../../assets/images/home/upcoming-event/upcoming-event-3.webp';

// Import signature card image
import signatureCard from '../../assets/images/home/signature-card.webp';

// Import value images
import value1 from '../../assets/images/home/value/value-1.webp';
import value2 from '../../assets/images/home/value/value-2.webp';
import value3 from '../../assets/images/home/value/value-3.webp';
import value4 from '../../assets/images/home/value/value-4.webp';
import value5 from '../../assets/images/home/value/value-5.webp';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bgColor, setBgColor] = useState('var(--primary-dark)');
  const [textColor, setTextColor] = useState('white');

  // Refs for tracking sections
  const servicesRef = useRef(null);
  const eventsRef = useRef(null);
  const signatureRef = useRef(null);

  const heroSlides = [
    {
      title: "Weekly Departure From Jakarta To ...",
      subtitle: "The Sacred Umrah Journey Crafted For Your Heart",
      image: hero1
    },
    {
      title: "Hajj Without Wait, Hajj With Rania",
      subtitle: "We remove the worry. You receive the blessing",
      image: hero2
    },
    {
      title: "Webinar With Rania",
      subtitle: "Let us help you replace your worries with wisdom",
      image: hero3
    },
    {
      title: "Rania To The World",
      subtitle: "Discover the world through personalized journeys that reveal the authentic soul of each destination",
      image: hero4
    }
  ];

  const values = [
    { title: "Trust", subtitle: "With Integrity", icon: value1 },
    { title: "Heartfelt", subtitle: "Care", icon: value2 },
    { title: "Excellence", subtitle: "End-to-end Service", icon: value3 },
    { title: "Spirituality", subtitle: "Best Service", icon: value4 },
    { title: "Elevation", subtitle: "Journey", icon: value5 }
  ];

  const services = [
    {
      title: "Hajj With Rania",
      description: "Journey with a serene soul, ready to receive the immense blessings of Hajj.",
      image: journey1,
      available: true,
      link: "/hajj"
    },
    {
      title: "Umrah With Rania",
      description: "Take the first step toward the journey your heart has been yearning for.",
      image: journey2,
      available: true,
      link: "/umrah"
    },
    {
      title: "World With Rania",
      description: "Discover the world through personalized journeys that reveal the authentic soul of each destination.",
      image: journey3,
      available: false,
      link: null
    }
  ];
  
  const events = [
    {
      title: "Scheduled Webinar",
      description: "Join our complimentary webinar for heartfelt guidance on your upcoming pilgrimage.",
      image: upcomingEvent1,
      available: true,
      link: "https://docs.google.com/forms/d/e/1FAIpQLSchCmTZJQ9ZDd9Z6GMCQE2Uy64P9RltS8qUxfkAD5ylm8dFCg/viewform"
    },
    {
      title: "Digital Manasik",
      description: "Find the true understanding, learn the Manasik with our supportive and accessible online program.",
      image: upcomingEvent2,
      available: false
    },
    {
      title: "Live Event",
      description: "Join our live event to share in the spirit and prepare your heart for the journey ahead.",
      image: upcomingEvent3,
      available: false
    }
  ];

  // Auto-advance hero slides every 4 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(slideInterval);
  }, [heroSlides.length]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Get Events section position
      if (eventsRef.current) {
        const eventsTop = eventsRef.current.getBoundingClientRect().top + scrollY;

        // Change to white background when reaching events section
        if (scrollY + windowHeight / 2 >= eventsTop) {
          setBgColor('#ffffff');
          setTextColor('var(--text-primary)'); // Dark text on white background
        } else {
          setBgColor('var(--primary-dark)');
          setTextColor('white'); // White text on dark background
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to services section
  const scrollToServices = () => {
    if (servicesRef.current) {
      servicesRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="home" style={{ backgroundColor: bgColor, transition: 'background-color 0.5s ease' }}>
      {/* SEO Meta Tags */}
      <SEO
        title="Redefine Hajj Reimagined Journey"
        description="RANIA - Your trusted partner for exclusive Umrah and Hajj pilgrimage services. Premium travel packages with exceptional service, comfort, and spiritual connection. Licensed PPIU & PIHK operator."
        keywords="rania, rania travel, travel rania, umrah travel, hajj travel, rania hajj, rania umrah, umrah indonesia, hajj indonesia, umroh rania, haji rania, paket umrah, paket haji, travel umrah terpercaya, travel haji terbaik, PPIU, PIHK, umrah package, hajj package"
        canonical="/"
      />
      <StructuredData type="organization" />
      <StructuredData type="website" />

      {/* Header */}
      <Header activeLink="Home" />

      {/* Hero Section */}
      <section className="hero-section">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero-overlay"></div>
            <div className={`hero-content ${index === currentSlide ? 'active' : ''}`}>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-subtitle">{slide.subtitle}</p> 
              <div className="hero-buttons">
                <Button variant="primary" size="small" onClick={scrollToServices}>See Details</Button>
                <Button variant="tertiary" size="small" to='/contact'>Contact Rania</Button>
              </div>
            </div>
          </div>
        ))}
        <div className="hero-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="values-container">
          {values.map((value, index) => (
            <div key={index} className="value-card">
              <div className="value-icon-wrapper">
                <img src={value.icon} alt={value.title} className="value-icon" />
              </div>
              <div className="value-text">
                <h3 className="value-title">{value.title}</h3>
                <p className="value-subtitle">{value.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="programs" ref={servicesRef} className="services-section">
        <h2 className="service-section-title" style={{ color: textColor, transition: 'color 0.5s ease' }}>Redefine Your Journey</h2>
        <Carousel className="services-carousel">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-image" style={{ backgroundImage: `url(${service.image})` }}>
                <div className="service-overlay"></div>
                <div className="service-content">
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  <Button
                    variant={service.available ? 'primary' : 'primary-dark'}
                    size="small"
                    disabled={!service.available}
                    to={service.available ? service.link : undefined}
                  >
                    {service.available ? 'See Details' : 'Coming Soon'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Partners Carousel */}
      <div id="partners">
        <Partners />
      </div>

      {/* Upcoming Events */}
      <section id="events" ref={eventsRef} className="events-section">
        <h2 className="section-title" style={{ color: textColor, transition: 'color 0.5s ease' }}>Upcoming Events</h2>
        <Carousel className="events-carousel">
          {events.map((event, index) => (
            <div key={index} className="event-card">
              <div className="event-image" style={{ backgroundImage: `url(${event.image})` }}>
                <div className="event-overlay"></div>
                <div className="event-content">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                  <Button 
                   variant={event.available ? 'primary' : 'primary-dark'}
                    size="small"
                    disabled={!event.available}
                    to={event.available ? event.link : undefined}
                  > 
                    {event.available ? 'I\'m Interest' : 'Coming Soon'} 
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Signature Card Section */}
      <div id="signature-card">
        <SignatureCard
          image={signatureCard}
          textColor={textColor}
        />
      </div>
    </div>
  );
};

export default Home;
