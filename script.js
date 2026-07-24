const loader = document.getElementById('loader');
window.addEventListener('load', ()=> setTimeout(()=> loader.classList.add('hide'), 260));

const header = document.getElementById('header');
const mobileDonate = document.querySelector('.mobile-donate');
const scrollTopBtn = document.getElementById('scrollTop');
let scrollTicking = false;
window.addEventListener('scroll', ()=>{
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(()=>{
    header.classList.toggle('scrolled', window.scrollY > 8);
    if (mobileDonate) mobileDonate.classList.toggle('hide', window.scrollY > window.innerHeight / 2);
    if (scrollTopBtn){
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const scrolledRatio = scrollable > 0 ? window.scrollY / scrollable : 0;
      scrollTopBtn.classList.toggle('show', scrolledRatio >= 0.5);
    }
    scrollTicking = false;
  });
});
if (scrollTopBtn){
  scrollTopBtn.addEventListener('click', ()=> window.scrollTo({top: 0, behavior: 'smooth'}));
}

const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
function closeMobileNav(){
  nav.classList.remove('open', 'drilled');
  nav.querySelectorAll('.nav-item.open').forEach(o => o.classList.remove('open'));
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
if (hamburger){
  hamburger.addEventListener('click', ()=>{
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));

nav.querySelectorAll('.nav-item').forEach(item => {
  const link = item.querySelector('.nav-link');
  if (!link) return;
  link.addEventListener('click', ()=>{
    const isOpen = item.classList.contains('open');
    nav.querySelectorAll('.nav-item.open').forEach(o => o.classList.remove('open'));
    if (isOpen){
      nav.classList.remove('drilled');
    } else {
      item.classList.add('open');
      nav.classList.add('drilled');
    }
    link.setAttribute('aria-expanded', String(!isOpen));
  });
});
document.addEventListener('click', e => {
  if (!e.target.closest('.nav-item')){
    nav.querySelectorAll('.nav-item.open').forEach(o => o.classList.remove('open'));
    nav.classList.remove('drilled');
  }
});

const heroCarousel = document.getElementById('heroCarousel');
if (heroCarousel){
  const slides = [...heroCarousel.querySelectorAll('.hero-slide')];
  const dots = [...heroCarousel.querySelectorAll('.hero-dot')];
  let current = 0;
  let timer;
  function goTo(i){
    current = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle('active', idx === current));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
  }
  function next(){ goTo(current + 1); }
  function prev(){ goTo(current - 1); }
  function startAutoplay(){ timer = setInterval(next, 6000); }
  function stopAutoplay(){ clearInterval(timer); }
  heroCarousel.querySelector('.hero-arrow--next')?.addEventListener('click', ()=>{ next(); stopAutoplay(); startAutoplay(); });
  heroCarousel.querySelector('.hero-arrow--prev')?.addEventListener('click', ()=>{ prev(); stopAutoplay(); startAutoplay(); });
  dots.forEach((d, idx) => d.addEventListener('click', ()=>{ goTo(idx); stopAutoplay(); startAutoplay(); }));
  heroCarousel.addEventListener('mouseenter', stopAutoplay);
  heroCarousel.addEventListener('mouseleave', startAutoplay);
  startAutoplay();
}

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('show');
  });
}, {threshold:.12});
document.querySelectorAll('.reveal').forEach(el=> observer.observe(el));

const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const videoFrame = modal.querySelector('#modalVideoFrame');
const modalTitle = modal.querySelector('#modalTitle');
const modalDesc = modal.querySelector('#modalDesc');
const YOUTUBE_VIDEO_ID = 'U3qcWAJgZIE';
const defaultModalTitle = modalTitle ? modalTitle.textContent : '';
const defaultModalDesc = modalDesc ? modalDesc.textContent : '';
document.querySelectorAll('.open-video').forEach(btn => btn.addEventListener('click', (e)=>{
  e.preventDefault();
  videoFrame.src = `https://www.youtube.com/embed/${btn.dataset.yt || YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`;
  if (modalTitle) modalTitle.textContent = btn.dataset.title || defaultModalTitle;
  if (modalDesc) modalDesc.textContent = btn.dataset.desc || defaultModalDesc;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}));
function shutModal(){
  modal.classList.remove('open');
  document.body.style.overflow = '';
  videoFrame.src = '';
  if (modalTitle) modalTitle.textContent = defaultModalTitle;
  if (modalDesc) modalDesc.textContent = defaultModalDesc;
}
closeModal.addEventListener('click', shutModal);
modal.addEventListener('click', e => { if(e.target === modal) shutModal(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') shutModal(); });

const countObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const start = performance.now();
    const dur = 1400;
    function tick(now){
      const p = Math.min((now - start)/dur, 1);
      const v = Math.floor(target * (1 - Math.pow(1-p, 3)));
      el.textContent = v.toLocaleString('en-IN') + '+';
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, {threshold:.35});
document.querySelectorAll('[data-count]').forEach(el=> countObserver.observe(el));

document.querySelectorAll('form').forEach(f => f.addEventListener('submit', e => {
  e.preventDefault();
  alert('Thank you for subscribing!');
  f.reset();
}));
