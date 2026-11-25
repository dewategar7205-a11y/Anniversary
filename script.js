/* ============================================================
   ANNIVERSARY SCRAPBOOK – script.js
   Dewa Tegar Febriyansah & Risma Damayanti – 4 Tahun 💕
   ============================================================ */

'use strict';

// ---- STATE ----
let currentPage = 0;
let totalPages = 6;
let isAnimating = false;
let surpriseDone = false;
let petalInterval;

// ---- DOM REFS ----
const pages = document.querySelectorAll('.page');
const musicBtn = document.getElementById('music-btn');
const musicAudio = document.getElementById('background-music');
const petalsContainer = document.getElementById('petals-container');
const particlesContainer = document.getElementById('particles-container');
const confettiContainer = document.getElementById('confetti-container');
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  startPetals();
  initPhotoClick();
  initAmbientInteraction();
  updateDaysTogether();
  initLocalMusic();
  document.getElementById('envelope')?.addEventListener('click', openLetter);
  setTimeout(() => {
    animatePage0Entrance();
  }, 300);
});

// ---- PAGE NAVIGATION ----
function goToPage(targetPage) {
  if (isAnimating || targetPage === currentPage) return;
  if (targetPage < 0 || targetPage >= totalPages) return;

  isAnimating = true;
  const currentEl = pages[currentPage];
  const targetEl = pages[targetPage];
  const goingForward = targetPage > currentPage;

  // Add exit class to current
  currentEl.classList.add(goingForward ? 'exit-left' : 'exit-right');
  currentEl.classList.remove('active');

  // Small delay then show target
  setTimeout(() => {
    currentEl.classList.remove('exit-left', 'exit-right');
    targetEl.classList.add('active');

    // Scroll target's inner to top
    const inner = targetEl.querySelector('.page-inner');
    if (inner) inner.scrollTop = 0;

    // Update current page
    currentPage = targetPage;

    // Page-specific actions
    if (targetPage === 5) {
      setTimeout(() => triggerEntryConfetti(), 500);
    }

    setTimeout(() => {
      isAnimating = false;
    }, 750);
  }, 400);

  // Update dots
  updateDots(targetPage);
}

function updateDots(pageIndex) {
  document.querySelectorAll('.dot').forEach((dot, i) => {
    const dotPage = parseInt(dot.getAttribute('onclick')?.match(/\d/)?.[0] ?? i);
    dot.classList.toggle('active', dotPage === pageIndex);
  });
}

// ---- OPEN LETTER ANIMATION ----
function openLetter() {
  const envelope = document.getElementById('envelope');
  const openBtn = document.getElementById('open-letter-btn');

  if (!envelope || envelope.classList.contains('open')) {
    goToPage(1);
    return;
  }

  envelope.classList.add('open');
  openBtn.textContent = '📖 Buka Buku Kenangan...';
  openBtn.style.opacity = '0.7';

  setTimeout(() => {
    openBtn.style.opacity = '1';
    openBtn.onclick = () => goToPage(1);
    openBtn.innerHTML = '<span class="btn-icon">📖</span><span class="btn-text">Buka Buku Kenangan</span>';
    // Pulse harder
    openBtn.classList.add('pulse-btn');
  }, 1200);
}

// ---- ANIMATE PAGE 0 ENTRANCE ----
function animatePage0Entrance() {
  const coverHint = document.querySelector('.cover-hint');
  if (coverHint) {
    coverHint.style.opacity = '0';
    coverHint.style.transform = 'translateY(10px)';
    setTimeout(() => {
      coverHint.style.transition = 'opacity 1s ease, transform 1s ease';
      coverHint.style.opacity = '1';
      coverHint.style.transform = 'translateY(0)';
    }, 800);
  }
}

function initAmbientInteraction() {
  document.addEventListener('pointerdown', (event) => {
    if (!(event.target instanceof Element) || event.target.closest('button, a, img, video, .polaroid-item, .lightbox')) return;

    const sparkle = document.createElement('span');
    sparkle.className = 'love-sparkle';
    sparkle.textContent = Math.random() > 0.5 ? '♡' : '✦';
    sparkle.style.left = `${event.clientX}px`;
    sparkle.style.top = `${event.clientY}px`;
    document.body.appendChild(sparkle);
    sparkle.addEventListener('animationend', () => sparkle.remove(), { once: true });
  });
}

// ---- PARTICLES (HEARTS + STARS) ----
function initParticles() {
  const emojis = ['✨', '💫', '⭐', '🌟', '💕', '🤍'];
  const count = 18;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.fontSize = (0.7 + Math.random() * 0.9) + 'rem';
    p.style.animationDuration = (8 + Math.random() * 14) + 's';
    p.style.animationDelay = (Math.random() * 12) + 's';
    p.style.opacity = '0';
    particlesContainer.appendChild(p);
  }
}

// ---- PETALS ----
const petalEmojis = ['🌸', '🌺', '🌷', '🌹', '💮', '🏵️'];

