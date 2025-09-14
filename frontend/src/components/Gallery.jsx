import React, { useEffect, useState } from 'react';
import { apiGet } from '../api';
import ImageModal from './ImageModal';

function Thumb({ item, onClick }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="thumb" role="button" onClick={() => onClick(item)}>
      {!loaded && <div className="placeholder" />}
      <img
        src={item.thumb}
        loading="lazy"
        alt="empowerment"
        style={loaded ? {} : {display:'none'}}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export default function Gallery({ token }) {
  const [images, setImages] = useState([]);
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await apiGet('/gallery', token);
        if (!res.ok) {
          setImages([]);
        } else {
          const data = await res.json();
          if (mounted) setImages(data);
        }
      } catch (e) {
        setImages([]);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [token]);

  return (
    <div>
      {loading && <div style={{padding:12}}>Loading gallery...</div>}
      <div className="gallery-grid" style={{marginTop:12}}>
        {images.map(img => (
          <Thumb key={img.id} item={img} onClick={setSel} />
        ))}
      </div>

      {sel && <ImageModal image={sel} onClose={() => setSel(null)} token={token} />}
    </div>
  );
}
