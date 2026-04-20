import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <video autoPlay muted loop playsInline className="footer-video">
        <source src="/footer.mov" type="video/mp4" />
      </video>
    </footer>
  );
};

export default Footer;