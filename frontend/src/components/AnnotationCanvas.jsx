import React, { useEffect, useRef, useState } from 'react';

export default function AnnotationCanvas({ imageUrl, onSubmit }) {
  const containerRef = useRef();
  const imgRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [rect, setRect] = useState(null);
  const startRef = useRef(null);
  const [label, setLabel] = useState('');

  function getRelativeCoords(x, y, w, h) {
    const img = imgRef.current;
    if (!img) return null;
    const rectBox = img.getBoundingClientRect();
    const rx = (x - rectBox.left) / rectBox.width;
    const ry = (y - rectBox.top) / rectBox.height;
    const rw = w / rectBox.width;
    const rh = h / rectBox.height;
    return {
      x: Math.max(0, Math.min(1, rx)),
      y: Math.max(0, Math.min(1, ry)),
      width: Math.max(0, Math.min(1, rw)),
      height: Math.max(0, Math.min(1, rh))
    };
  }

  function onDown(e) {
    e.preventDefault();
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    const y = (e.touches ? e.touches[0].clientY : e.clientY);
    startRef.current = { x, y };
    setRect({ x, y, w: 0, h: 0 });
    setDragging(true);
  }
  function onMove(e) {
    if (!dragging) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    const y = (e.touches ? e.touches[0].clientY : e.clientY);
    const sx = startRef.current.x;
    const sy = startRef.current.y;
    const left = Math.min(sx, x);
    const top = Math.min(sy, y);
    const w = Math.abs(x - sx);
    const h = Math.abs(y - sy);
    setRect({ x: left, y: top, w, h });
  }
  function onUp() {
    setDragging(false);
  }

  function submit() {
    if (!rect || !label.trim()) return alert('Please draw a box and enter label');
    const rel = getRelativeCoords(rect.x, rect.y, rect.w, rect.h);
    if (!rel) return alert('Unable to compute coordinates');
    onSubmit(rel, label.trim());
    setLabel('');
    setRect(null);
  }

  useEffect(() => {
    const cont = containerRef.current;
    if (cont) {
      cont.addEventListener('touchstart', onDown, { passive: false });
      cont.addEventListener('touchmove', onMove, { passive: false });
      cont.addEventListener('touchend', onUp);
    }
    return () => {
      if (cont) {
        cont.removeEventListener('touchstart', onDown);
        cont.removeEventListener('touchmove', onMove);
        cont.removeEventListener('touchend', onUp);
      }
    };
  }, [dragging]);

  return (
    <div>
      <div
        ref={containerRef}
        style={{ position: 'relative', border: '1px solid rgba(0,0,0,0.06)', borderRadius:8, overflow:'hidden' }}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={() => setDragging(false)}
      >
        <img ref={imgRef} src={imageUrl} alt="" style={{display:'block', width:'100%', height:240, objectFit:'cover'}} />
        {rect && imgRef.current && (
          <div
            style={{
              position:'absolute',
              left: rect.x - imgRef.current.getBoundingClientRect().left,
              top: rect.y - imgRef.current.getBoundingClientRect().top,
              width: rect.w,
              height: rect.h,
              border: '2px dashed var(--accent)',
              background: 'rgba(155,93,229,0.08)'
            }}
          />
        )}
      </div>

      <div style={{marginTop:8}}>
        <label>Label</label>
        <input value={label} onChange={e=>setLabel(e.target.value)} placeholder="e.g. 'Harassment', 'Unsafe', 'Support Needed'"/>
        <div style={{display:'flex', gap:8, marginTop:8}}>
          <button className="btn" onClick={submit}>Submit Report</button>
          <button className="btn" onClick={()=>{setRect(null); setLabel('')}} style={{background:'var(--danger)'}}>Clear</button>
        </div>
      </div>
    </div>
  );
}
