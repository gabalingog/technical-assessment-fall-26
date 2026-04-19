import Navbar from "./components/Navbar/Navbar";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="app-content">
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