function spawnPetal() {
  const petal = document.createElement('div');
  petal.classList.add('petal');
  petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
  petal.style.left = Math.random() * 100 + 'vw';
  petal.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
  const dur = 6 + Math.random() * 8;
  petal.style.animationDuration = dur + 's';
  petal.style.animationDelay = '0s';
  petalsContainer.appendChild(petal);

  // Remove after animation
  setTimeout(() => {
    petal.remove();
  }, (dur + 1) * 1000);
}

function startPetals() {
  spawnPetal();
  petalInterval = setInterval(spawnPetal, 1800);
}

// ---- CONFETTI ----
const confettiColors = [
  '#FAF6F0', '#D8A7B1', '#4A3B32'
];

const confettiShapes = ['circle', 'rect', 'heart'];

function createConfettiPiece() {
  const piece = document.createElement('div');
  piece.classList.add('confetti-piece');

  const shape = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
  const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
  const size = 6 + Math.random() * 10;

  piece.style.left = Math.random() * 100 + 'vw';
  piece.style.top = '-20px';
  piece.style.width = size + 'px';
  piece.style.height = size + 'px';
  piece.style.backgroundColor = color;
  piece.style.animationDuration = (2 + Math.random() * 3) + 's';
  piece.style.animationDelay = Math.random() * 2 + 's';

  if (shape === 'circle') {
    piece.style.borderRadius = '50%';
  } else if (shape === 'rect') {
    piece.style.borderRadius = '2px';
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
  } else if (shape === 'heart') {
    piece.textContent = '💕';
    piece.style.backgroundColor = 'transparent';
    piece.style.fontSize = size + 'px';
  }

  confettiContainer.appendChild(piece);

  setTimeout(() => piece.remove(), 5000);
}

function triggerEntryConfetti() {
  if (!surpriseDone) {
    // Lighter confetti on page 5 entry
    for (let i = 0; i < 40; i++) {
      setTimeout(() => createConfettiPiece(), i * 50);
    }
  }
}

function triggerSurprise() {
  surpriseDone = true;

  // Hide surprise button
  const surpriseBtn = document.getElementById('surprise-btn');
  if (surpriseBtn) {
    surpriseBtn.disabled = true;
    surpriseBtn.style.opacity = '0.5';
    surpriseBtn.style.transform = 'scale(0.95)';
  }

  // Show surprise message
  const msg = document.getElementById('surprise-message');
  if (msg) {
    msg.classList.add('visible');
  }

  // Massive confetti burst
  for (let wave = 0; wave < 5; wave++) {
    setTimeout(() => {
      for (let i = 0; i < 60; i++) {
        setTimeout(() => createConfettiPiece(), i * 30);
      }
    }, wave * 600);
  }

  // Extra petals
  for (let i = 0; i < 10; i++) {
    setTimeout(() => spawnPetal(), i * 200);
  }
}

// ---- DAYS TOGETHER CALCULATION ----
function updateDaysTogether() {
  const anniversaryDate = new Date('2022-11-26'); // Tanggal mulai (4 tahun lalu)
  const today = new Date();
  const diff = Math.floor((today - anniversaryDate) / (1000 * 60 * 60 * 24));

  const daysEl = document.getElementById('days-together');
  if (daysEl && diff > 0) {
    daysEl.textContent = `${diff.toLocaleString('id-ID')} hari bersama 💕`;
  } else if (daysEl) {
    daysEl.textContent = 'Hari yang dinantikan 💕';
  }
}

// ---- PHOTO LIGHTBOX ----
function initPhotoClick() {
  setTimeout(() => {
    // All scrap photos and polaroid frames
    document.querySelectorAll('.scrap-photo, .polaroid-frame img, .mini-polaroid img').forEach(img => {
      img.addEventListener('click', (e) => {
        if (img.src && !img.src.includes('undefined') && img.complete && img.naturalWidth > 0) {
          openLightbox(img.src);
        }
      });
      img.style.cursor = 'pointer';
    });
  }, 500);
}

