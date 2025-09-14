import React, { useContext, useState } from 'react';
import { apiPost } from '../api';
import { ThemeContext } from '../ThemeContext';

export default function Login({ onLogin }) {
  const { theme, toggle } = useContext(ThemeContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await apiPost('/login', { username, password });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.msg || "Login failed");
      } else {
        onLogin(data.access_token);
      }
    } catch (e) {
      setErr('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20}}>
      <div style={{maxWidth:420, width:'100%'}}>
        <div className="card" style={{marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <h2 style={{margin:0}}>Women Empowerment</h2>
            <small className="small-muted">Dashboard — Stand against violence. Support, empower, respect.</small>
          </div>
          <div>
            <button className="btn" type="button" onClick={toggle}>{theme==='light' ? 'Dark' : 'Light'}</button>
          </div>
        </div>

        <div className="card">
          <form onSubmit={submit}>
            <label>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} style={{marginTop:8, padding:10, borderRadius:8, width:'100%'}} />
            <label style={{marginTop:12}}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{marginTop:8, padding:10, borderRadius:8, width:'100%'}} />
            {err && <div style={{color:'crimson', marginTop:8}}>{err}</div>}
            <button className="btn" type="submit" disabled={loading} style={{marginTop:12}}>{loading ? 'Signing...' : 'Sign in'}</button>
          </form>

          <div style={{marginTop:12, color:'var(--muted)', fontSize:13}}>
            <div>Test accounts: <b>alice / password123</b> or <b>bob / hunter2</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}
