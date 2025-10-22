import Carousel from '../Carousel';
import './Testimonial.css';

const Testimonial = ({
  testimonials = [
    {
      name: "Name",
      position: "Position/Company",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      name: "Name",
      position: "Position/Company",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      name: "Name",
      position: "Position/Company",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      name: "Name",
      position: "Position/Company",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    }
  ],
  title = "What They Say?"
}) => {
  return (
    <section className="testimonial-section">
      <h2 className="testimonial-title">{title}</h2>
      <div className="testimonial-container">
        <Carousel
          slidesPerView={1}
          spaceBetween={24}
          navigation={true}
          pagination={true}
          autoplay={true}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-info">
                <h3 className="testimonial-name">{testimonial.name}</h3>
                <p className="testimonial-position">{testimonial.position}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonial;