function openLightbox(src) {
  if (!src) return;
  lbImg.src = src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

// Close lightbox on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ---- LOCAL MUSIC ----
function updateMusicButton(isPlaying) {
  if (!musicBtn) return;

  const icon = isPlaying ? '🎵' : '▶️';
  const label = isPlaying ? 'Kita Lewati Berdua ♪' : 'Kita Lewati Berdua';
  musicBtn.innerHTML = `<span class="music-icon">${icon}</span><span class="music-label">${label}</span>`;
  musicBtn.title = isPlaying ? 'Jeda musik' : 'Putar musik';
  musicBtn.setAttribute('aria-label', isPlaying ? 'Jeda musik latar' : 'Putar musik latar');
  musicBtn.classList.toggle('playing', isPlaying);
}

function initLocalMusic() {
  if (!musicAudio) return;

  musicAudio.addEventListener('play', () => updateMusicButton(true));
  musicAudio.addEventListener('pause', () => updateMusicButton(false));
  musicAudio.addEventListener('error', () => {
    if (!musicBtn) return;
    musicBtn.innerHTML = '<span class="music-icon">⚠️</span><span class="music-label">File lagu belum tersedia</span>';
    musicBtn.title = 'Tambahkan file M4A atau MP3 di assets/music/';
    musicBtn.setAttribute('aria-label', 'File musik lokal belum tersedia');
    console.error('Musik lokal gagal dimuat. Pastikan file M4A atau MP3 ada di assets/music/ dan ikut dipublikasikan.');
  });
}

async function toggleMusic() {
  if (!musicAudio) return;

  if (!musicAudio.paused) {
    musicAudio.pause();
    return;
  }

  try {
    await musicAudio.play();
  } catch (error) {
    if (error.name === 'AbortError') return;

    const fileUnavailable = Boolean(musicAudio.error);
    if (musicBtn) {
      const label = fileUnavailable ? 'File lagu belum tersedia' : 'Musik gagal diputar';
      musicBtn.innerHTML = `<span class="music-icon">⚠️</span><span class="music-label">${label}</span>`;
      musicBtn.title = fileUnavailable ? 'Tambahkan file M4A atau MP3 di assets/music/' : 'Periksa pengaturan audio browser';
      musicBtn.setAttribute('aria-label', label);
    }
    console.error('Musik lokal gagal diputar. Periksa file M4A atau MP3 di assets/music/.', error);
  }
}

// ---- KEYBOARD NAVIGATION ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    if (currentPage < totalPages - 1) goToPage(currentPage + 1);
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    if (currentPage > 0) goToPage(currentPage - 1);
  }
});

// ---- TOUCH SWIPE NAVIGATION ----
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;

  // Only horizontal swipes wider than vertical movement
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
    if (dx < 0 && currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    } else if (dx > 0 && currentPage > 0) {
      goToPage(currentPage - 1);
    }
  }
}, { passive: true });

// ---- VIDEO: Hide placeholder if video loads ----
document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('main-video');
  const placeholder = document.getElementById('video-placeholder');
  if (video && placeholder) {
    video.addEventListener('loadeddata', () => {
      video.classList.add('ready');
      placeholder.style.display = 'none';
    });
    video.addEventListener('error', () => {
      video.classList.remove('ready');
      placeholder.style.display = 'flex';
    });

    // Check if video has a source
    const sources = video.querySelectorAll('source');
    if (sources.length === 0) {
      video.classList.remove('ready');
      placeholder.style.display = 'flex';
    }
  }
});

// ---- INTERSECTION OBSERVER for timeline items ----
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px'
};

const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateX(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.timeline-item').forEach((item, i) => {
  const isLeft = item.classList.contains('tl-left');
  item.style.opacity = '0';
  item.style.transform = isLeft ? 'translateX(-40px)' : 'translateX(40px)';
  item.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;
  timelineObserver.observe(item);
});

// ---- POLAROID HOVER TILT ----
document.querySelectorAll('.polaroid-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    item.style.transform = `perspective(400px) rotateY(${x * 15}deg) rotateX(${-y * 10}deg) scale(1.08)`;
  });

  item.addEventListener('mouseleave', () => {
    // Restore original tilt
    if (item.classList.contains('p-tilt-l')) {
      item.style.transform = 'rotate(-4deg)';
    } else if (item.classList.contains('p-tilt-r')) {
      item.style.transform = 'rotate(3deg)';
    } else {
      item.style.transform = '';
    }
  });

  // Click to open lightbox
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (img && img.src && img.complete && img.naturalWidth > 0) {
      openLightbox(img.src);
    }
  });
});

// ---- SCRAP CARD HOVER TILT ----
document.querySelectorAll('.scrap-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 5}deg) scale(1.03)`;
  });

  card.addEventListener('mouseleave', () => {
    if (card.classList.contains('tilt-left')) card.style.transform = 'rotate(-2deg)';
    else if (card.classList.contains('tilt-right')) card.style.transform = 'rotate(1.5deg)';
    else card.style.transform = '';
  });
});

// ---- ANNIVERSARY NUMBER TYPEWRITER ----
function typewriterEffect(el, text, speed = 80) {
  if (!el) return;
  el.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

// ---- RANDOM SPARKLE ON HOVER ----
document.querySelectorAll('.scrap-sticker').forEach(sticker => {
  sticker.addEventListener('mouseenter', () => {
    sticker.style.transform += ' scale(1.5)';
    sticker.style.transition = 'transform 0.3s';
  });
  sticker.addEventListener('mouseleave', () => {
    sticker.style.transform = sticker.style.transform.replace(' scale(1.5)', '');
  });
});

// ---- EXPOSE GLOBALS ----
window.goToPage = goToPage;
window.openLetter = openLetter;
window.triggerSurprise = triggerSurprise;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
