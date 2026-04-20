import React, { useState, useRef } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <nav className='navbar'>
      <img src='/logo.png' alt="Mercedes" className='navbar-logo-img' />
      <div className='navbar-links'>
        <button onClick={() => scrollTo('overview')}>Overview</button>
        <button onClick={() => scrollTo('results')}>Results</button>
        <button onClick={() => scrollTo('drivers')}>Drivers</button>
        <button onClick={() => scrollTo('charts')}>Charts</button>
      </div>
      <button className='music-btn' onClick={togglePlay}>
        {playing ? (
            <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
            </svg>
            <span className='music-label'>Pause</span>
            </>
        ) : (
            <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21"/>
            </svg>
            <span className='music-label'>Play Audio</span>
            </>
        )}
        </button>
      <audio ref={audioRef} src="/song.mp3" loop />
    </nav>
  );
};

export default Navbar;