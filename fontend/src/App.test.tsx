import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function TestHome() {
  return <div style={{padding: '50px', fontSize: '24px'}}>
    <h1>HOME PAGE WORKS!</h1>
    <p>If you see this, React is working fine.</p>
  </div>;
}

function TestApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestHome />} />
      </Routes>
    </Router>
  );
}

export default TestApp;
