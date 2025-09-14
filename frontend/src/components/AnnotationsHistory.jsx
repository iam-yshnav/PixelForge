import React, { useEffect, useState } from 'react';
import { apiGet } from '../api';

export default function AnnotationsHistory({ token }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await apiGet('/annotations', token);
        if (res.ok) {
          const json = await res.json();
          setData(json.reverse());
        } else {
          setData([]);
        }
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  return (
    <div style={{marginTop:16}}>
      <h4>Saved Reports</h4>
      {loading && <div>Loading...</div>}
      {!loading && data.length === 0 && <div>No reports yet.</div>}
      <div className="history-list">
        {data.map(ann => (
          <div key={ann.id} className="history-item">
            <img src={ann.imageId ? (ann.imageId.replace('we-','') && `https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=60&auto=format&fit=crop`) : ''} alt="preview"/>
            <div>
              <div><b>Image:</b> {ann.imageId}</div>
              <div><b>Label:</b> {ann.label}</div>
              <div><b>User:</b> {ann.user}</div>
              <div className="small-muted">{new Date(ann.ts*1000).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
