// ================= INTRO CINEMATIC =================
let track;
let items;
let index = 0;

window.addEventListener('load', () => {

  const intro = document.getElementById('intro');
  const main = document.getElementById('main');

  // 🔒 LOCK SCROLL SAAT INTRO
  document.body.classList.add('no-scroll');

  // ⬆️ PAKSA MULAI DARI HERO (ATAS)
  window.scrollTo(0, 0);

  setTimeout(() => {

    if (intro) intro.classList.add('slide-up');

    setTimeout(() => {
      if (intro) intro.style.display = 'none';
      if (main) main.style.display = 'block';

      // 🔓 BALIKIN SCROLL
      document.body.classList.remove('no-scroll');

      // 🔥 ANTI LOMPAT KE PLAYLIST
      window.scrollTo({
        top: 0,
        behavior: "instant"
      });

    }, 1000);

  }, 3200);

  // ================= INIT GALLERY =================
  track = document.getElementById('galleryTrack');
  items = document.querySelectorAll('.gallery-item');

  if (track) {
    track.style.willChange = 'transform';
  }

  setTimeout(updateGallery, 100);
});


// ================= TOGGLE BAHASA =================
document.querySelectorAll(".lang").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".lang").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  };
});


// ================= NAVBAR SCROLL =================
const navbar = document.querySelector(".navbar");

window.addEventListener('scroll', () => {
  if (!navbar) return;

  if (window.scrollY > 50) {
    navbar.classList.add('show');
  } else {
    navbar.classList.remove('show');
  }
});


// ================= GALLERY =================
function updateGallery() {
  if (!track || !items.length) return;

  const container = document.querySelector('.gallery-container');
  const containerWidth = container.offsetWidth;

  const activeItem = items[index];

  let totalOffset = 0;
  for (let i = 0; i < index; i++) {
    totalOffset += items[i].offsetWidth + 20;
  }

  const activeCenter = totalOffset + activeItem.offsetWidth / 2;
  const translateX = activeCenter - containerWidth / 2;

  track.style.transition = 'transform 0.6s ease';
  track.style.transform = `translateX(${-translateX}px)`;

  items.forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
}

// NEXT
function nextSlide() {
  if (!items) return;
  index = (index + 1) % items.length;
  updateGallery();
}

// PREV
function prevSlide() {
  if (!items) return;
  index = (index - 1 + items.length) % items.length;
  updateGallery();
}

window.addEventListener('resize', updateGallery);


// ================= SCROLL ANIMATION =================
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  reveals.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - 100) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);