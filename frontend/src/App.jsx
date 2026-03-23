import { useState, useEffect } from 'react';
import { api } from './utils/api';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test backend connection
    api.test()
      .then(res => {
        setMessage(res.data.message);
        setLoading(false);
      })
      .catch(err => {
        console.error('Backend connection failed:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <h1>AI MarketLink</h1>
      {loading ? (
        <p>Connecting to backend...</p>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}

export default App;