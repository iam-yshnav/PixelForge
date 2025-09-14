import React, { useContext, useState } from 'react';
import Gallery from './Gallery';
import AnnotationsHistory from './AnnotationsHistory';
import { ThemeContext } from '../ThemeContext';

export default function Dashboard({ token, onLogout, user }) {
  const { theme, toggle } = useContext(ThemeContext);
  const [tab, setTab] = useState('gallery');

  return (
    <div className="app-shell">
      <div className="header">
        <div className="brand">
          <div style={{width:44, height:44, borderRadius:10, background:'linear-gradient(135deg,var(--accent),var(--accent-2))'}}></div>
          <div>
            <h1 style={{margin:0}}>HackP-Task Dashboard</h1>
            <small className="small-muted">Welcome, {user || 'user'}</small>
          </div>
        </div>

        <div style={{display:'flex', gap:8}}>
          <button className="btn ghost" onClick={toggle}>{theme==='light' ? 'Dark' : 'Light'}</button>
          <button className="btn" style={{background:'var(--danger)'}} onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <button className="btn" style={{background: tab==='gallery' ? 'var(--accent)' : 'var(--card)', color: tab==='gallery' ? 'white' : 'var(--text)'}} onClick={()=>setTab('gallery')}>Gallery</button>
        <button className="btn" style={{background: tab==='history' ? 'var(--accent)' : 'var(--card)', color: tab==='history' ? 'white' : 'var(--text)'}} onClick={()=>setTab('history')}>Reports</button>
      </div>

      {tab==='gallery' && <Gallery token={token} />}
      {tab==='history' && <AnnotationsHistory token={token} />}
    </div>
  );
}
