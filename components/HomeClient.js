'use client';
// components/HomeClient.js

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeClient({ members, gallery }) {
  const router = useRouter();
  const [introVisible, setIntroVisible] = useState(true);
  const [navVisible, setNavVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const trackRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    document.body.classList.add('no-scroll');
    window.scrollTo(0, 0);
    const timer1 = setTimeout(() => {
      document.getElementById('intro')?.classList.add('slide-up');
      setTimeout(() => {
        setIntroVisible(false);
        document.body.classList.remove('no-scroll');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 900);
    }, 3000);
    return () => clearTimeout(timer1);
  }, []);

  useEffect(() => {
    const handleScroll = () => setNavVisible(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { updateGallery(); }, [galleryIndex, gallery]);

  function updateGallery() {
    const track = trackRef.current;
    const items = itemRefs.current;
    if (!track || !items.length) return;
    const container = track.parentElement;
    const containerWidth = container.offsetWidth;
    const activeItem = items[galleryIndex];
    if (!activeItem) return;
    let totalOffset = 0;
    for (let i = 0; i < galleryIndex; i++) {
      totalOffset += (items[i]?.offsetWidth || 0) + 16;
    }
    const activeCenter = totalOffset + activeItem.offsetWidth / 2;
    const translateX = activeCenter - containerWidth / 2;
    track.style.transform = `translateX(${-translateX}px)`;
  }

  function nextSlide() { setGalleryIndex(i => (i + 1) % gallery.length); }
  function prevSlide() { setGalleryIndex(i => (i - 1 + gallery.length) % gallery.length); }

  useEffect(() => {
    if (!autoPlay || !gallery.length) return;
    const interval = setInterval(() => {
      setGalleryIndex(i => (i + 1) % gallery.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [autoPlay, gallery.length]);

  function handleLogoClick() {
    setClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) { router.push('/admin'); return 0; }
      return next;
    });
  }

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    function revealOnScroll() {
      const wh = window.innerHeight;
      reveals.forEach(el => {
        if (el.getBoundingClientRect().top < wh - 80) el.classList.add('active');
        else el.classList.remove('active');
      });
    }
    window.addEventListener('scroll', revealOnScroll);
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  return (
    <>
      {introVisible && (
        <div id="intro">
          <img src="/logo/logo-tanpa-bg.png" className="intro-logo" alt="Logo" />
          <div className="intro-line" />
          <div className="intro-title">Royal Kingdom</div>
        </div>
      )}

      <div id="main">
        <nav className={`navbar ${navVisible ? 'show' : ''}`}>
          <img src="/logo/logo-tanpa-bg.png" className="nav-logo" alt="Logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }} />
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? '✕' : '☰'}
          </button>
          <ul className={`nav-menu ${menuOpen ? 'open' : ''}`}>
            <li><a href="#" onClick={() => setMenuOpen(false)}>Home</a></li>
            <li><a href="#galery" onClick={() => setMenuOpen(false)}>Gallery</a></li>
            <li><a href="#keluarga" onClick={() => setMenuOpen(false)}>Family</a></li>
            <li><a href="#musik" onClick={() => setMenuOpen(false)}>Playlist</a></li>
          </ul>
        </nav>

        <section className="hero-bg">
          <div className="hero-content">
            <p className="hero-eyebrow reveal">Est. 2024</p>
            <div className="hero-divider reveal" />
            <h1 className="reveal">Royal <span>Kingdom</span></h1>
            <div className="hero-divider reveal" />
            <p className="hero-tagline reveal">8 Souls · 1 Kingdom · Forever</p>
          </div>
        </section>

        <section className="gallery-section" id="galery">
          <div className="gallery-header">
            <p className="section-label reveal">Memories</p>
            <h2 className="section-title reveal">Gallery</h2>
            <p className="section-sub reveal">Every picture tells a story, captured in time.</p>
          </div>
          <div className="gallery-container">
            <button className="nav-btn left" onClick={() => { prevSlide(); setAutoPlay(false); }} onMouseEnter={() => setAutoPlay(false)} onMouseLeave={() => setAutoPlay(true)}>‹</button>
            <div className="gallery-track" ref={trackRef}>
              {gallery.map((item, i) => (
                <div key={item.id} className={`gallery-item ${i === galleryIndex ? 'active' : ''}`} ref={el => (itemRefs.current[i] = el)} onClick={() => { setGalleryIndex(i); setAutoPlay(false); setTimeout(() => setAutoPlay(true), 5000); }}>
                  <img src={item.imageUrl} alt={item.caption || `Gallery ${i + 1}`} />
                </div>
              ))}
            </div>
            <button className="nav-btn right" onClick={() => { nextSlide(); setAutoPlay(false); }} onMouseEnter={() => setAutoPlay(false)} onMouseLeave={() => setAutoPlay(true)}>›</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
            {gallery.map((_, i) => (
              <div key={i} onClick={() => { setGalleryIndex(i); setAutoPlay(false); setTimeout(() => setAutoPlay(true), 5000); }} style={{ width: i === galleryIndex ? '20px' : '6px', height: '6px', borderRadius: '3px', background: i === galleryIndex ? '#d4a843' : 'rgba(212,168,67,0.3)', cursor: 'pointer', transition: 'all 0.4s ease' }} />
            ))}
          </div>
        </section>

        <section className="family-section" id="keluarga">
          <div className="family-header">
            <p className="section-label reveal">The Members</p>
            <h2 className="section-title reveal">Our Family</h2>
            <p className="section-sub reveal">Watch the live perspectives of every Kingdom member.</p>
          </div>
          <div className="family-container">
            {members.map((member, i) => (
              <div key={member.id} className={`family-card reveal ${i % 2 === 0 ? 'reveal-left' : 'reveal-right'}`} style={{ transitionDelay: `${(i % 4) * 0.08}s` }}>
                <img src={member.photo} alt={member.name} className="family-card-img" />
                <div className="family-card-body">
                  <h3>{member.name}</h3>
                  <span className="role">{member.role}</span>
                  <div className="btn-group">
                    {member.instagram ? (
                      <a href={`https://www.instagram.com/${member.instagram}`} target="_blank" rel="noopener noreferrer" className="btn-gold">Instagram</a>
                    ) : (
                      <button className="btn-gold" disabled style={{ opacity: 0.3, cursor: 'not-allowed' }}>Instagram</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="music-section" id="musik">
          <div className="music-header">
            <p className="section-label reveal">Listen</p>
            <h2 className="section-title reveal">Our Playlist</h2>
            <p className="section-sub reveal">The official Royal Kingdom Spotify vibes.</p>
          </div>
          <div className="spotify-box reveal">
            <iframe style={{ borderRadius: '0', display: 'block' }} src="https://open.spotify.com/embed/playlist/1L0rjfRaHrYftsc6wQvamZ" width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
          </div>
        </section>

        <footer className="footer-gold">
          <img src="/logo/logo-tanpa-bg.png" className="footer-logo" alt="Logo" />
          <p className="footer-title">Royal Kingdom</p>
          <p className="footer-copy">© 2026 Royal Kingdom · All Rights Reserved</p>
        </footer>
      </div>
    </>
  );
}
