'use client';
// components/admin/MemberManager.js

import { useState, useEffect } from 'react';

const emptyForm = { name: '', role: '', instagram: '', photo: '', order: 0 };

export default function MemberManager() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchMembers(); }, []);

  async function fetchMembers() {
    setLoading(true);
    const res = await fetch('/api/members');
    const data = await res.json();
    setMembers(data);
    setLoading(false);
  }

  function openAdd() {
    setEditTarget(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(member) {
    setEditTarget(member.id);
    setForm({
      name: member.name,
      role: member.role,
      instagram: member.instagram || '',
      photo: member.photo,
      order: member.order,
    });
    setShowForm(true);
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (res.ok) setForm(f => ({ ...f, photo: data.url }));
    else alert('Upload gagal: ' + data.error);
    setUploading(false);
  }

  async function handleSave() {
    if (!form.name || !form.role || !form.photo) {
      return setMsg('❌ Nama, role, dan foto wajib diisi');
    }
    setSaving(true);
    const url = editTarget ? `/api/members/${editTarget}` : '/api/members';
    const method = editTarget ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, order: Number(form.order) }),
    });

    if (res.ok) {
      setMsg(editTarget ? '✅ Member berhasil diupdate!' : '✅ Member berhasil ditambahkan!');
      setShowForm(false);
      fetchMembers();
    } else {
      const d = await res.json();
      setMsg('❌ ' + d.error);
    }
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  }

  async function handleDelete(id, name) {
    if (!confirm(`Hapus member "${name}"?`)) return;
    const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
    if (res.ok) { setMsg('✅ Member dihapus'); fetchMembers(); }
    else setMsg('❌ Gagal hapus member');
    setTimeout(() => setMsg(''), 3000);
  }

  const s = styles;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: 'gold', margin: 0, letterSpacing: '2px', fontSize: '18px' }}>👥 FAMILY MEMBERS</h2>
        <button onClick={openAdd} style={s.btnGold}>+ Tambah Member</button>
      </div>

      {msg && <div style={{ ...s.alert, background: msg.startsWith('✅') ? '#1a3a1a' : '#3a1a1a', borderColor: msg.startsWith('✅') ? '#2d5a2d' : '#5a2d2d' }}>{msg}</div>}

      {/* Form Modal */}
      {showForm && (
        <div style={s.modal}>
          <div style={s.modalBox}>
            <h3 style={{ color: 'gold', marginTop: 0 }}>{editTarget ? 'Edit Member' : 'Tambah Member'}</h3>

            <div style={s.formGrid}>
              <div style={s.field}>
                <label style={s.label}>Nama *</label>
                <input style={s.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nama member" />
              </div>
              <div style={s.field}>
                <label style={s.label}>Role *</label>
                <input style={s.input} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Jabatan di kerajaan" />
              </div>
              <div style={s.field}>
                <label style={s.label}>Instagram</label>
                <input style={s.input} value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} placeholder="username (tanpa @)" />
              </div>
              <div style={s.field}>
                <label style={s.label}>Urutan</label>
                <input style={s.input} type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} />
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Foto *</label>
              <input type="file" accept="image/*" onChange={handleUpload} style={{ color: '#aaa', fontSize: '13px' }} />
              {uploading && <span style={{ color: 'gold', fontSize: '12px' }}>Uploading...</span>}
              {form.photo && (
                <img src={form.photo} alt="preview" style={{ width: '100px', height: '130px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px', border: '1px solid #333' }} />
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={handleSave} disabled={saving || uploading} style={s.btnGold}>
                {saving ? 'Menyimpan...' : editTarget ? 'Update' : 'Simpan'}
              </button>
              <button onClick={() => setShowForm(false)} style={s.btnOutline}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>Loading...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {members.map(m => (
            <div key={m.id} style={s.card}>
              <img src={m.photo} alt={m.name} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '8px' }} />
              <h3 style={{ margin: '10px 0 4px', fontSize: '16px' }}>{m.name}</h3>
              <span style={{ color: 'gold', fontSize: '11px', letterSpacing: '1px' }}>{m.role}</span>
              {m.instagram && <p style={{ color: '#666', fontSize: '12px', margin: '4px 0 0' }}>@{m.instagram}</p>}
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button onClick={() => openEdit(m)} style={{ ...s.btnSmall, background: '#2a2a00', color: 'gold', border: '1px solid #4a4a00' }}>Edit</button>
                <button onClick={() => handleDelete(m.id, m.name)} style={{ ...s.btnSmall, background: '#2a0000', color: '#ff6b6b', border: '1px solid #4a0000' }}>Hapus</button>
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
  btnOutline: {
    background: 'transparent', color: '#aaa', border: '1px solid #333',
    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
  },
  btnSmall: {
    padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
  },
  alert: {
    padding: '12px 16px', borderRadius: '8px', border: '1px solid',
    marginBottom: '20px', fontSize: '13px',
  },
  modal: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999,
  },
  modalBox: {
    background: '#111', borderRadius: '16px', padding: '32px',
    width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto',
    border: '1px solid #2a2a2a',
  },
  formGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '4px' },
  label: { color: '#aaa', fontSize: '12px', letterSpacing: '1px' },
  input: {
    background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px',
    color: 'white', padding: '10px 12px', fontSize: '13px', outline: 'none',
  },
  card: {
    background: '#111', borderRadius: '12px', padding: '16px',
    border: '1px solid #1a1a1a', transition: '0.2s',
  },
};
