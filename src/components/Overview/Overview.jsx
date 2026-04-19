import React, { useEffect, useState } from 'react';
import './Overview.css';

const Overview = () => {
  const [constructorStanding, setConstructorStanding] = useState(null);
  const [driverStandings, setDriverStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [constructorRes, driversRes] = await Promise.all([
          fetch('https://api.jolpi.ca/ergast/f1/2024/constructorstandings/?constructorId=mercedes'),
          fetch('https://api.jolpi.ca/ergast/f1/2024/driverstandings/'),
        ]);

        const constructorData = await constructorRes.json();
        const driversData = await driversRes.json();

        const standing = constructorData?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings?.[0];
        setConstructorStanding(standing);

        const allDrivers = driversData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
        const mercedesDriverIds = ['russell', 'hamilton'];
        const mercedesDrivers = allDrivers.filter(d =>
          mercedesDriverIds.some(id => d.Driver?.driverId?.includes(id))
        );
        setDriverStandings(mercedesDrivers);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const photos = {
    titles: '/pic1.png',
    races: '/pic2.png',
  };

  const handlePhoto = (key, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotos(prev => ({ ...prev, [key]: url }));
  };

  if (loading) return (
    <section id="overview" className="overview">
      <p className="loading">Loading data...</p>
    </section>
  );

  return (
    <section id="overview" className="overview">
      <div className="overview-top">

      <div className="overview-hero">
        <img src="/pic3.png" alt="hero" className="mini-photo" />
        <div className="mini-overlay" style={{ justifyContent: 'space-between', padding: '32px' }}>
            <div>
            <div className="section-tag">
                <div className="tag-line"></div>
                <span>Mercedes AMG F1 · 2024</span>
            </div>
            <h2 className="overview-title">Constructor Overview</h2>
            </div>
            <div className="overview-hero-stats">
            <div className="hero-stat">
                <span className="hero-stat-val">P{constructorStanding?.position ?? '—'}</span>
                <span className="hero-stat-label">Standing</span>
            </div>
            <div className="hero-stat">
                <span className="hero-stat-val">{constructorStanding?.points ?? '—'}</span>
                <span className="hero-stat-label">Points</span>
            </div>
            <div className="hero-stat">
                <span className="hero-stat-val">{constructorStanding?.wins ?? '—'}</span>
                <span className="hero-stat-label">Wins</span>
            </div>
            </div>
        </div>
    </div>

        <div className="overview-mini">
        <img src="/pic1.jpg" alt="titles" className="mini-photo" />
        <div className="mini-overlay">
            <div className="mini-stat-val">8×</div>
            <div className="mini-stat-label">Constructors' Titles</div>
        </div>
        </div>

        <div className="overview-mini">
        <img src="/pic2.jpg" alt="races" className="mini-photo" />
        <div className="mini-overlay">
            <div className="mini-stat-val">24</div>
            <div className="mini-stat-label">Races in Season</div>
        </div>
        </div>

      </div>

      <div className="overview-drivers">
        {driverStandings.map((d) => {
          const driverId = d.Driver?.driverId;
          return (
            <div key={driverId} className="driver-card">
              <div className="driver-accent"></div>
              <div className="driver-content">
                <div className="driver-name">{d.Driver?.givenName} {d.Driver?.familyName}</div>
                <div className="driver-nat">{d.Driver?.nationality} · #{d.Driver?.permanentNumber}</div>
                <div className="driver-pill">
                  <span className="driver-pos">P{d.position}</span>
                  <span className="driver-pts">{d.points} pts</span>
                </div>
              </div>
              <div className="driver-bg-num">{d.Driver?.permanentNumber}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Overview;