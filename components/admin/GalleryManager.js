'use client';
// components/admin/GalleryManager.js

import { useState, useEffect, useRef } from 'react';

export default function GalleryManager() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const [caption, setCaption] = useState('');
  const [order, setOrder] = useState(0);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const fileRef = useRef();

  useEffect(() => { fetchGallery(); }, []);

  async function fetchGallery() {
    setLoading(true);
    const res = await fetch('/api/gallery');
    const data = await res.json();
    setGallery(data);
    setLoading(false);
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (res.ok) setUploadedUrl(data.url);
    else setMsg('❌ Upload gagal: ' + data.error);
    setUploading(false);
  }

  async function handleSave() {
    if (!uploadedUrl) return setMsg('❌ Pilih foto dulu');
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: uploadedUrl, caption, order: Number(order) }),
    });
    if (res.ok) {
      setMsg('✅ Foto berhasil ditambahkan!');
      setPreview(null);
      setUploadedUrl('');
      setCaption('');
      setOrder(0);
      if (fileRef.current) fileRef.current.value = '';
      fetchGallery();
    } else {
      const d = await res.json();
      setMsg('❌ ' + d.error);
    }
    setTimeout(() => setMsg(''), 3000);
  }

  async function handleDelete(id) {
    if (!confirm('Hapus foto ini?')) return;
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    if (res.ok) { setMsg('✅ Foto dihapus'); fetchGallery(); }
    else setMsg('❌ Gagal hapus foto');
    setTimeout(() => setMsg(''), 3000);
  }

  const s = styles;

  return (
    <div style={{ paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: 'gold', margin: 0, letterSpacing: '2px', fontSize: '18px' }}>🖼️ GALLERY</h2>
        <span style={{ color: '#666', fontSize: '13px' }}>{gallery.length} foto</span>
      </div>

      {msg && (
        <div style={{ ...s.alert, background: msg.startsWith('✅') ? '#1a3a1a' : '#3a1a1a', borderColor: msg.startsWith('✅') ? '#2d5a2d' : '#5a2d2d' }}>
          {msg}
        </div>
      )}

      {/* Upload Area */}
      <div style={{ background: '#111', borderRadius: '16px', padding: '24px', marginBottom: '32px', border: '1px solid #2a2a2a' }}>
        <h3 style={{ color: '#aaa', fontSize: '13px', letterSpacing: '2px', marginTop: 0 }}>UPLOAD FOTO BARU</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: preview ? '200px 1fr' : '1fr', gap: '24px', alignItems: 'start' }}>
          <div>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: '2px dashed #333',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: '0.2s',
                background: '#0a0a0a',
              }}
            >
              {uploading ? (
                <p style={{ color: 'gold', margin: 0 }}>Uploading...</p>
              ) : (
                <>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📸</div>
                  <p style={{ color: '#666', margin: 0, fontSize: '13px' }}>Klik untuk pilih foto</p>
                  <p style={{ color: '#444', margin: '4px 0 0', fontSize: '11px' }}>JPG, PNG, WEBP · Max 5MB</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>

          {preview && (
            <div>
              <img src={preview} alt="preview" style={{ width: '180px', height: '220px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #333', display: 'block', marginBottom: '16px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={s.label}>Caption</label>
                  <input style={s.input} value={caption} onChange={e => setCaption(e.target.value)} placeholder="Deskripsi foto (opsional)" />
                </div>
                <div>
                  <label style={s.label}>Urutan</label>
                  <input style={{ ...s.input, width: '100px' }} type="number" value={order} onChange={e => setOrder(e.target.value)} />
                </div>
                <button onClick={handleSave} disabled={uploading || !uploadedUrl} style={{ ...s.btnGold, alignSelf: 'flex-start' }}>
                  {uploading ? 'Uploading...' : '+ Simpan ke Gallery'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>Loading...</p>
      ) : gallery.length === 0 ? (
        <p style={{ color: '#444', textAlign: 'center', padding: '60px' }}>Belum ada foto di gallery</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
          {gallery.map(item => (
            <div key={item.id} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid #1a1a1a', background: '#111' }}>
              <img
                src={item.imageUrl}
                alt={item.caption || ''}
                style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '10px 12px' }}>
                {item.caption && <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 8px' }}>{item.caption}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#444', fontSize: '11px' }}>#{item.order}</span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ background: '#2a0000', color: '#ff6b6b', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  btnGold: {
    background: 'gold', color: 'black', border: 'none',
    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
    fontWeight: 'bold', fontSize: '13px',
  },
  alert: {
    padding: '12px 16px', borderRadius: '8px', border: '1px solid',
    marginBottom: '20px', fontSize: '13px',
  },
  label: { color: '#aaa', fontSize: '12px', letterSpacing: '1px', display: 'block', marginBottom: '6px' },
  input: {
    background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px',
    color: 'white', padding: '10px 12px', fontSize: '13px', outline: 'none', width: '100%',
  },
};
