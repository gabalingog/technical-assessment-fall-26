import React from 'react';

const Navbar = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className='navbar'>
      <div className='navbar-logo'>
        <img src='/logo.png' alt="Mercedes" className='navbar-logo-img' />
      </div>
      <div className='navbar-links'>
        <button onClick={() => scrollTo('overview')}>Overview</button>
        <button onClick={() => scrollTo('results')}>Results</button>
        <button onClick={() => scrollTo('drivers')}>Drivers</button>
        <button onClick={() => scrollTo('charts')}>Charts</button>
      </div>
    </nav>
  );
};

export default Navbar;