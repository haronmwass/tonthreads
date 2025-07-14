import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { tonConnectConfig } from './config/tonConnect';
import Header from './components/Header';
import ConnectionStatus from './components/ConnectionStatus';
import Home from './pages/Home';
import Demo from './pages/Demo';

function App() {
  return (
    <TonConnectUIProvider manifestUrl={tonConnectConfig.manifestUrl}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/demo" element={<Demo />} />
            </Routes>
          </main>
          <ConnectionStatus />
        </div>
      </Router>
    </TonConnectUIProvider>
  );
}

export default App;