import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, ReferenceLine } from 'recharts';
import './Charts.css';

const Charts = () => {
  const [pointsData, setPointsData] = useState([]);
  const [raceData, setRaceData] = useState([]);
  const [bestRace, setBestRace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://api.jolpi.ca/ergast/f1/2024/constructors/mercedes/results/?limit=100');
        const data = await res.json();
        const races = data?.MRData?.RaceTable?.Races ?? [];

        const raceMap = {};
        races.forEach(race => {
          const name = race.raceName.replace(' Grand Prix', '').replace('Grand Prix', '').trim();
          if (!raceMap[name]) raceMap[name] = { race: name, fullName: race.raceName, date: race.date, Russell: 0, Hamilton: 0, RussellPos: null, HamiltonPos: null };
          race.Results?.forEach(r => {
            const pts = parseFloat(r.points) || 0;
            const pos = parseInt(r.position);
            if (r.Driver?.driverId?.includes('russell')) {
              raceMap[name].Russell = pts;
              raceMap[name].RussellPos = pos;
            }
            if (r.Driver?.driverId?.includes('hamilton')) {
              raceMap[name].Hamilton = pts;
              raceMap[name].HamiltonPos = pos;
            }
          });
        });

        const raceArr = Object.values(raceMap);

        let russellTotal = 0;
        let hamiltonTotal = 0;
        let best = null;
        const cumulative = raceArr.map(r => {
          russellTotal += r.Russell;
          hamiltonTotal += r.Hamilton;
          const total = r.Russell + r.Hamilton;
          if (!best || total > best.total) best = { race: r.race, total };
          return { race: r.race, Russell: russellTotal, Hamilton: hamiltonTotal, Total: russellTotal + hamiltonTotal };
        });

        setPointsData(cumulative);
        setRaceData(raceArr);
        setBestRace(best);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label} Grand Prix</p>
          {payload.map((p, i) => (
            <p key={i} className={`tooltip-item ${p.name === 'Russell' ? 'tooltip-russell' : p.name === 'Hamilton' ? 'tooltip-hamilton' : 'tooltip-total'}`}>
              {p.name}: <strong>{p.value} pts</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const RaceTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const r = raceData.find(d => d.race === label);
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label} Grand Prix</p>
          {payload.map((p, i) => {
            const pos = p.name === 'Russell' ? r?.RussellPos : r?.HamiltonPos;
            return (
              <p key={i} className={`tooltip-item ${p.name === 'Russell' ? 'tooltip-russell' : 'tooltip-hamilton'}`}>
                {p.name}: <strong>{p.value} pts</strong> {pos ? `(P${pos})` : ''}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const wins = raceData.filter(r => r.RussellPos === 1 || r.HamiltonPos === 1).length;
  const podiums = raceData.filter(r => r.RussellPos <= 3 || r.HamiltonPos <= 3).length;
  const russellWins = raceData.filter(r => r.RussellPos === 1).length;
  const hamiltonWins = raceData.filter(r => r.HamiltonPos === 1).length;
  const finalPoints = pointsData[pointsData.length - 1];
  const russellPct = finalPoints ? `${(finalPoints.Russell / finalPoints.Total) * 100}%` : '0%';
  const hamiltonPct = finalPoints ? `${(finalPoints.Hamilton / finalPoints.Total) * 100}%` : '0%';
  const russellWinPct = wins ? `${(russellWins / wins) * 100}%` : '0%';
  const hamiltonWinPct = wins ? `${(hamiltonWins / wins) * 100}%` : '0%';

  if (loading) return (
    <section id="charts" className="charts">
      <p className="loading">Loading charts...</p>
    </section>
  );

  return (
    <section id="charts" className="charts">
      <div className="charts-header">
        <div className="section-tag">
          <span>2024 Season</span>
        </div>
        <h2 className="charts-title">Team Statistics</h2>
      </div>

      <div className="charts-grid">

        <div className="chart-card chart-wide">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Cumulative Points — Season Progress</h3>
            <p className="chart-card-sub">Points accumulated race by race · Dashed line = team total</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pointsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="race" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} tickLine={false} axisLine={false} interval={0} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', paddingTop: '12px' }} />
              <Line type="monotone" dataKey="Russell" stroke="#00d2be" strokeWidth={2} dot={{ r: 3, fill: '#00d2be', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="Hamilton" stroke="#888888" strokeWidth={2} dot={{ r: 3, fill: '#888888', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="Total" stroke="rgba(0,210,190,0.25)" strokeWidth={1} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card chart-wide">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Points Per Race</h3>
            <p className="chart-card-sub">Hover each bar to see finishing position · Max 26 pts per race</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
          <BarChart data={raceData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
                dataKey="race"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
            />
            <YAxis
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 26]}
            />
            <Tooltip
                content={<RaceTooltip />}
                cursor={{ fill: 'rgba(0,210,190,0.05)', stroke: 'rgba(0,210,190,0.2)', strokeWidth: 1 }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', paddingTop: '12px' }} />
            <ReferenceLine
                y={25}
                stroke="rgba(0,210,190,0.15)"
                strokeDasharray="4 4"
                label={{ value: 'Win', fill: 'rgba(0,210,190,0.4)', fontSize: 10 }}
            />
            <Bar dataKey="Russell" fill="#00d2be" opacity={0.85} radius={[2, 2, 0, 0]} activeBar={false} />
            <Bar dataKey="Hamilton" fill="#444444" radius={[2, 2, 0, 0]} activeBar={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Driver Comparison</h3>
            <p className="chart-card-sub">Final season points breakdown</p>
          </div>
          <div className="stats-compare">
            <div className="compare-row">
              <span className="compare-name">George Russell</span>
              <div className="compare-bar-wrap">
                <div className="compare-bar compare-bar-russell" style={{ '--bar-width': russellPct }}></div>
              </div>
              <span className="compare-val">{finalPoints?.Russell}</span>
            </div>
            <div className="compare-row">
              <span className="compare-name">Lewis Hamilton</span>
              <div className="compare-bar-wrap">
                <div className="compare-bar compare-bar-hamilton" style={{ '--bar-width': hamiltonPct }}></div>
              </div>
              <span className="compare-val">{finalPoints?.Hamilton}</span>
            </div>
            <div className="compare-row">
              <span className="compare-name">Russell Wins</span>
              <div className="compare-bar-wrap">
                <div className="compare-bar compare-bar-russell" style={{ '--bar-width': russellWinPct }}></div>
              </div>
              <span className="compare-val">{russellWins}</span>
            </div>
            <div className="compare-row">
              <span className="compare-name">Hamilton Wins</span>
              <div className="compare-bar-wrap">
                <div className="compare-bar compare-bar-hamilton" style={{ '--bar-width': hamiltonWinPct }}></div>
              </div>
              <span className="compare-val">{hamiltonWins}</span>
            </div>
            <div className="compare-total">
              <span>Team Total</span>
              <span className="compare-val teal">{finalPoints?.Total}</span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Season Highlights</h3>
            <p className="chart-card-sub">Key stats from the 2024 campaign</p>
          </div>
          <div className="highlights">
            <div className="highlight-row">
              <span className="highlight-label">Constructor Standing</span>
              <span className="highlight-val teal">P1</span>
            </div>
            <div className="highlight-row">
              <span className="highlight-label">Constructor Points</span>
              <span className="highlight-val teal">{finalPoints?.Total ?? '—'}</span>
            </div>
            <div className="highlight-row">
              <span className="highlight-label">Race Wins</span>
              <span className="highlight-val">{wins}</span>
            </div>
            <div className="highlight-row">
              <span className="highlight-label">Podiums</span>
              <span className="highlight-val">{podiums}</span>
            </div>
            <div className="highlight-row">
              <span className="highlight-label">Best Race (Team pts)</span>
              <span className="highlight-val teal">{bestRace?.race}</span>
            </div>
            <div className="highlight-row">
              <span className="highlight-label">Russell Points</span>
              <span className="highlight-val">{finalPoints?.Russell ?? '—'}</span>
            </div>
            <div className="highlight-row">
              <span className="highlight-label">Hamilton Points</span>
              <span className="highlight-val">{finalPoints?.Hamilton ?? '—'}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Charts;