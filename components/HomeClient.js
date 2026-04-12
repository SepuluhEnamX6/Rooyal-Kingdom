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
  const trackRef = useRef(null);
  const itemRefs = useRef([]);

  // ===== INTRO =====
  useEffect(() => {
    document.body.classList.add('no-scroll');
    window.scrollTo(0, 0);

    const timer1 = setTimeout(() => {
      document.getElementById('intro')?.classList.add('slide-up');
      setTimeout(() => {
        setIntroVisible(false);
        document.body.classList.remove('no-scroll');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 1000);
    }, 3200);

    return () => clearTimeout(timer1);
  }, []);

  // ===== NAVBAR SCROLL =====
  useEffect(() => {
    const handleScroll = () => setNavVisible(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ===== GALLERY =====
  useEffect(() => {
    updateGallery();
  }, [galleryIndex, gallery]);

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
      totalOffset += (items[i]?.offsetWidth || 0) + 20;
    }

    const activeCenter = totalOffset + activeItem.offsetWidth / 2;
    const translateX = activeCenter - containerWidth / 2;
    track.style.transform = `translateX(${-translateX}px)`;
  }

  function nextSlide() { setGalleryIndex(i => (i + 1) % gallery.length); }
  function prevSlide() { setGalleryIndex(i => (i - 1 + gallery.length) % gallery.length); }

  // ===== KLIK LOGO 5X → ADMIN =====
  function handleLogoClick() {
    setClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        router.push('/admin');
        return 0;
      }
      return next;
    });
  }

  // ===== SCROLL REVEAL =====
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    function revealOnScroll() {
      const wh = window.innerHeight;
      reveals.forEach(el => {
        if (el.getBoundingClientRect().top < wh - 100) el.classList.add('active');
        else el.classList.remove('active');
      });
    }
    window.addEventListener('scroll', revealOnScroll);
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  return (
    <>
      {/* ===== INTRO ===== */}
      {introVisible && (
        <div id="intro">
          <img src="/logo/logo-tanpa-bg.png" className="intro-logo" alt="Logo" />
          <div className="intro-title">ROYAL KINGDOM</div>
        </div>
      )}

      <div id="main">
        {/* ===== NAVBAR ===== */}
        <nav className={`navbar ${navVisible ? 'show' : ''}`}>
          <img
            src="/logo/logo-tanpa-bg.png"
            className="nav-logo"
            alt="Logo"
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          />
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)}>☰</button>
          <ul className={`nav-menu ${menuOpen ? 'open' : ''}`}>
            <li><a href="#" onClick={() => setMenuOpen(false)}>Home</a></li>
            <li><a href="#galery" onClick={() => setMenuOpen(false)}>Gallery</a></li>
            <li><a href="#keluarga" onClick={() => setMenuOpen(false)}>Family</a></li>
            <li><a href="#musik" onClick={() => setMenuOpen(false)}>Playlist</a></li>
          </ul>
        </nav>

        {/* ===== HERO ===== */}
        <section className="hero-bg">
          <div className="hero-content">
            <h1>ROYAL KINGDOM</h1>
            <p className="reveal">8 Souls, 1 Kingdom 👑</p>
          </div>
        </section>

        {/* ===== GALLERY ===== */}
        <section className="gallery-section" id="galery">
          <h2 className="gallery-title">GALLERY</h2>
          <p className="gallery-sub">"Every picture tells a story, captured in time."</p>
          <div className="gallery-container">
            <button className="nav-btn left" onClick={prevSlide}>←</button>
            <div className="gallery-track" ref={trackRef}>
              {gallery.map((item, i) => (
                <div
                  key={item.id}
                  className={`gallery-item ${i === galleryIndex ? 'active' : ''}`}
                  ref={el => (itemRefs.current[i] = el)}
                  onClick={() => setGalleryIndex(i)}
                >
                  <img src={item.imageUrl} alt={item.caption || `Gallery ${i + 1}`} />
                </div>
              ))}
            </div>
            <button className="nav-btn right" onClick={nextSlide}>→</button>
          </div>
        </section>

        {/* ===== FAMILY ===== */}
        <section className="family-section" id="keluarga">
          <h2 className="family-title reveal">THE FAMILY MEMBERS</h2>
          <p className="family-sub reveal">Watch the live perspectives of every Cougan family member.</p>
          <div className="family-container">
            {members.map((member, i) => (
              <div key={member.id} className={`family-card reveal ${i % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}>
                <img src={member.photo} alt={member.name} />
                <h3>{member.name}</h3>
                <span className="role">{member.role}</span>
                <div className="btn-group">
                  {member.instagram ? (
                    <a
                      href={`https://www.instagram.com/${member.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold"
                    >
                      Instagram
                    </a>
                  ) : (
                    <button className="btn-gold" disabled style={{ opacity: 0.5 }}>Instagram</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== MUSIK ===== */}
        <section className="music-section" id="musik">
          <h2 className="music-title">ROYAL KINGDOM PLAYLIST</h2>
          <p className="music-sub">Listen to our official Spotify vibes</p>
          <div className="spotify-box">
            <iframe
              style={{ borderRadius: '12px' }}
              src="https://open.spotify.com/embed/playlist/1L0rjfRaHrYftsc6wQvamZ"
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="footer-gold text-center">
          <h5>ROYAL KINGDOM</h5>
          <p>© 2026 Royal Kingdom. All Rights Reserved.</p>
        </footer>
      </div>
    </>
  );
}