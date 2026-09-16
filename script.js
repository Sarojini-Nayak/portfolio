(function(){
  'use strict';

  /* ---------- scroll progress ---------- */
  var progressBar = document.getElementById('scroll-progress');
  function updateProgress(){
    var h = document.documentElement;
    var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }
  document.addEventListener('scroll', updateProgress, {passive:true});

  /* ---------- navbar scroll state + back to top ---------- */
  var navbar = document.getElementById('navbar');
  var backToTop = document.getElementById('back-to-top');
  document.addEventListener('scroll', function(){
    if(window.scrollY > 40){ navbar.classList.add('scrolled'); } else { navbar.classList.remove('scrolled'); }
    if(window.scrollY > 600){ backToTop.classList.add('show'); } else { backToTop.classList.remove('show'); }
  }, {passive:true});
  backToTop.addEventListener('click', function(){
    window.scrollTo({top:0, behavior:'smooth'});
  });

  /* ---------- mobile menu ---------- */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', function(){
    var open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });
  mobileMenu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded','false');
    });
  });

  /* ---------- hero typing animation ---------- */
  var roles = ['Data Analyst', 'Business Analyst', 'Python & SQL', 'Power BI & Excel', 'Turning Data Into Decisions'];
  var typedEl = document.getElementById('typed-role');
  var ri=0, ci=0, deleting=false;
  function typeLoop(){
    var current = roles[ri];
    if(!deleting){
      ci++;
      typedEl.textContent = current.slice(0,ci);
      if(ci === current.length){ deleting = true; setTimeout(typeLoop, 1400); return; }
    } else {
      ci--;
      typedEl.textContent = current.slice(0,ci);
      if(ci === 0){ deleting = false; ri = (ri+1)%roles.length; }
    }
    setTimeout(typeLoop, deleting ? 35 : 65);
  }
  typeLoop();

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});
  revealEls.forEach(function(el){ io.observe(el); });

  /* ---------- project filtering ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      filterBtns.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      projectCards.forEach(function(card){
        var cats = card.getAttribute('data-cat');
        if(filter === 'all' || cats.indexOf(filter) !== -1){
          card.classList.remove('hidden-filter');
        } else {
          card.classList.add('hidden-filter');
        }
      });
    });
  });

  /* ---------- contact form validation + Google Sheet submit ---------- */
  var scriptURL = 'https://script.google.com/macros/s/AKfycbwqiCdfiNfzfv07KQ1630VAtCcX45idCoHAJpD1cnNmP_QWWxpVnXv2ij0v0wMPGYRg/exec';
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('f-name');
    var email = document.getElementById('f-email');
    var message = document.getElementById('f-message');
    var valid = true;

    function toggleError(input, errId, condition){
      var err = document.getElementById(errId);
      if(condition){ input.classList.add('invalid'); err.classList.add('show'); valid = false; }
      else { input.classList.remove('invalid'); err.classList.remove('show'); }
    }

    toggleError(name, 'err-name', name.value.trim().length === 0);
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    toggleError(email, 'err-email', !emailPattern.test(email.value.trim()));
    toggleError(message, 'err-message', message.value.trim().length === 0);

    if(!valid) return;

    status.classList.remove('success','error');
    status.textContent = 'Sending...';
    status.classList.add('success');

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
      .then(function(){
        status.textContent = 'Message sent successfully! Thanks for reaching out.';
        status.classList.remove('error');
        status.classList.add('success');
        form.reset();
      })
      .catch(function(){
        status.textContent = 'Something went wrong — please email me directly instead.';
        status.classList.remove('success');
        status.classList.add('error');
      });
  });
})();
