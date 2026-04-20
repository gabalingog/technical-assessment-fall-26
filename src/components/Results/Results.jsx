import React, { useEffect, useState } from 'react';
import './Results.css';


const Results = () => {
  const [races, setRaces] = useState([]);
  const [driverStandings, setDriverStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [racesRes, standingsRes] = await Promise.all([
          fetch('https://api.jolpi.ca/ergast/f1/2024/constructors/mercedes/results/'),
          fetch('https://api.jolpi.ca/ergast/f1/2024/driverstandings/'),
        ]);
        const racesData = await racesRes.json();
        const standingsData = await standingsRes.json();

        const raceList = racesData?.MRData?.RaceTable?.Races ?? [];
        setRaces(raceList);

        const allDrivers = standingsData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
        const mercedesIds = ['russell', 'hamilton'];
        const mercedesDrivers = allDrivers.filter(d =>
          mercedesIds.some(id => d.Driver?.driverId?.includes(id))
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

  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const topDrivers = driverStandings.slice(0, 2);

  const allResults = races.flatMap(race =>
    (race.Results ?? []).map(result => ({
      race: race.raceName,
      circuit: race.Circuit?.circuitName,
      date: race.date,
      driver: `${result.Driver?.givenName} ${result.Driver?.familyName}`,
      position: result.position,
      points: result.points,
      status: result.status,
      grid: result.grid,
      laps: result.laps,
    }))
  );

  const filtered = allResults.filter(r =>
    r.race?.toLowerCase().includes(search.toLowerCase()) ||
    r.driver?.toLowerCase().includes(search.toLowerCase()) ||
    r.circuit?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  if (loading) return (
    <section id="results" className="results">
      <p className="loading">Loading results...</p>
    </section>
  );

  return (
    <section id="results" className="results">

      <div className="results-header">
        <div className="section-tag">
          <span>2024 Season</span>
        </div>
        <h2 className="results-title">Race Results</h2>
      </div>

      <div className="top-contenders">
        <div className="contenders-label">Top Contenders</div>
        <div className="contenders-grid">
          {topDrivers.map((d, i) => (
            <div key={d.Driver?.driverId} className={`contender-card ${i === 0 ? 'contender-first' : ''}`}>
              <div className="contender-pos">{d.Driver?.permanentNumber}</div>
              <div className="contender-pts">{d.points} pts</div>
              <div className="contender-name">
                {d.Driver?.givenName} {d.Driver?.familyName}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="results-controls">
        <input
            type="text"
            placeholder="Search by race, driver or circuit..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="search-input"
        />
        <div className="rows-select-wrap">
            <label className="rows-label">Rows</label>
            <select className="rows-select" value={rowsPerPage} onChange={handleRowsChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            </select>
        </div>
     </div>

      <div className="results-table-wrap">
        <table className="results-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Race</th>
              <th>Circuit</th>
              <th>Driver</th>
              <th>Grid</th>
              <th>Laps</th>
              <th>Points</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((r, i) => (
              <tr key={i}>
                <td className="pos-cell">P{r.position}</td>
                <td>{r.race}</td>
                <td className="muted">{r.circuit}</td>
                <td className="driver-cell">{r.driver}</td>
                <td className="muted">{r.grid}</td>
                <td className="muted">{r.laps}</td>
                <td className="pts-cell">{r.points}</td>
                <td className={r.status === 'Finished' ? 'status-finished' : 'status-dnf'}>
                  {r.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={() => setPage(1)} disabled={page === 1} className="page-btn">««</button>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="page-btn">‹</button>
        <span className="page-info">Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="page-btn">›</button>
        <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="page-btn">»»</button>
      </div>

    </section>
  );
};

export default Results;