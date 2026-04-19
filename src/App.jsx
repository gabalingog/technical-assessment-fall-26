import Navbar from "./components/Navbar/Navbar";
import Overview from "./components/Overview/Overview";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="app-content">
        <section className="video">
          <video autoPlay muted loop playsInline className="video-video">
            <source src="/video.mov" type="video/mp4" />
          </video>
          <div className="video-overlay" />
          <div className="video-text">
            {/* <p className="video-first">Formula 1</p> */}
            <h1 className="video-title">Mercedes</h1>
            <p className="video-tagline">THE BEST OR NOTHING</p>
          </div>
        </section>

        <Overview />

        <section id="overview" className="section">
          <h1>Overview</h1>
        </section>
        <section id="results" className="section">
          <h1>Results</h1>
        </section>
        <section id="drivers" className="section">
          <h1>Drivers</h1>
        </section>
        <section id="charts" className="section">
          <h1>Charts</h1>
        </section>
      </div>
    </div>
  );
}