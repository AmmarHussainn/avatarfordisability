import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg';

import './App.css';
import InteractiveAvatar from './pages/InteractiveAvatar';
import InteractiveSessions from './pages/InteractiveSessions';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        {/* Default route (home page) */}
        <Route path="/" element={<InteractiveSessions />} />
        
        
        <Route path="/avatar" element={<InteractiveAvatar />} />
        
        
      </Routes>
    </Router>
  );
}

export default App;