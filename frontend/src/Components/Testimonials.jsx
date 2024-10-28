import React from 'react';
import '../Styles/testimonials.css';

const Testimonials = () => {
  return (
    <section id="testimonials" className="testimonials">
      <h2>What Our Users Say</h2>
      <div className="testimonials-grid">
        <div className="testimonial-item">
          <p>"The best food delivery service I have ever used!"</p>
          <h4>- Simon D.</h4>
        </div>
        <div className="testimonial-item">
          <p>"Super fast and quality food"</p>
          <h4>- Evans A.</h4>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
