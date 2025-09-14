import React, { useState } from 'react';
import AnnotationCanvas from './AnnotationCanvas';
import { apiPost } from '../api';

export default function ImageModal({ image, onClose, token }) {
  const [message, setMessage] = useState(null);

  async function submitAnnotation(coords, label) {
    setMessage("Saving...");
    try {
      const res = await apiPost('/annotate', { imageId: image.id, coords, label }, token);
      if (!res.ok) {
        const d = await res.json();
        setMessage(d.msg || "Save failed");
      } else {
        setMessage("Saved");
        setTimeout(()=>setMessage(null),1200);
      }
    } catch(e) {
      setMessage("Network error");
    }
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="box" onClick={e => e.stopPropagation()}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h3>Preview & Report</h3>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            {message && <div className="small-muted">{message}</div>}
            <button className="btn" style={{background:'var(--danger)'}} onClick={onClose}>Close</button>
          </div>
        </div>

        <div style={{display:'flex', gap:12, marginTop:8}}>
          <div style={{flex:1}}>
            <img src={image.full} alt="full" style={{width:'100%', borderRadius:8, maxHeight:600, objectFit:'cover'}} />
          </div>

          <div style={{width:420, maxWidth:'40%'}}>
            <h4>Report Concern (annotation)</h4>
            <p className="small-muted">Draw a box over the area and add a descriptive label (e.g. "Harassment", "Unsafe", "Support Needed").</p>
            <AnnotationCanvas imageUrl={image.full} onSubmit={submitAnnotation} />
          </div>
        </div>
      </div>
    </div>
  );
}
