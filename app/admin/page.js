'use client';
// app/admin/page.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MemberManager from '@/components/admin/MemberManager';
import GalleryManager from '@/components/admin/GalleryManager';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('members');
  const [checking, setChecking] = useState(true);

  // Cek apakah sudah login
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) router.push('/admin/login');
        else setChecking(false);
      })
      .catch(() => router.push('/admin/login'));
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'gold', letterSpacing: '3px' }}>LOADING...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Georgia, serif', color: 'white' }}>
      {/* Header */}
      <div style={{
        background: '#111',
        borderBottom: '1px solid #2a2a2a',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/logo/logo-tanpa-bg.png" style={{ width: '45px' }} alt="Logo" />
          <div>
            <div style={{ color: 'gold', letterSpacing: '3px', fontSize: '14px', fontWeight: 'bold' }}>ROYAL KINGDOM</div>
            <div style={{ color: '#666', fontSize: '11px' }}>Admin Panel</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/" target="_blank" style={{ color: '#aaa', fontSize: '13px', textDecoration: 'none', padding: '8px 16px', border: '1px solid #333', borderRadius: '8px' }}>
            🌐 Lihat Website
          </a>
          <button onClick={handleLogout} style={{ background: '#1a1a1a', color: '#ff6b6b', border: '1px solid #3a1a1a', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '32px 32px 0' }}>
        <div style={{ display: 'flex', gap: '4px', background: '#111', padding: '4px', borderRadius: '12px', width: 'fit-content', marginBottom: '32px' }}>
          {[
            { key: 'members', label: '👥 Family Members' },
            { key: 'gallery', label: '🖼️ Gallery' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                background: activeTab === tab.key ? 'gold' : 'transparent',
                color: activeTab === tab.key ? 'black' : '#aaa',
                transition: '0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'members' && <MemberManager />}
        {activeTab === 'gallery' && <GalleryManager />}
      </div>
    </div>
  );
}
