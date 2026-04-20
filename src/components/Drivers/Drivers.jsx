import React, { useEffect, useState } from 'react';
import './Drivers.css';

const ALL_DRIVERS = [
  { driverId: 'russell', photo: '/pic4.jpg', team: 'Mercedes', color: '#00d2be' },
  { driverId: 'hamilton', photo: '/pic5.jpg', team: 'Mercedes', color: '#00d2be' },
  { driverId: 'leclerc', photo: '/pic6.jpg', team: 'Ferrari', color: '#e8002d' },
  { driverId: 'sainz', photo: '/pic7.jpg', team: 'Ferrari', color: '#e8002d' },
  { driverId: 'max_verstappen', photo: '/pic8.jpg', team: 'Red Bull', color: '#3671C6' },
  { driverId: 'perez', photo: '/pic9.jpg', team: 'Red Bull', color: '#3671C6' },
  { driverId: 'norris', photo: '/pic10.jpg', team: 'McLaren', color: '#FF8000' },
  { driverId: 'piastri', photo: '/pic11.jpg', team: 'McLaren', color: '#FF8000' },
];

const Drivers = () => {
  const [standings, setStandings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [driverStats, setDriverStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const res = await fetch('https://api.jolpi.ca/ergast/f1/2024/driverstandings/');
        const data = await res.json();
        const drivers = data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
        setStandings(drivers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStandings();
  }, []);

  const handleDriverClick = async (driverConfig, standing) => {
    if (selected?.driverId === driverConfig.driverId) {
      setSelected(null);
      setDriverStats(null);
      return;
    }
    setSelected({ ...driverConfig, standing });
    setStatsLoading(true);
    try {
      const res = await fetch(`https://api.jolpi.ca/ergast/f1/2024/drivers/${driverConfig.driverId}/results/?limit=100`);
      const data = await res.json();
      const races = data?.MRData?.RaceTable?.Races ?? [];
      const wins = races.filter(r => r.Results?.[0]?.position === '1').length;
      const podiums = races.filter(r => parseInt(r.Results?.[0]?.position) <= 3).length;
      const dnfs = races.filter(r =>
        r.Results?.[0]?.status !== 'Finished' &&
        !r.Results?.[0]?.status?.includes('Lap')
      ).length;
      const points = races.map(r => ({
        race: r.raceName.replace(' Grand Prix', ''),
        pts: parseFloat(r.Results?.[0]?.points) || 0,
        pos: r.Results?.[0]?.position,
      }));
      setDriverStats({ wins, podiums, dnfs, races: races.length, points });
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  };

  const getStanding = (driverId) => {
    return standings.find(d => d.Driver?.driverId?.includes(driverId));
  };

  if (loading) return (
    <section id="drivers" className="drivers">
      <p className="loading">Loading drivers...</p>
    </section>
  );

  return (
    <section id="drivers" className="drivers">
      <div className="drivers-header">
        <div className="section-tag">
          <span>2024 Season</span>
        </div>
        <h2 className="drivers-title">Drivers</h2>
      </div>

      <div className="panels-wrap">
        {ALL_DRIVERS.map((driverConfig) => {
          const standing = getStanding(driverConfig.driverId);
          const isSelected = selected?.driverId === driverConfig.driverId;

          return (
            <div
              key={driverConfig.driverId}
              className={`driver-panel-card ${isSelected ? 'expanded' : ''}`}
              style={{ '--team-color': driverConfig.color }}
              onClick={() => handleDriverClick(driverConfig, standing)}
            >
              <img src={driverConfig.photo} alt={driverConfig.driverId} className="panel-photo" />
              <div className="panel-overlay" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.3), ${driverConfig.color}55 100%)` }} />
              <div className="panel-top">
                <p className="panel-firstname">{standing?.Driver?.givenName?.toUpperCase()}</p>
                <p className="panel-lastname">{standing?.Driver?.familyName?.toUpperCase()}</p>
                <p className="panel-team">{driverConfig.team}</p>
              </div>
              <div className="panel-bottom">
                <span className="panel-num">#{standing?.Driver?.permanentNumber}</span>
                <span className="panel-pts">{standing?.points} pts</span>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="driver-detail" style={{ '--team-color': selected.color, borderColor: selected.color }}>
          <div className="driver-detail-header">
            <div>
              <div className="driver-detail-num" style={{ color: selected.color }}>
                #{selected.standing?.Driver?.permanentNumber}
              </div>
              <h3 className="driver-detail-name">
                {selected.standing?.Driver?.givenName} {selected.standing?.Driver?.familyName}
              </h3>
              <p className="driver-detail-nat">
                {selected.standing?.Driver?.nationality} · {selected.team} · Born {selected.standing?.Driver?.dateOfBirth}
              </p>
            </div>
            <button className="close-btn" onClick={() => { setSelected(null); setDriverStats(null); }}>✕</button>
          </div>

          {statsLoading ? (
            <p className="loading" style={{ padding: '20px 0' }}>Loading stats...</p>
          ) : driverStats && (
            <>
              <div className="driver-detail-stats">
                <div className="detail-stat">
                  <span className="detail-stat-val" style={{ color: selected.color }}>P{selected.standing?.position}</span>
                  <span className="detail-stat-label">Championship</span>
                </div>
                <div className="detail-stat">
                  <span className="detail-stat-val">{selected.standing?.points}</span>
                  <span className="detail-stat-label">Points</span>
                </div>
                <div className="detail-stat">
                  <span className="detail-stat-val" style={{ color: selected.color }}>{driverStats.wins}</span>
                  <span className="detail-stat-label">Wins</span>
                </div>
                <div className="detail-stat">
                  <span className="detail-stat-val">{driverStats.podiums}</span>
                  <span className="detail-stat-label">Podiums</span>
                </div>
                <div className="detail-stat">
                  <span className="detail-stat-val">{driverStats.races}</span>
                  <span className="detail-stat-label">Races</span>
                </div>
                <div className="detail-stat">
                  <span className="detail-stat-val">{driverStats.dnfs}</span>
                  <span className="detail-stat-label">DNFs</span>
                </div>
              </div>

              <div className="driver-race-list">
                <div className="race-list-header">
                  <span>Race</span>
                  <span>Position</span>
                  <span>Points</span>
                </div>
                {driverStats.points.map((r, i) => (
                  <div key={i} className="race-list-row">
                    <span className="race-list-name">{r.race}</span>
                    <span className="race-list-pos" style={{ color: parseInt(r.pos) <= 3 ? selected.color : 'rgba(255,255,255,0.5)' }}>
                      P{r.pos}
                    </span>
                    <span className="race-list-pts">{r.pts}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default Drivers;