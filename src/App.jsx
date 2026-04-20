import Navbar from "./components/Navbar/Navbar";
import Overview from "./components/Overview/Overview";
import Results from "./components/Results/Results";
import Charts from "./components/Charts/Charts";
import Drivers from "./components/Drivers/Drivers";

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
        <Results />
        <Drivers />
        <Charts />
      </div>
    </div>
  );
}