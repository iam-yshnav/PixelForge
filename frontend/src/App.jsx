import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './ThemeContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('jwt') || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) localStorage.setItem('jwt', token);
    else localStorage.removeItem('jwt');
  }, [token]);

  useEffect(() => {
    async function verify() {
      if (!token) { setUser(null); return; }
      try {
        const res = await fetch('/api/v1/verify', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setToken(null);
          setUser(null);
        }
      } catch {
        setToken(null);
        setUser(null);
      }
    }
    verify();
  }, [token]);

  if (!token) {
    return (
      <ThemeProvider>
        <Login onLogin={(t) => setToken(t)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Dashboard token={token} onLogout={() => setToken(null)} user={user} />
    </ThemeProvider>
  );
}

export default App;
